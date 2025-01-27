export type EmployeeId = string;

export interface EmployeeDetails {
    first_name: string;
    last_name: string;
    gender: "MALE" | "FEMALE";
    employee_title: string;
    employee_status: "ACTIVE" | "TERMINATED";
}

export interface EmployeeObject extends EmployeeDetails {
    id: EmployeeId;
}