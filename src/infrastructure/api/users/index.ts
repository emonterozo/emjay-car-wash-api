import { CreateUserUseCase } from "src/application/use-cases/users/CreateUserUseCase";
import { CreateUserController } from "src/infrastructure/controllers/users/CreateUserController";
import { MockUserRepository } from "src/infrastructure/repositories/mocks/MockUserRepository";
import { UserRepository } from "src/infrastructure/repositories/UserRepository";
import { MockPasswordHasher } from "src/infrastructure/services/PasswordHasher";

// Repositories
const user_repository = process.env.IS_PRODUCTION 
    ? new UserRepository()
    : new MockUserRepository();

// Services
const mock_password_service = new MockPasswordHasher();

// Use Cases
const createUserUseCase = new CreateUserUseCase(user_repository, mock_password_service);

// Controllers
export const createUserController = new CreateUserController(createUserUseCase);