import { ITransactionRepository } from "src/application/ports/repositories/ITransactionRepository";
import { TransactionObject } from "src/application/use-cases/transactions/interfaces/common";
import { IGetAllTransactionsParams } from "src/application/use-cases/transactions/interfaces/IGetAllTransactionUseCase";
import { MongoDB } from "./MongoDB";
import { Collection, ObjectId } from "mongodb";

interface ITransactionCollection {
  _id: ObjectId;
  customer_id?: ObjectId;
  vehicle_type: string;
  vehicle_size: string;
  model: string;
  plate_number: string;
  contact_number?: string;
  check_in: Date;
  services: {
    service_id: ObjectId;
    deduction: number;
    company_earnings: number;
    employee_share: number;
  check_ing: string;
  completed_on: Date;
  is_free: boolean;
  claimed_by: string;
  service_id: ObjectId;
  customer_id: ObjectId;
    assigned_employee_id: ObjectId[];
    start_date?: Date;
    end_date?: Date;
    status: string;
    is_free: boolean;
  }[]
}

export class TransactionRepository implements ITransactionRepository {

  private readonly _mongo_client = MongoDB.instance();

  public async findAll(params?: IGetAllTransactionsParams): Promise<TransactionObject[]> {
    await this._mongo_client.connect();
    const database = this._mongo_client.db(process.env.MONGO_DATASOURCE);
    const collection: Collection<ITransctionCollection> = database.collection(process.env.MONGO_TRANSACTIONS_COLLECTION!);

    const and = params?.and_conditions?.map(condition => {
      if (condition.field === 'id')
        return { _id: new ObjectId(condition.value) };

      if (condition.field === 'customer_id')
        return { customer_id: new ObjectId(condition.value) };

      return { [condition.field]: condition.value }
    })
    
    const or = params?.or_conditions?.map(condition => {
      if (condition.field === 'id')
        return { _id: new ObjectId(condition.value) };

      if (condition.field === 'customer_id')
        return { customer_id: new ObjectId(condition.value) };

      return { [condition.field]: condition.value }
    })

    const transactions = await collection
      .find({
        [params?.range?.field ?? '']: {
          $gte: params?.range?.start,
          $lte: params?.range?.end
        },
        ...(and?.length ? { $and: and } : {}),
        ...(or?.length ? { $or: or } : {}),
      })
      .toArray();

    return []
    // return transactions.map(transac => ({
    //   ...transac,
    //   id: transac._id.toString(),
    //   service_id: transac.service_id.toString(),
    //   customer_id: transac.customer_id.toString(),
    //   assigned_employee_id: transac.assigned_employee_id.map(emp => emp.toString()),
    //   completed_on: transac.completed_on.toISOString()
    // }))
  }

  public async save(params: ITransactionInput): Promise<InsertedId> {
    // console.log("adada");
    await this._mongo_client.connect();
    const database = this._mongo_client.db(process.env.MONGO_DATASOURCE);
    const collection: Collection<PartialField<ITransactionCollection, '_id'>> = database.collection(process.env.MONGO_TRANSACTIONS_COLLECTION!);

    // return "asdfadfa"

    const response = await collection.insertOne({
      check_in: params.check_in,
      model: params.model,
      plate_number: params.plate_number,
      vehicle_size: params.vehicle_size,
      vehicle_type: params.vehicle_type,
      contact_number: params.contact_number,
      customer_id: new ObjectId(params.customer_id),
      services: params.services.map(service => ({
        service_id: new ObjectId(service.id),
        deduction: service.deduction,
        company_earnings: service.company_earnings,
        employee_share: service.employee_share,
        assigned_employee_id: service.assigned_employee_id.map(emp => new ObjectId(emp)),
        start_date: service.start_date,
        end_date: service.end_date,
        status: service.status,
        is_free: service.is_free
      }))

    });

    return response.insertedId.toString();
  }
}