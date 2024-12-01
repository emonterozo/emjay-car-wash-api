import { InsertedId } from "src/application/ports/repositories/common"
import { IUserRepository } from "src/application/ports/repositories/IUserRepository"
import { CreateUserInput, UserId, UserObject } from "src/application/use-cases/users/interfaces.ts/common"

export class MockUserRepository implements IUserRepository {
    private current_id: number = 1;
    private users: Map<UserId, UserObject> = new Map();

    async create(input: CreateUserInput): Promise<InsertedId> {
        const inserted_id = this.current_id.toString();
        this.users.set(inserted_id, {
            id: inserted_id,
            email: input.email,
            lastname: input.lastname,
            name: input.name,
            password: input.password
        });
        this.current_id++;
        return inserted_id
    }
    async retrieve(id: UserId): Promise<UserObject | null> {
        const user = this.users.get(id);

        if (!user)
            return null

        return user;
    }
}