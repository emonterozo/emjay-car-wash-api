import { InsertedId } from "src/application/ports/repositories/common";
import { IUserRepository } from "src/application/ports/repositories/IUserRepository";
import { CreateUserInput, UserId, UserObject } from "src/application/use-cases/users/interfaces.ts/common";

export class UserRepository implements IUserRepository {
    create(input: CreateUserInput): Promise<InsertedId> {
        return Promise.resolve("1");
    }

    retrieve(id: UserId): Promise<UserObject | null> {
        return Promise.resolve(null);
    }
}