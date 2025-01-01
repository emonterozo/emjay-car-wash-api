import { ITransactionRepository } from "src/application/ports/repositories/ITransactionRepository";
import { TransactionObject } from "src/application/use-cases/transactions/interfaces/common";
import { IGetAllTransactionsParams } from "src/application/use-cases/transactions/interfaces/IGetAllTransactionUseCase";
import { MongoDB } from "./MongoDB";
import { Collection, ObjectId } from "mongodb";

interface ITransctionCollection {
  _id: ObjectId;
  vehicle_type: string;
  vehicle_size: string;
  model: string;
  price: number;
  deduction: number;
  company_earnings: number;
  employee_share: number;
  check_ing: string;
  completed_on: string;
  is_free: boolean;
  claimed_by: string;
  service_id: ObjectId;
  customer_id: ObjectId;
  assigned_employee_id: ObjectId[];
}

export class TransactionRepository implements ITransactionRepository {

  private readonly _mongo_client = MongoDB.instance();

  public async findAll(params?: IGetAllTransactionsParams): Promise<TransactionObject[]> {
    await this._mongo_client.connect();
    const database = this._mongo_client.db(process.env.MONGO_DATASOURCE);
    const collection: Collection<ITransctionCollection> = database.collection(process.env.MONGO_TRANSACTIONS_COLLECTION!);

    const transactions = await collection
      .find({
        date: {
          $gte: new Date("2024-12-24"), // params?.range?.start,
          $lt: new Date("2024-12-24") // params?.range?.end,
        }
      })
      .toArray();

    return transactions.map(transac => ({
      ...transac,
      id: transac._id.toString(),
      service_id: transac.service_id.toString(),
      customer_id: transac.customer_id.toString(),
      assigned_employee_id: transac.assigned_employee_id.map(emp => emp.toString())
    }))
  }
}