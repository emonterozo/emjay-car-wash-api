import { MongoClient, ServerApiVersion } from "mongodb";

/**
 * Singleton MongoDB Client: This is to prevent multiple instance of mongodb
 */

export class MongoDB extends MongoClient {

    private static singleton_client: MongoClient | null = null;

    // Prevent outside instantiation
    private constructor() {
        super(process.env.MONGO_CONNECTION_STRING!, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
    }

    public static instance() {

        if (MongoDB.singleton_client === null) {
            MongoDB.singleton_client = new MongoDB();
        }

        return MongoDB.singleton_client;
    }
}