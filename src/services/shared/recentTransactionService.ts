import mongoose, { Types } from 'mongoose';
import Transaction from '../../models/transactionModel';

type RecentTransaction = {
  id: string;
  service_name: string;
  price: number;
  date: Date;
};

export const recentTransactionService = async (
  type: 'customer' | 'employee',
  id: Types.ObjectId,
) => {
  try {
    const currentDate = new Date();
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 7);

    let filter: any = {
      status: 'COMPLETED',
      check_out: {
        $gte: sevenDaysAgo,
        $lte: currentDate,
      },
      services: {
        $elemMatch: {
          status: 'DONE',
        },
      },
    };

    if (type === 'customer') {
      filter.customer_id = id;
    } else {
      filter.services = {
        $elemMatch: {
          assigned_employee_id: id,
          status: 'DONE',
        },
      };
    }

    const transactions = await Transaction.find(filter)
      .populate({
        path: 'services.service_id',
        select: 'title',
      })
      .sort({ check_out: 'desc' });

    const formattedTransaction: RecentTransaction[] = [];

    transactions.forEach((transaction) => {
      transaction.services.forEach((service) => {
        // @ts-ignore
        const { title } = service.service_id;

        formattedTransaction.push({
          id: new mongoose.Types.ObjectId().toString(),
          service_name: title,
          price: service.price,
          date: transaction.check_out,
        } as RecentTransaction);
      });
    });

    return {
      success: true,
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
