import { IEmployeeRepository } from "../../../application/ports/repositories/IEmployeeRepository";
import { CreateEmployeeInput } from "./common";
import { CreateEmployeeUseCaseResult, ICreateEmployeeUseCase } from "./interfaces/ICreateEmployeeUseCase";
import { ErrorMessage } from "../../../application/ports/common";
import { EmployeeEntity } from "../../../domain/entities/EmployeeEntity";

export class CreateEmployeeUseCase implements ICreateEmployeeUseCase {

    constructor(private readonly employee_repository: IEmployeeRepository) { }

    public async execute(input: CreateEmployeeInput): Promise<CreateEmployeeUseCaseResult> {
        const errors: ErrorMessage[] = [];

        const employee = EmployeeEntity.create(input);

        const birth_err_msg = employee.validateBirthDate();
        if (birth_err_msg) errors.push({ field: 'birth_date', message: birth_err_msg });
        const first_name_err_msg = employee.validateFirstName();
        if (first_name_err_msg) errors.push({ field: 'first_name', message: first_name_err_msg });

        const last_name_err_msg = employee.validateLastName();
        if (last_name_err_msg) errors.push({ field: 'last_name', message: last_name_err_msg });

        const gender_err_msg = employee.validateGender();
        if (gender_err_msg) errors.push({ field: 'gender', message: gender_err_msg });

        const contact_number_err_msg = employee.validateContactNumber();
        if (contact_number_err_msg) errors.push({ field: 'contact_number', message: contact_number_err_msg });

        const employee_title_err_msg = employee.validateEmployeeTitle();
        if (employee_title_err_msg) errors.push({ field: 'employee_title', message: employee_title_err_msg });

        const employee_status_err_msg = employee.validateEmployeeStatus();
        if (employee_status_err_msg) errors.push({ field: 'employee_status', message: employee_status_err_msg });

        if (errors.length > 0) return {
            errors: errors,
            result: null
        }

        const inserted_id = await this.employee_repository.create({
            birth_date: new Date(input.birth_date),
            date_started: new Date(input.date_started),
            contact_number: input.contact_number,
            employee_title: input.employee_title,
            employee_status: input.employee_status,
            first_name: input.first_name,
            gender: input.gender,
            last_name: input.last_name
        });

        if (!inserted_id) return {
            errors: [{ field: '', message: 'Failed to create employee' }],
            result: null
        }

        return {
            errors: [],
            result: { employee_id: inserted_id }
        }
    }
}