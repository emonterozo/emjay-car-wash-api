export type CustomerId = string;

export interface CustomerDetails {
    first_name: string;
    last_name: string;
    contact_number: string;
    password: string;
}

export interface CustomerFilterInput extends Partial<Omit<CustomerDetails, 'password'>> {
    id?: CustomerId;
}

export interface CreateCustomerInput extends CustomerDetails {}

export interface UpdateCustomerInput extends CustomerDetails {
    id: string;
}

export interface CustomerObject extends CustomerDetails {
    id: CustomerId;
    registered_on: string;
}

export interface CustomerServicesObject extends Omit<CustomerDetails, 'password'> {
    id: CustomerId;
    car_services_count: CarServiceCount;
    motor_services_count: MotorServiceCount;
}

export interface CarServiceCount {
    sm: number;
    md: number;
    lg: number;
}

export interface MotorServiceCount {
    sm: number;
    md: number;
    lg: number;
}