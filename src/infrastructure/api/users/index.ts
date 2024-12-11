import { CreateUserUseCase } from "src/application/use-cases/users/CreateUserUseCase";
import { CreateUserController } from "src/infrastructure/controllers/users/CreateUserController";
import { MockUserRepository } from "src/infrastructure/repositories/mocks/MockUserRepository";
import { MongoUserRepository } from "src/infrastructure/repositories/mongodb/MongoUserRepository";
import { MockPasswordHasher } from "src/infrastructure/services/PasswordHasher";

// Repositories
const mongo_user_repository = new MongoUserRepository()
const user_repository = process.env.IS_PRODUCTION === 'YES'
    ? new MongoUserRepository()
    : new MockUserRepository();

// Services
const mock_password_service = new MockPasswordHasher();

// Use Cases
const createUserUseCase = new CreateUserUseCase(mongo_user_repository, mock_password_service);

// Controllers
export const createUserController = new CreateUserController(createUserUseCase);