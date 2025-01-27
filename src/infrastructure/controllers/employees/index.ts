import { TokenService } from "../../../infrastructure/services/TokenService";
import { CountEmployeesUseCase } from "../../../application/use-cases/employees/CountEmployeesUseCase";
import { GetAllEmployeeesUseCase } from "../../../application/use-cases/employees/GetAllEmployeesUseCase";
import { EmployeeRepository } from "../../../infrastructure/repositories/mongodb/EmployeeRepository";
import { GetAllEmployeesController } from "./GetAllEmployeesController";

// Repositories
const employee_repository = new EmployeeRepository();

// Services
const token_service = new TokenService();

// Use Cases
const getAllEmployees = new GetAllEmployeeesUseCase(employee_repository);
const countEmployees = new CountEmployeesUseCase(employee_repository);

// Controllers
export const get_all_employees_controller = new GetAllEmployeesController(
    getAllEmployees,
    countEmployees,
    token_service
);