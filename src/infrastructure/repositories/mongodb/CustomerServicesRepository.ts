import { Collection, MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import { ICustomerServicesRepository } from "src/application/ports/repositories/ICustomerServiceRepository";
import { CustomerId, CustomerServicesObject } from "src/application/use-cases/customers/interfaces/common";

export class CustomerServicesRepository implements ICustomerServicesRepository {
    private readonly client = new MongoClient(process.env.MONGO_CONNECTION_STRING!, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    public async getCustomerServicesById(id: CustomerId): Promise<CustomerServicesObject | null> {

        console.log(id)
        
        await this.client.connect();

        const database = await this.client.db(process.env.MONGO_DATASOURCE);
        const collection: Collection<CustomerServicesObject> = database.collection(process.env.MONGO_CUSTOMERS_COLLECTION!);
        const customer_services = await collection.findOne({ _id: new ObjectId(id) })
        console.log(customer_services);

        if (!customer_services) return null;

        return customer_services;
    }
}