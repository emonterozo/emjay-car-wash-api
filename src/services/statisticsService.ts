import Transaction from '../models/transactionModel';
import Expense from '../models/expenseModel';
import { DateRange, Transactions } from '../common/types';
import { getDateRange } from '../utils/getDateRange';

export const getCurrentWeekSales = async ({ start, end }: DateRange) => {
  const transactions = await Transaction.find({
    status: 'COMPLETED',
    check_out: { $gte: start, $lte: end },
    availed_services: {
      $elemMatch: {
        status: 'DONE',
      },
    },
  })
    .populate({
      path: 'availed_services.service_id',
      select: 'title',
    })
    .sort({ check_out: 'asc' });

  const result = await Transaction.aggregate([
    { $match: { status: 'COMPLETED', check_out: { $gte: start, $lte: end } } },
    { $unwind: '$availed_services' },
    { $match: { 'availed_services.status': 'DONE' } },
    {
      $group: {
        _id: { date: { $dateToString: { format: '%Y-%m-%d', date: '$check_out' } } },
        gross_income: { $sum: '$availed_services.price' },
        company_earnings: { $sum: '$availed_services.company_earnings' },
        employee_share: { $sum: '$availed_services.employee_share' },
        deduction: { $sum: '$availed_services.deduction' },
        discount: { $sum: '$availed_services.discount' },
      },
    },
    {
      $sort: { '_id.date': 1 },
    },
  ]);

  const fullDateList = getDateRange(start, end);

  const finalResult = fullDateList.map((date) => {
    const data = result.find((entry) => entry._id.date === date);
    return {
      date,
      gross_income: data ? data.gross_income : 0,
      company_earnings: data ? data.company_earnings : 0,
      employee_share: data ? data.employee_share : 0,
      deduction: data ? data.deduction : 0,
      discount: data ? data.discount : 0,
    };
  });

  const formattedTransaction: Transactions[] = [];

  transactions.forEach((transaction) => {
    transaction.availed_services
      .filter((service) => service.status === 'DONE')
      .forEach((service) => {
        // @ts-ignore
        const { title } = service.service_id;

        formattedTransaction.push({
          id: service._id.toString(),
          transaction_id: transaction._id.toString(),
          service_name: title,
          // @ts-ignore
          price: service.price as Number,
          // @ts-ignore
          date: service.end_date,
        });
      });
  });

  try {
    return {
      success: true,
      results: finalResult,
      transactions: formattedTransaction,
    };
  } catch (error: any) {
    return {
      success: false,
      status: 500,
      error: {
        field: 'unknown',
        message: 'An unexpected error occurred',
      },
    };
  }
};

// Function to format the week identifier
const formatWeek = (date: Date) => {
  const temp = new Date(date);
  const dayOfWeek = temp.getUTCDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
  const diffToSunday = dayOfWeek === 0 ? 0 : -dayOfWeek; // Move back to Sunday
  temp.setUTCDate(temp.getUTCDate() + diffToSunday);
  return temp.toISOString().split('T')[0]; // YYYY-MM-DD format
};

