import { CreateUserUseCase } from "../../../application/use-cases/users/CreateUserUseCase";
import { CreateUserController } from "../../../infrastructure/controllers/users/CreateUserController";
import { MockUserRepository } from "../../../infrastructure/repositories/mocks/MockUserRepository";
import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
import { MockPasswordHasher } from "../../../infrastructure/services/PasswordHasher";

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