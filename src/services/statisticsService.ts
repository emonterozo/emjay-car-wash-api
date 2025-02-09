import Transaction from '../models/transactionModel';
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
    { $match: { 'availed_services.status': 'DONE' } },
    { $unwind: '$availed_services' },
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
