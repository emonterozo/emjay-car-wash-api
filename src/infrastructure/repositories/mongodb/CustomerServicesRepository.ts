import { Collection, MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import { ICustomerServicesRepository } from "src/application/ports/repositories/ICustomerServiceRepository";
import { CustomerId, CustomerServicesObject } from "src/application/use-cases/customers/interfaces/common";
import { MongoDB } from "./MongoDB";

export class CustomerServicesRepository implements ICustomerServicesRepository {
    private readonly client = MongoDB.instance();

    public async getCustomerServicesById(id: CustomerId): Promise<CustomerServicesObject | null> {

        console.log(id)
        
        await this.client.connect();

        const database = await this.client.db(process.env.MONGO_DATASOURCE);
        const collection: Collection<CustomerServicesObject> = database.collection(process.env.MONGO_CUSTOMERS_COLLECTION!);
        const customer_services = await collection.findOne({ _id: new ObjectId(id) })

        if (!customer_services) return null;

        return {
            id: customer_services._id.toString(),
            first_name: customer_services.first_name,
            last_name: customer_services.last_name,
            contact_number: customer_services.contact_number,
            car_services_count: customer_services.car_services_count,
            motor_services_count: customer_services.motor_services_count,
        };
    }
}