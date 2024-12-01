import { CreateUserInput, UserId, UserObject } from "src/application/use-cases/users/interfaces.ts/common";
import { InsertedId } from "./common";

export interface IUserRepository {
    create(input: CreateUserInput): Promise<InsertedId>;
    retrieve(id: UserId): Promise<UserObject | null>;
}