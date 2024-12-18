
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import { Condition, InsertedId } from "src/application/ports/repositories/common";
import { IUserRepository } from "src/application/ports/repositories/IUserRepository";
import { CreateUserInput, UserDetails, UserId, UserObject, UserType } from "src/application/use-cases/users/interfaces.ts/common";
import { MongoDB } from "./MongoDB";

export class MongoUserRepository implements IUserRepository {
    private readonly client = MongoDB.instance();

    public async create(input: CreateUserInput): Promise<InsertedId> {

        await this.client.connect();
        const db = this.client.db(process.env.MONGO_DATASOURCE);
        const collection = db.collection(process.env.MONGO_ACCOUNTS_COLLECTION!);
        const result = await collection.insertOne({
            username: input.username,
            password: input.password,
            type: input.type
        });

        return result.insertedId.toString();
    }

    public async retrieve(id: UserId): Promise<UserObject | null> {
        try {
            await this.client.connect();
            const db = this.client.db(process.env.MONGO_DATASOURCE);
            const collection = db.collection(process.env.MONGO_ACCOUNTS_COLLECTION!);
            const user = await collection.findOne({ _id: new ObjectId(id) });

            if (user) return {
                id: user._id.toString(),
                type: user.type,
                username: user.username,
                password: user.password
            }

            return null;
        } catch (error) {
            return null;
        } finally {
            this.client.close();
        }
    }

    public async findOneBy(conditions: Condition<keyof UserDetails>[]): Promise<UserObject | null> {
        try {
            const condition = conditions.reduce((accum, curr) => {
                accum[curr.field] = curr.value as (any | UserType)
                return accum;
            }, {} as UserDetails);

            await this.client.connect();
            const db = this.client.db(process.env.MONGO_DATASOURCE);
            const collection = db.collection(process.env.MONGO_ACCOUNTS_COLLECTION!);
            const user = await collection.findOne(condition);

            if (user) return {
                id: user._id.toString(),
                type: user.type,
                username: user.username,
                password: user.password
            }
        } finally {
            await this.client.close();
        }
        return null
    }
}
