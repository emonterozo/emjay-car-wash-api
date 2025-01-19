import Employee from '../models/employeeModel';
import { PaginationOption } from '../common/types';
import { recentTransactionService } from './shared/recentTransactionService';
import { validateEmployee } from './validations/employeeValidation';
import { Employee as EmployeeInterface } from '../models/employee';

export const getAllEmployees = async (option: PaginationOption) => {
  try {
    const { field, direction, limit, offset } = option;
    const query = Employee.find();

    if (limit > 0) query.limit(limit);
    if (offset > 0) query.skip(offset);

    query.sort({ [field]: direction });

    const data = await query;

    const totalCount = await Employee.countDocuments();

    const employees = data.map((item) => ({
      id: item._id.toString(),
      first_name: item.first_name,
      last_name: item.last_name,
      date_started: item.date_started,
    }));

    return {
      success: true,
      employees,
      totalCount,
    };
  } catch (error: any) {
    return {
      success: false,
      status: 500,
      error: {
        field: 'general',
        message: 'An unexpected error occurred',
      },
    };
  }
};

export const getEmployeeById = async (employee_id: string) => {
  try {
    const document = await Employee.findById(employee_id).exec();

    if (document) {
      const { _id, ...employee } = document.toObject();

      const res = await recentTransactionService('employee', _id);

      if (res.success) {
        return {
          success: true,
          employee: {
            ...employee,
            id: _id.toString(),
            recent_transactions: res.transactions,
          },
        };
      } else {
        return {
          success: res.status,
          status: res.status,
          error: res.error,
        };
      }
    }

    return {
      success: false,
      status: 404,
      error: {
        field: 'employee_id',
        message: 'Employee does not exist',
      },
    };
  } catch (error: any) {
    return {
      success: false,
      status: 500,
      error: {
        field: 'general',
        message: 'An unexpected error occurred',
      },
    };
  }
};

export const postEmployee = async (employee: EmployeeInterface) => {
  const validationErrors = validateEmployee(employee);

  if (validationErrors.length > 0) {
    return {
      success: false,
      status: 400,
      errors: validationErrors,
    };
  }

  try {
    const savedEmployee = await Employee.create({
      ...employee,
      birth_date: new Date(employee.birth_date),
      date_started: new Date(employee.date_started),
    });

    return {
      success: true,
      employee: { id: savedEmployee._id.toString() },
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      errors: [{ field: 'general', message: 'An unexpected error occurred' }],
    };
  }
};
