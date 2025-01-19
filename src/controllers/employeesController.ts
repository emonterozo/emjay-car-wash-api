import { Request, Response } from 'express';
import { ListRequestBody, OrderBy } from '../common/types';
import { parseOrderBy } from '../utils/parsedOrderBy';
import * as employeesService from '../services/employeesService';
import { Employee } from '../models/employee';

export const getAllEmployees = async (req: Request<{}, {}, ListRequestBody>, res: Response) => {
  const { offset, limit } = req.query;

  const order_by: OrderBy | null = parseOrderBy(req, res, 'date_started');
  const offset_number = parseInt(offset as string, 10) || 0;
  const limit_number = parseInt(limit as string, 10) || 0;

  if (!order_by) return;

  try {
    const result = await employeesService.getAllEmployees({
      ...order_by,
      offset: offset_number,
      limit: limit_number,
    });

    if (result.success) {
      return res.status(200).json({
        data: {
          employees: result.employees,
          totalCount: result.totalCount,
        },
        errors: [],
      });
    }
  } catch (error) {
    return res.status(500).json({
      data: null,
      errors: [
        {
          field: 'general',
          message: 'Something went wrong, please try again later',
        },
      ],
    });
  }
};
export const getEmployeeById = async (req: Request<{ employee_id: string }>, res: Response) => {
  const { employee_id } = req.params;

  try {
    const result = await employeesService.getEmployeeById(employee_id);

    if (result.success) {
      return res.status(200).json({
        data: {
          employee: result.employee,
        },
        errors: [],
      });
    } else {
      return res.status(result.status!).json({
        data: null,
        errors: [result.error],
      });
    }
  } catch (error) {
    return res.status(500).json({
      data: null,
      errors: [
        {
          field: 'general',
          message: 'Something went wrong, please try again later',
        },
      ],
    });
  }
};

export const postEmployee = async (req: Request<{}, {}, Employee>, res: Response) => {
  const result = await employeesService.postEmployee(req.body);

  if (result.success) {
    return res.status(201).json({
      data: {
        employee: result.employee,
      },
      errors: [],
    });
  } else {
    return res.status(result.status!).json({
      data: null,
      errors: result.errors,
    });
  }
};
