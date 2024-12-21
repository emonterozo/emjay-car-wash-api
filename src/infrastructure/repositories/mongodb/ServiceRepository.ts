import { IServiceRepsository } from "src/application/ports/repositories/IServiceRepository";
import { ServiceObject } from "src/application/use-cases/services/interfaces/common";
import { MongoDB } from "./MongoDB";
import { Collection } from "mongodb";

export class ServiceRepository implements IServiceRepsository {

    private readonly mongo_client = MongoDB.instance();

    public async findAll(): Promise<ServiceObject[]> {
        await this.mongo_client.connect();
        const db = this.mongo_client.db(process.env.MONGO_DATASOURCE);
        const collection: Collection<ServiceObject> = db.collection(process.env.MONGO_SERVICES_COLLECTION!);
        const entries = await collection.find({}).toArray();

        await this.mongo_client.close();

        return entries.map(entry => ({
            ...entry,
            rating: {
                "1": 5,
                "2": 10,
                "3": 30,
                "4": 80,
                "5": 220
            }
        }));
    }
}