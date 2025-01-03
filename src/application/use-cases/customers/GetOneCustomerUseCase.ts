import { ITransactionRepository } from '../../../application/ports/repositories/ITransactionRepository';
import { ICustomerRepository } from '../../../application/ports/repositories/ICustomerRepository';
import { CustomerFilterInput, CustomerRecentTransaction } from './interfaces/common';
import {
  GetCustomerUseCaseResponse,
  IGetOneCustomerUseCase,
} from './interfaces/IGetOneCustomerUseCase';
import { IServiceRepsository } from '../../../application/ports/repositories/IServiceRepository';

export class GetOneCustomerUseCase implements IGetOneCustomerUseCase {
  constructor(
    private readonly _customer_repository: ICustomerRepository,
    private readonly _transaction_repository: ITransactionRepository,
    private readonly _service_repository: IServiceRepsository
  ) { }

  public async execute(filters: CustomerFilterInput): Promise<GetCustomerUseCaseResponse> {
    const customer = await this._customer_repository.findOneBy(filters);

    if (!customer)
      return {
        errors: [{ field: '', message: 'Cannot find user' }],
        result: {
          customer: null,
        },
      };

    // Set range/limit for recent transactions
    const start = new Date(Date.now());
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 7);
    const end = new Date(Date.now());
    end.setHours(23, 59, 59, 59);

    // Gets recent transactions
    const transactions = await this._transaction_repository.findAll({
      and_conditions: [
        { field: 'customer_id', value: customer.id }
      ],
      range: {
        field: 'completed_on',
        start: start,
        end: end
      }
    });

    // Initializes recent transactions
    const recent_transactions: CustomerRecentTransaction[] = [];

    for (let transac of transactions) {
      // Gets service details
      const service = await this._service_repository.findOne({ id: transac.service_id });

      // Adds entry to recent transactions array
      recent_transactions.push({
        date: transac.completed_on.toString(),
        id: transac.id,
        price: transac.price,
        service_id: transac.service_id,
        service_name: service ? service.title : ''
      })
    }

    return {
      errors: [],
      result: {
        customer: {
          ...customer,
          recent_transactions
        }
      },
    };
  }
}
