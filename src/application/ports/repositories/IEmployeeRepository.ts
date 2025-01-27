import { EmployeeObject } from "src/application/use-cases/employees/common";
import { FindAllOptions } from "./common";


export interface IEmployeeRepository {
    findAll(options?: FindAllOptions<EmployeeObject>): Promise<EmployeeObject[]>;
}