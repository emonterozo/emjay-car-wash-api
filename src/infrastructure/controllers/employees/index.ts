import { TokenService } from "../../../infrastructure/services/TokenService";
import { CountEmployeesUseCase } from "../../../application/use-cases/employees/CountEmployeesUseCase";
import { GetAllEmployeeesUseCase } from "../../../application/use-cases/employees/GetAllEmployeesUseCase";
import { EmployeeRepository } from "../../../infrastructure/repositories/mongodb/EmployeeRepository";
import { GetAllEmployeesController } from "./GetAllEmployeesController";
import { GetOneEmployeeController } from "./GetOneEmployeeController";
import { GetOneEmployeeUseCase } from "../../../application/use-cases/employees/GetOneEmployeeUseCase";
import { TransactionRepository } from "../../../infrastructure/repositories/mongodb/TransactionRepository";
import { GetAllTransactionsUseCase } from "../../../application/use-cases/transactions/GetAllTransactionsUseCase";
import { ServiceRepository } from "../../../infrastructure/repositories/mongodb/ServiceRepository";
import { GetOneServiceUseCase } from "../../../application/use-cases/services/GetOneServiceUseCase";

// Repositories
const employee_repository = new EmployeeRepository();
const transaction_repository = new TransactionRepository();
const service_repository = new ServiceRepository();

// Services
const token_service = new TokenService();

// Use Cases
const getAllEmployees = new GetAllEmployeeesUseCase(employee_repository);
const countEmployees = new CountEmployeesUseCase(employee_repository);
const getOneEmployee = new GetOneEmployeeUseCase(employee_repository);
const getRecentTransactions = new GetAllTransactionsUseCase(transaction_repository);
const getService = new GetOneServiceUseCase(service_repository);

// Controllers
export const get_all_employees_controller = new GetAllEmployeesController(
    getAllEmployees,
    countEmployees,
    token_service
);

export const get_employee_controller = new GetOneEmployeeController(
    getOneEmployee,
    getRecentTransactions,
    getService,
    token_service
);