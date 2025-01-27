import { GetAllEmployeeesUseCase } from "../../../application/use-cases/employees/GetAllEmployeesUseCase";
import { EmployeeRepository } from "../../../infrastructure/repositories/mongodb/EmployeeRepository";
import { GetAllEmployeesController } from "./GetAllEmployeesController";

// Repositories
const employee_repository = new EmployeeRepository();

// Use Cases
const getAllEmployees = new GetAllEmployeeesUseCase(employee_repository);

// Controllers
export const get_all_employees_controller = new GetAllEmployeesController(getAllEmployees);