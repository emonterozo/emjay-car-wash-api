import mongoose from 'mongoose';
import Transaction from '../models/transactionModel';
import { DateRange } from '../common/types/listRequestBody';

type UnclaimedTransactions = {
  transaction_id: string;
  transaction_service_id: string;
  service_name: string;
  price: number;
  date: Date;
};

export const getTransactions = async ({ start, end }: DateRange) => {
  // console.log({})
  // const start = new Date('2025-01-29');
  // start.setHours(0, 0, 0, 0);

  // const end = new Date('2025-01-29');
  // end.setHours(23, 59, 59, 999);

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

  // for stats
  const result = await Transaction.aggregate([
    { $match: { status: 'COMPLETED', check_out: { $gte: start, $lte: end } } },
    { $match: { 'availed_services.status': 'DONE' } },
    { $unwind: '$availed_services' },
    {
      $group: {
        _id: null,
        gross_income: { $sum: '$availed_services.price' },
        company_earnings: { $sum: '$availed_services.company_earnings' },
        employee_share: { $sum: '$availed_services.employee_share' },
        deduction: { $sum: '$availed_services.deduction' },
      },
    },
  ]);

  const summary =
    result.length > 0
      ? {
          ...result[0],
          discount:
            result[0].gross_income -
            result[0].deduction -
            result[0].company_earnings -
            result[0].employee_share,
        }
      : {
          gross_income: 0,
          company_earnings: 0,
          employee_share: 0,
          deduction: 0,
          discount: 0,
        };

  const formattedTransaction: UnclaimedTransactions[] = [];

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

  // for employee computation
  // const empoyee = await Transaction.aggregate([
  //   { $match: { status: 'COMPLETED' } },
  //   { $unwind: '$availed_services' },
  //   { $match: { 'availed_services.status': 'DONE' } },
  //   {
  //     $match: {
  //       'availed_services.assigned_employee_id': {
  //         $all: [
  //           new mongoose.Types.ObjectId('6799a571cda5e97bdb5c875e'),
  //           //new mongoose.Types.ObjectId('6799a5e0cda5e97bdb5c8767'),
  //         ],
  //         $size: 1,
  //       },
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: null,
  //       gross_income: { $sum: '$availed_services.price' },
  //       company_earnings: { $sum: '$availed_services.company_earnings' },
  //       employee_share: { $sum: '$availed_services.employee_share' },
  //       deduction: { $sum: '$availed_services.deduction' },
  //     },
  //   },
  // ]);

  try {
    return {
      success: true,
      summary,
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

export const getTransactionDetailsById = async (
  transaction_id: string,
  transaction_service_id: string,
) => {
  try {
    const document = await Transaction.findById(transaction_id)
      .populate({
        path: 'customer_id',
        select: 'first_name last_name',
      })
      .populate({
        path: 'availed_services.service_id',
        select: 'title',
      })
      .populate({
        path: 'availed_services.assigned_employee_id',
        select: 'first_name last_name gender',
      })
      .exec();
    const service = document?.availed_services.find(
      (service) => service._id.toString() === transaction_service_id,
    );

    if (!service) {
      return {
        success: false,
        status: 404,
        error: {
          field: 'transaction_service_id',
          message: 'Transaction service does not exist',
        },
      };
    }

    const assigned_employees = service.assigned_employee_id.map((item) => {
      const { _id, ...object } = item.toObject();

      return {
        ...object,
        id: _id.toString(),
      };
    });

    if (document) {
      return {
        success: true,
        transaction: {
          id: document._id.toString(),
          transaction_service_id: service._id.toString(),
          // @ts-ignore
          first_name: document.customer_id?.first_name ?? 'EmJay',
          // @ts-ignore
          last_name: document.customer_id?.last_name ?? 'Customer',
          vehicle_type: document.vehicle_type,
          model: document.model,
          vehicle_size: document.vehicle_size,
          plate_number: document.plate_number,
          // @ts-ignore
          title: service.service_id?.title,
          price: service.price,
          deduction: service.deduction,
          discount: service.discount,
          company_earnings: service.company_earnings,
          employee_share: service.employee_share,
          start_date: service.start_date,
          end_date: service.end_date,
          assigned_employees,
        },
      };
    }

    return {
      success: false,
      status: 404,
      error: {
        field: 'transaction_id',
        message: 'Transaction does not exist',
      },
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
