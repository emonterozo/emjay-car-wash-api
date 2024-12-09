import { AdminLoginUseCase } from "src/application/use-cases/auth/AdminLoginUseCase";
import { MockPasswordHasher } from "src/infrastructure/services/PasswordHasher";
import { AdminLoginController } from "./AdminLoginController";
import { MockUserRepository } from "src/infrastructure/repositories/mocks/MockUserRepository";
import { MongoUserRepository } from "src/infrastructure/repositories/mongodb/MongoUserRepository";
import { TokenService } from "src/infrastructure/services/TokenService";

// Repositories
const user_repository = new MockUserRepository();
const mongo_user_repository = new MongoUserRepository();

// Services
const password_service = new MockPasswordHasher();
const token_service = new TokenService();

// Use Cases
const login_usecase = new AdminLoginUseCase(
    mongo_user_repository,
    password_service,
    token_service
);

// Controllers
export const adminLoginController = new AdminLoginController(login_usecase)