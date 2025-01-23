import { AddEmployeeProps, UpdateEmployeeProps } from '../../common/types';
import {
  VALID_GENDERS,
  VALID_EMPLOYEE_STATUSES,
  GENDER,
  EMPLOYEE_STATUS,
  CONTACT_NUMBER_REGEX,
  DATE_FORMAT_REGEX,
} from '../../common/constant';

type ValidateEmployeeProps =
  | {
      type: 'Update';
      payload: UpdateEmployeeProps;
    }
  | {
      type: 'Add';
      payload: AddEmployeeProps;
    };

export const validateEmployee = ({ type, payload }: ValidateEmployeeProps) => {
  const validationErrors: { field: string; message: string }[] = [];

  let fields = [
    {
      field: 'contact_number',
      value: payload.contact_number,
      message: 'Contact number is required',
      maxLength: 11,
    },
    {
      field: 'employee_title',
      value: payload.employee_title,
      message: 'Employee title is required',
      maxLength: 64,
    },
    {
      field: 'employee_status',
      value: payload.employee_status,
      message: 'Employee status is required',
      maxLength: 10,
    },
  ];

  if (type === 'Add') {
    fields = [
      ...fields,
      {
        field: 'first_name',
        value: (payload as AddEmployeeProps).first_name,
        message: 'First name is required',
        maxLength: 64,
      },
      {
        field: 'last_name',
        value: (payload as AddEmployeeProps).last_name,
        message: 'Last name is required',
        maxLength: 64,
      },
      {
        field: 'birth_date',
        value: (payload as AddEmployeeProps).birth_date,
        message: 'Birth date is required',
        maxLength: 10,
      },
      {
        field: 'gender',
        value: (payload as AddEmployeeProps).gender,
        message: 'Gender is required',
        maxLength: 6,
      },
      {
        field: 'date_started',
        value: (payload as AddEmployeeProps).date_started,
        message: 'Date started is required',
        maxLength: 10,
      },
    ];
  }

  fields.forEach(({ field, value, message, maxLength }) => {
    if (value) {
      if (value && maxLength && value.length > maxLength) {
        validationErrors.push({
          field,
          message: `${field.replace('_', ' ')} cannot exceed ${maxLength} characters`,
        });
      }
    } else {
      validationErrors.push({ field, message });
    }
  });

  switch (type) {
    case 'Add':
      if (!VALID_GENDERS.includes(payload.gender as GENDER)) {
        validationErrors.push({
          field: 'gender',
          message: `Gender must be one of ${VALID_GENDERS.join(', ')}`,
        });
      }

      if (!DATE_FORMAT_REGEX.test(payload.birth_date)) {
        validationErrors.push({
          field: 'birth_date',
          message: 'Birth date must be in the format yyyy-mm-dd',
        });
      }

      if (!DATE_FORMAT_REGEX.test(payload.date_started)) {
        validationErrors.push({
          field: 'date_started',
          message: 'Date started must be in the format yyyy-mm-dd',
        });
      }
      break;
    default:
      break;
  }

  if (!VALID_EMPLOYEE_STATUSES.includes(payload.employee_status as EMPLOYEE_STATUS)) {
    validationErrors.push({
      field: 'employee_status',
      message: `Employee status must be one of ${VALID_EMPLOYEE_STATUSES.join(', ')}`,
    });
  }

  if (!CONTACT_NUMBER_REGEX.test(payload.contact_number)) {
    validationErrors.push({
      field: 'contact_number',
      message: 'Contact number must be in the format 09123456789',
    });
  }

  return validationErrors;
};
