import { EmployeeId } from "src/application/use-cases/employees/common";

interface EmployeeEntityParams {
    id?: EmployeeId;
    first_name: string;
    last_name: string;
    gender: "MALE" | "FEMALE";
    employee_title: string;
    employee_status: "ACTIVE" | "TERMINATED";
    contact_number: string;
    birth_date: string;
    date_started: string;
}

export const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;
export const CONTACT_NUMBER_REGEX = /^09\d{9}$/;

export class EmployeeEntity {
    private id?: EmployeeId;
    private first_name: string;
    private last_name: string;
    private gender: "MALE" | "FEMALE";
    private employee_title: string;
    private employee_status: "ACTIVE" | "TERMINATED";
    private contact_number: string;
    private birth_date: string;
    private date_started: string;

    private constructor(params: EmployeeEntityParams) {
        this.id = params.id;
        this.first_name = params.first_name;
        this.last_name = params.last_name;
        this.gender = params.gender;
        this.employee_title = params.employee_title;
        this.employee_status = params.employee_status;
        this.contact_number = params.contact_number;
        this.birth_date = params.birth_date;
        this.date_started = params.date_started;
    }

    public static create(params: EmployeeEntityParams) {
        return new EmployeeEntity(params);
    }

    public validateContactNumber() {
        if (!this.contact_number)
            return "Contact Number is required";
        if (this.contact_number.length > 11)
            return "Contact Number cannot exceed 11 characters";
        if (CONTACT_NUMBER_REGEX.test(this.contact_number) === false)
            return "Contact Number must be in the format 09xxxxxxxxx";
        return ''
    }

    public validateFirstName() {
        if (!this.first_name)
            return "First name is required";
        if (this.first_name.length > 64)
            return "First name cannot exceed 64 characters";
        return ''
    }

    public validateLastName() {
        if (!this.last_name)
            return "Last name is required";
        if (this.last_name.length > 64)
            return "Last name cannot exceed 64 characters";
        return ''
    }

    public validateEmployeeTitle() {
        if (!this.employee_title)
            return "Employee title is required";
        if (this.employee_title.length > 64)
            return "Employee title cannot exceed 64 characters";
        return ''
    }

    public validateEmployeeStatus() {
        if (!this.employee_status)
            return "Employee status is required";
        if (this.employee_status.length > 10)
            return "Employee status cannot exceed 10 characters";
        if (['ACTIVE', 'TERMINATED'].includes(this.employee_status) === false)
            return "Employee status must be ACTIVE or TERMINATED only"
        return ''
    }

    public validateBirthDate() {
        if (!this.birth_date)
            return "Birth date is required";
        if (DATE_FORMAT_REGEX.test(this.birth_date) === false)
            return "Birth date must be in the format yyyy-mm-dd";
        return ''
    }

    public validateDateStarted() {
        if (!this.date_started)
            return "Date started is required";
        if (DATE_FORMAT_REGEX.test(this.date_started) === false)
            return "Birth date must be in the format yyyy-mm-dd";
        return ''
    }

    public validateGender() {
        if (!this.gender)
            return "Gender is required";
        if (this.gender.length > 6)
            return "Gender cannot exceed 6 characters";
        if (['MALE', 'FEMALE'].includes(this.gender) === false)
            return "Gender must be MALE or FEMALE only"
        return ''
    }
}