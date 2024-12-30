import { Collection, MongoClient, ObjectId, ServerApiVersion, Sort } from 'mongodb';
import { ICustomerRepository } from '../../../application/ports/repositories/ICustomerRepository';
import {
  CustomerFilterInput,
  CustomerObject,
  CustomerRecentTransaction,
} from '../../../application/use-cases/customers/interfaces/common';
import { MongoDB } from './MongoDB';
import { IGetAllCustomerParams } from 'src/application/use-cases/customers/interfaces/IGetAllCustomers';

interface IServiceTransaction {
  _id: ObjectId;
  service_id: ObjectId;
  service: string;
  price: number;
  date: string;
}

interface IServiceCount {
  size: "sm" | "md" | "lg" | "xl" | "xxl";
  count: number;
}

interface ICustomerCollection {
  _id: ObjectId;
  first_name: string;
  last_name: string;
  birth_date: string;
  contact_number: string;
  password: string;
  province: string;
  city: string;
  barangay: string;
  address: string;
  registered_on: string;
  moto_wash_service_count: IServiceCount[];
  car_wash_service_count: IServiceCount[];
  recent_transactions: IServiceTransaction[];
}

export class MongoCustomerRepository implements ICustomerRepository {
  private readonly client = MongoDB.instance();

  public async retrieveAll(params?: IGetAllCustomerParams): Promise<CustomerObject[]> {
    await this.client.connect();
    const db = this.client.db(process.env.MONGO_DATASOURCE);
    const collection: Collection<ICustomerCollection> = db.collection(
      process.env.MONGO_CUSTOMERS_COLLECTION!,
    );

    const sorting: Sort = params?.order_by ? { [params?.order_by?.field]: params?.order_by?.direction === 'asc' ? 1 : -1 } : {};
    const limit = params?.limit ?? 0;
    const skip = params?.offset ?? 0;

    const entries = await collection.find({})
      .sort(sorting)
      .limit(limit)
      .skip(skip)
      .toArray();

    const customers_arr = entries.map<CustomerObject>(({
      _id, car_wash_service_count, moto_wash_service_count, recent_transactions, ...customer
    }) => {

      const transactions = recent_transactions.map<CustomerRecentTransaction>(transac => ({
        date: transac.date,
        id: transac._id.toString(),
        price: transac.price,
        service_id: transac.service_id.toString(),
        service_name: transac.service
      }))

      return {
        id: _id.toString(),
        car_services_count: car_wash_service_count,
        motor_services_count: moto_wash_service_count,
        recent_transactions: transactions,
        ...customer
      }
    })

    return customers_arr;
  }

  public async findOneBy(conditions: CustomerFilterInput): Promise<CustomerObject | null> {
    await this.client.connect();
    const db = this.client.db(process.env.MONGO_DATASOURCE);
    const collection: Collection<ICustomerCollection> = db.collection(
      process.env.MONGO_CUSTOMERS_COLLECTION!,
    );

    const { id, ...polished_filters }: CustomerFilterInput & { _id?: ObjectId } = conditions;
    if (id) polished_filters['_id'] = new ObjectId(id);

    const result = await collection.findOne({
      ...polished_filters,
    });

    if (!result) return null;

    const { _id, car_wash_service_count, moto_wash_service_count, recent_transactions, ...customer } = result;

    const transactions = recent_transactions.map<CustomerRecentTransaction>(transac => ({
      date: transac.date,
      id: transac._id.toString(),
      price: transac.price,
      service_id: transac.service_id.toString(),
      service_name: transac.service
    }))

    return {
      id: _id.toString(),
      recent_transactions: transactions,
      car_services_count: car_wash_service_count,
      motor_services_count: moto_wash_service_count,
      ...customer,
    };
  }

  public async count(): Promise<number> {
    await this.client.connect();
    const db = this.client.db(process.env.MONGO_DATASOURCE);
    const collection: Collection<Omit<CustomerObject, 'id'> & { _id: ObjectId }> = db.collection(
      process.env.MONGO_CUSTOMERS_COLLECTION!,
    );

    const customers_count = await collection.countDocuments();

    return customers_count;
  }
}
