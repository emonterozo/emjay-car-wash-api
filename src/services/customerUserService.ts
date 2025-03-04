import Transaction from '../models/transactionModel';
import { Transactions } from '../common/types';

type SizeKey = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
const SIZE_DESCRIPTION: Record<SizeKey, string> = {
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
  xl: 'Extra Large',
  xxl: 'Extra Extra Large',
};

export const getTransactions = async () => {
  const transactions = await Transaction.find({
    status: 'ONGOING',
  })
    .populate({
      path: 'availed_services.service_id',
      select: 'title',
    })
    .sort({ check_out: 'asc' });

  //console.log(transactions, start, end);

  const formattedTransaction: Transactions[] = [];

  transactions.forEach((transaction) => {
    //@ts-ignore
    transaction.availed_services
      // @ts-ignore
      .filter((service) => ['PENDING', 'ONGOING'].includes(service.status!))
      .forEach((service) => {
        // @ts-ignore
        const { title } = service.service_id;

        formattedTransaction.push({
          id: service._id.toString(),
          service_name: title,
          status: service.status,
          // @ts-ignore
          date: service.end_date,
          description: `${transaction.vehicle_type.charAt(0).toUpperCase()}${transaction.vehicle_type.slice(1)} ${SIZE_DESCRIPTION[transaction.vehicle_size]}`,
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
