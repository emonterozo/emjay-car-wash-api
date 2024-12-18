import { Collection, MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import { ICustomerRepository } from "src/application/ports/repositories/ICustomerRepository";
import { CustomerFilterInput, CustomerObject } from "src/application/use-cases/customers/interfaces/common";
import { MongoDB } from "./MongoDB";

export class MongoCustomerRepository implements ICustomerRepository {

    private readonly client = MongoDB.instance()

    public async retrieveAll(): Promise<CustomerObject[]> {
        await this.client.connect();
        const db = this.client.db(process.env.MONGO_DATASOURCE);
        const collection: Collection<Omit<CustomerObject, 'id'> & { _id: ObjectId }> = db.collection(process.env.MONGO_CUSTOMERS_COLLECTION!);
        const result = (await collection.find({}).toArray()).map(({ _id, ...customer }) => ({
            id: _id.toString(),
            ...customer
        }));
        return result
    }

    public async findOneBy(conditions: CustomerFilterInput): Promise<CustomerObject | null> {
        await this.client.connect();
        const db = this.client.db(process.env.MONGO_DATASOURCE);
        const collection: Collection<Omit<CustomerObject, 'id'> & { _id: ObjectId }> = db.collection(process.env.MONGO_CUSTOMERS_COLLECTION!);

        const { id, ...polished_filters }: CustomerFilterInput & { _id?: ObjectId } = conditions;
        if (id) polished_filters['_id'] = new ObjectId(id);

        const result = await collection.findOne({ 
            ...polished_filters
        });

        if (!result)
            return null;

        const { _id, ...customer } = result;

        return {
            id: _id.toString(),
            ...customer
        }
    }
}