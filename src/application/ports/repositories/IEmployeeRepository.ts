import { EmployeeDetails, EmployeeFilterInput, EmployeeObject } from "src/application/use-cases/employees/common";
import { FindAllOptions, InsertedId } from "./common";

export interface CreateEmployeeParams extends EmployeeDetails {}

export interface IEmployeeRepository {
    findAll(options?: FindAllOptions<EmployeeObject>): Promise<EmployeeObject[]>;
    count(options?: FindAllOptions<EmployeeObject>): Promise<number>;
    findOne(filters?: EmployeeFilterInput): Promise<EmployeeObject | null>;
    create(params: CreateEmployeeParams): Promise<InsertedId | null>;
}