export const getSalesStatistics = async (
  filter: 'daily' | 'weekly' | 'monthly' | 'yearly',
  end: Date,
) => {
  const filterType = filter;
  let start: Date;
  switch (filterType) {
    case 'daily':
      start = new Date(end);
      start.setDate(end.getDate() - 14); // Last 14 days
      break;
    case 'weekly':
      start = new Date(end);
      const dayOfWeek = start.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to Monday
      start.setUTCDate(start.getUTCDate() + diffToMonday - 28);
      break;
    case 'monthly':
      start = new Date(end);
      start.setMonth(end.getMonth() - 6); // Last 6 months
      break;
    case 'yearly':
      start = new Date(end);
      start.setFullYear(end.getFullYear() - 4); // Last 4 years
      break;
    default:
      start = new Date(end);
      start.setDate(end.getDate() - 28); // Default: Last 4 weeks
  }

  start.setUTCHours(0, 0, 0, 0);
  end.setUTCHours(23, 59, 59, 999);

  // MongoDB Date Formats
  const formatMap = {
    daily: '%Y-%m-%d',
    weekly: '%Y-%m-%d',
    monthly: '%Y-%m',
    yearly: '%Y',
  };

  // Function to generate all expected periods
  const generatePeriods = (start: Date, end: Date, type: string) => {
    const periods: string[] = [];
    const tempDate = new Date(start);

    while (tempDate <= end) {
      let formattedPeriod: string = '';
      if (type === 'daily') {
        formattedPeriod = tempDate.toISOString().split('T')[0]; // YYYY-MM-DD
        tempDate.setDate(tempDate.getDate() + 1);
      } else if (type === 'weekly') {
        formattedPeriod = formatWeek(tempDate);
        tempDate.setDate(tempDate.getDate() + 7);
      } else if (type === 'monthly') {
        formattedPeriod = `${tempDate.getUTCFullYear()}-${String(tempDate.getUTCMonth() + 1).padStart(2, '0')}`;
        tempDate.setMonth(tempDate.getMonth() + 1);
      } else if (type === 'yearly') {
        formattedPeriod = `${tempDate.getUTCFullYear()}`;
        tempDate.setFullYear(tempDate.getFullYear() + 1);
      }
      periods.push(formattedPeriod);
    }

    return periods;
  };

  // Get all expected periods
  const expectedPeriods = generatePeriods(start, end, filterType);

  // Aggregation Query
  const transactionsAggregation = await Transaction.aggregate([
    {
      $match: {
        status: 'COMPLETED',
        check_out: { $gte: start, $lte: end },
        'availed_services.status': 'DONE',
      },
    },
    { $unwind: '$availed_services' },
    {
      $group: {
        _id: {
          period:
            filterType === 'weekly'
              ? {
                  $dateToString: {
                    format: formatMap[filterType],
                    date: {
                      $dateTrunc: {
                        date: {
                          $dateSubtract: { startDate: '$check_out', unit: 'day', amount: 1 },
                        },
                        unit: 'week',
                        timezone: 'UTC',
                      },
                    },
                  },
                }
              : { $dateToString: { format: formatMap[filterType], date: '$check_out' } },
        },
        gross_income: { $sum: '$availed_services.price' },
        company_earnings: { $sum: '$availed_services.company_earnings' },
        employee_share: { $sum: '$availed_services.employee_share' },
        deduction: { $sum: '$availed_services.deduction' },
        discount: { $sum: '$availed_services.discount' },
      },
    },
    { $sort: { '_id.period': 1 } },
  ]);

  const expensesAggregation = await Expense.aggregate([
    {
      $match: {
        date: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: {
          period:
            filterType === 'weekly'
              ? {
                  $dateToString: {
                    format: formatMap[filterType],
                    date: {
                      $dateTrunc: {
                        date: {
                          $dateSubtract: { startDate: '$date', unit: 'day', amount: 1 },
                        },
                        unit: 'week',
                        timezone: 'UTC',
                      },
                    },
                  },
                }
              : { $dateToString: { format: formatMap[filterType], date: '$date' } },
        },
        amount: { $sum: '$amount' },
      },
    },
    { $sort: { '_id.period': 1 } },
  ]);

  // Convert aggregation result into a map without _id
  const transactionMap = new Map(
    transactionsAggregation.map(({ _id, ...item }) => [
      _id.period,
      { ...item, period: _id.period },
    ]),
  );

  // Ensure all expected periods exist in the result
  const finalTransactionResult = expectedPeriods.map(
    (period) =>
      transactionMap.get(period) || {
        period,
        gross_income: 0,
        company_earnings: 0,
        employee_share: 0,
        deduction: 0,
        discount: 0,
      },
  );

  // Convert aggregation result into a map without _id
  const expensesMap = new Map(
    expensesAggregation.map(({ _id, ...item }) => [_id.period, { ...item, period: _id.period }]),
  );

  // Ensure all expected periods exist in the result
  const finalExpensesResult = expectedPeriods.map(
    (period) =>
      expensesMap.get(period) || {
        period,
        amount: 0,
      },
  );

  // Get previous 14 days transaction base on current date
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 14);
  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(23, 59, 59, 999);

  const transactions = await Transaction.find({
    status: 'COMPLETED',
    check_out: { $gte: startDate, $lte: endDate },
    availed_services: {
      $elemMatch: {
        status: 'DONE',
      },
    },
  })
    .populate({
      path: 'availed_services.service_id',
      select: 'title',
    })
    .sort({ check_out: 'asc' });

  const formattedTransaction: Transactions[] = [];

  transactions.forEach((transaction) => {
    transaction.availed_services.forEach((service) => {
      // @ts-ignore
      const { title } = service.service_id;

      formattedTransaction.push({
        id: service._id.toString(),
        transaction_id: transaction._id.toString(),
        service_name: title,
        // @ts-ignore
        price: service.price as Number,
        // @ts-ignore
        date: transaction.check_out,
      });
    });
  });

  try {
    return {
      success: true,
      income: finalTransactionResult,
      expenses: finalExpensesResult,
      transactions: formattedTransaction,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      status: 500,
      error: {
        field: 'unknown',
        message: 'An unexpected error occurred',
      },
    };
  }
};
