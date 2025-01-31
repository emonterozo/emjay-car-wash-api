export type EmployeeId = string;

export interface EmployeeDetails {
    first_name: string;
    last_name: string;
    gender: "MALE" | "FEMALE";
    employee_title: string;
    employee_status: "ACTIVE" | "TERMINATED";
    contact_number: string;
    birth_date: Date;
    date_started: Date;
}

export interface EmployeeObject extends EmployeeDetails {
    id: EmployeeId;
}

export interface EmployeeFilterInput extends Partial<EmployeeObject> {}

export interface CreateEmployeeInput extends Omit<EmployeeDetails, 'birth_date' | 'date_started'> {
    birth_date: string;
    date_started: string;
}