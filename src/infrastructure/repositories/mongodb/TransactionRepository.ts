import { ITransactionInput, ITransactionRepository } from "src/application/ports/repositories/ITransactionRepository";
import { TransactionObject, TransactionStatus } from "src/application/use-cases/transactions/interfaces/common";
import { IGetAllTransactionsParams } from "src/application/use-cases/transactions/interfaces/IGetAllTransactionUseCase";
import { MongoDB } from "./MongoDB";
import { Collection, ObjectId } from "mongodb";
import { InsertedId } from "src/application/ports/repositories/common";
import { PartialField } from "src/application/utils/types";

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
    const collection: Collection<ITransactionCollection> = database.collection(process.env.MONGO_TRANSACTIONS_COLLECTION!);

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


    const not = params?.not?.map(condition => {
      if (condition.field === 'id')
        return { _id: new ObjectId(condition.value) };

      if (condition.field === 'customer_id')
        return { customer_id: new ObjectId(condition.value) };

      return { [condition.field]: condition.value }
    });

    const transactions = await collection
      .aggregate([
        {
          $ne: {
            "services.end_date": "apple"
          }
        },
        // {
        //   $addFields: {
        //     fruit: {
        //       $filter: {
        //         input: "$fruit",
        //         cond: {
        //           $eq: [
        //             "$$this.foodName",
        //             "apple"
        //           ]
        //         }
        //       }
        //     }
        //   }
        // }
      ])
    // .find({
    //   [params?.range?.field ?? '']: {
    //     $gte: params?.range?.start,
    //     $lte: params?.range?.end
    //   },
    //   ...(and?.length ? { $and: and } : {}),
    //   ...(or?.length ? { $or: or } : {}),
    //   'services.price': {
    //     $ne: 500
    //   }
    // })
    // .toArray();

    console.log(transactions)

    return transactions.map<TransactionObject>(transac => ({
      check_in: transac.check_in,
      id: transac._id.toString(),
      model: transac.model,
      plate_number: transac.plate_number,
      vehicle_size: transac.vehicle_size,
      vehicle_type: transac.vehicle_type,
      contact_number: transac.contact_number,
      customer_id: transac.customer_id?.toString(),
      services: transac.services.map(service => ({
        assigned_employee_id: service.assigned_employee_id.map(employee_id => employee_id.toString()),
        company_earnings: service.company_earnings,
        deduction: service.deduction,
        employee_share: service.employee_share,
        id: service.service_id.toString(),
        is_free: service.is_free,
        status: service.status,
        end_date: service.end_date,
        start_date: service.start_date,
      }))
    }))
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