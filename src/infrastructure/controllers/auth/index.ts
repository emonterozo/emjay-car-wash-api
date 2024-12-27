import { AdminLoginUseCase } from '../../../application/use-cases/auth/AdminLoginUseCase';
import { BCryptPasswordHasher } from '../../../infrastructure/services/BcryptPasswordHasher';
import { AdminLoginController } from './AdminLoginController';
import { MockUserRepository } from '../../../infrastructure/repositories/mocks/MockUserRepository';
import { MongoUserRepository } from '../../../infrastructure/repositories/mongodb/MongoUserRepository';
import { TokenService } from '../../../infrastructure/services/TokenService';

// Repositories
const user_repository = new MockUserRepository();
const mongo_user_repository = new MongoUserRepository();

// Services
const password_service = new BCryptPasswordHasher();
const token_service = new TokenService();

// Use Cases
const login_usecase = new AdminLoginUseCase(mongo_user_repository, password_service, token_service);

// Controllers
export const adminLoginController = new AdminLoginController(login_usecase);
