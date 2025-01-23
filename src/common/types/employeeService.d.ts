export interface AddEmployeeProps {
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: 'MALE' | 'FEMALE';
  contact_number: string;
  employee_title: string;
  employee_status: 'ACTIVE' | 'TERMINATED';
  date_started: string;
}

export interface UpdateEmployeeProps
  extends Pick<AddEmployeeProps, 'contact_number' | 'employee_title' | 'employee_status'> {}
