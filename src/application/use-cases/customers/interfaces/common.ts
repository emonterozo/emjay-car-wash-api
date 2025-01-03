export type CustomerId = string;

export interface CustomerDetails {
    first_name: string;
    last_name: string;
    birth_date: string;
    contact_number: string;
    province: string;
    city: string;
    barangay: string;
    address: string;
    password: string;
}

export interface CustomerFilterInput extends Partial<Omit<CustomerDetails, 'password'>> {
    id?: CustomerId;
}

export interface CreateCustomerInput extends CustomerDetails { }

export interface UpdateCustomerInput extends CustomerDetails {
    id: string;
}

export interface CustomerObject extends CustomerDetails {
    id: CustomerId;
    car_services_count: CarServiceCount[];
    motor_services_count: MotorServiceCount[];
    recent_transactions: CustomerRecentTransaction[];
    registered_on: string;
}

export interface CustomerServicesObject extends Omit<CustomerDetails, 'password'> {
    id: CustomerId;
    car_services_count: CarServiceCount;
    motor_services_count: MotorServiceCount;
}

export interface CarServiceCount {
    size:   "sm" |
            "md" |
            "lg" |
            "xl" |
            "xxl";
    count: number
}

export interface MotorServiceCount {
    size:   "sm" |
            "md" |
            "lg" |
            "xl" |
            "xxl";
    count: number
}

export interface CustomerRecentTransaction {
    id: string;
    service_id: string;
    service_name: string;
    price: number;
    date: string;
}