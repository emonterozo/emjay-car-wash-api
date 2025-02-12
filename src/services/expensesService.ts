import Expense from '../models/expenseModel';
import { AddExpenseProps, PaginationOptionWithDateRange } from '../common/types';

export const getAllExpenses = async (option: PaginationOptionWithDateRange) => {
  try {
    const { field, direction, limit, offset, date_range } = option;
    const query = Expense.find();

    if (date_range) {
      const { start, end } = date_range;
      // @ts-ignore
      query.where('date').gte(start);
      // @ts-ignore
      query.where('date').lte(end);
    }

    if (limit > 0) query.limit(limit);
    if (offset > 0) query.skip(offset);

    query.sort({ [field]: direction });

    const data = await query;
    const totalCountQuery = Expense.find();
    if (date_range) {
      const { start, end } = date_range;

      // @ts-ignore
      totalCountQuery.where('date').gte(start);
      // @ts-ignore
      totalCountQuery.where('date').lte(end);
    }

    const totalCount = await totalCountQuery.countDocuments();

    const expenses = data.map((item) => {
      return {
        id: item._id.toString(),
        category: item.category,
        description: item.description,
        amount: item.amount,
        date: item.date,
      };
    });

    return {
      success: true,
      expenses,
      totalCount,
    };
  } catch (error: any) {
    return {
      success: false,
      status: 500,
      error: {
        field: 'unknown',
        message: 'An unexpected error occurred',
      },
    };
  }
};

export const postExpense = async (consumable: AddExpenseProps) => {
  // TODO: add validation here

  try {
    const savedExpense = await Expense.create({
      ...consumable,
    });

    return {
      success: true,
      expense: { id: savedExpense._id.toString() },
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      errors: [{ field: 'unknown', message: 'An unexpected error occurred' }],
    };
  }
};
