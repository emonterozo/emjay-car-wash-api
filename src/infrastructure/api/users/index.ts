import { CreateUserUseCase } from '../../../application/use-cases/users/CreateUserUseCase';
import { CreateUserController } from '../../../infrastructure/controllers/users/CreateUserController';
import { MockUserRepository } from '../../../infrastructure/repositories/mocks/MockUserRepository';
import { MongoUserRepository } from '../../../infrastructure/repositories/mongodb/MongoUserRepository';
import { BCryptPasswordHasher } from '../../../infrastructure/services/BcryptPasswordHasher';

// Repositories
const mongo_user_repository = new MongoUserRepository();
const user_repository =
  process.env.IS_PRODUCTION === 'YES' ? new MongoUserRepository() : new MockUserRepository();

// Services
const password_service = new BCryptPasswordHasher();

// Use Cases
const createUserUseCase = new CreateUserUseCase(mongo_user_repository, password_service);

// Controllers
export const createUserController = new CreateUserController(createUserUseCase);
