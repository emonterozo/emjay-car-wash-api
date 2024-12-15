import { Collection, MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import { ICustomerRepository } from "src/application/ports/repositories/ICustomerRepository";
import { CustomerObject } from "src/application/use-cases/customers/interfaces/common";

export class MongoCustomerRepository implements ICustomerRepository {

    private readonly client = new MongoClient(process.env.MONGO_CONNECTION_STRING!, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });


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
}