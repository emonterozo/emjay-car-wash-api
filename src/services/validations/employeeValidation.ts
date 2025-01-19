import { Employee, validEmployeeStatuses } from '../../models/employee';
import { validGenders } from '../../common/constant';

export const validateEmployee = (employee: Employee) => {
  const validationErrors: { field: string; message: string }[] = [];
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
  const contactNumberRegex = /^09\d{9}$/;
  const fields = [
    {
      field: 'first_name',
      value: employee.first_name,
      message: 'First Name is required',
      maxLength: 64,
    },
    {
      field: 'last_name',
      value: employee.last_name,
      message: 'Last Name is required',
      maxLength: 64,
    },
    {
      field: 'birth_date',
      value: employee.birth_date,
      message: 'Birth Date is required',
      maxLength: 10,
    },
    { field: 'gender', value: employee.gender, message: 'Gender is required', maxLength: 6 },
    {
      field: 'contact_number',
      value: employee.contact_number,
      message: 'Contact Number is required',
      maxLength: 11,
    },
    {
      field: 'employee_title',
      value: employee.employee_title,
      message: 'Employee Title is required',
      maxLength: 64,
    },
    {
      field: 'employee_status',
      value: employee.employee_status,
      message: 'Employee Status is required',
      maxLength: 10,
    },
    {
      field: 'date_started',
      value: employee.date_started,
      message: 'Date Started is required',
      maxLength: 10,
    },
  ];

  fields.forEach(({ field, value, message, maxLength }) => {
    if (!value) {
      validationErrors.push({ field, message });
    }

    if (maxLength && value.length > maxLength) {
      validationErrors.push({
        field,
        message: `${field.replace('_', ' ')} cannot exceed ${maxLength} characters`,
      });
    }
  });

  if (employee.gender && !validGenders.includes(employee.gender)) {
    validationErrors.push({
      field: 'gender',
      message: `Gender must be one of ${validGenders.join(', ')}`,
    });
  }

  if (employee.employee_status && !validEmployeeStatuses.includes(employee.employee_status)) {
    validationErrors.push({
      field: 'employee_status',
      message: `Employee status must be one of ${validEmployeeStatuses.join(', ')}`,
    });
  }

  if (employee.birth_date && !dateFormatRegex.test(employee.birth_date)) {
    validationErrors.push({
      field: 'birth_date',
      message: 'Birth date must be in the format yyyy-mm-dd',
    });
  }

  if (employee.date_started && !dateFormatRegex.test(employee.date_started)) {
    validationErrors.push({
      field: 'date_started',
      message: 'Date started must be in the format yyyy-mm-dd',
    });
  }

  if (employee.contact_number && !contactNumberRegex.test(employee.contact_number)) {
    validationErrors.push({
      field: 'contact_number',
      message: 'Contact number must be in the format 09123456789',
    });
  }

  return validationErrors;
};
