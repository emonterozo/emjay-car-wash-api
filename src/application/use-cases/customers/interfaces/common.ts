export type CustomerId = string;

export interface CustomerDetails {
    first_name: string;
    last_name: string;
    contact_number: string;
    password: string;
}

export interface CreateCustomerInput extends CustomerDetails {}

export interface UpdateCustomerInput extends CustomerDetails {
    id: string;
}

export interface CustomerObject extends CustomerDetails {
    id: CustomerId;
    date: string;
}