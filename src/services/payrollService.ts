import Transaction from '../models/transactionModel';

type UnclaimedTransactions = {
  transaction_id: string;
  transaction_service_id: string;
  service_name: string;
  image: string;
  price: number;
  is_free: boolean;
  deduction: number;
  employee_share: number;
  assigned_employee_id: string[];
  date: Date;
};

export const getUnclaimedTransactions = async () => {
  let filter: any = {
    status: 'COMPLETED',
    availed_services: {
      $elemMatch: {
        status: 'DONE',
      },
    },
  };

  const transactions = await Transaction.find(filter)
    .populate({
      path: 'availed_services.service_id',
      select: 'title image',
    })
    .sort({ check_out: 'desc' });

  const formattedTransaction: UnclaimedTransactions[] = [];

  transactions.forEach((transaction) => {
    transaction.availed_services
      .filter((service) => !service.is_claimed)
      .forEach((service) => {
        //@ts-ignore
        const { title, image } = service.service_id;

        formattedTransaction.push({
          transaction_id: transaction._id.toString(),
          transaction_service_id: service._id.toString(),
          service_name: title,
          image: image,
          price: service.price as number,
          is_free: service.is_free as boolean,
          deduction: service.deduction as number,
          employee_share: service.employee_share as number,
          assigned_employee_id: service.assigned_employee_id.toObject(),
          date: transaction.check_out!,
        });
      });
  });

  try {
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
