import Consumable from '../models/consumableModel';
import Expense from '../models/expenseModel';
import { PaginationOption, AddConsumableProps } from '../common/types';

export const getAllConsumables = async (option: PaginationOption) => {
  try {
    const { field, direction, limit, offset } = option;
    const query = Consumable.find();

    if (limit > 0) query.limit(limit);
    if (offset > 0) query.skip(offset);

    query.sort({ [field]: direction });

    const data = await query;
    const totalCount = await Consumable.countDocuments();

    const consumables = data.map((item) => {
      return {
        id: item._id.toString(),
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      };
    });

    return {
      success: true,
      consumables,
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

export const postConsumable = async (consumable: AddConsumableProps) => {
  // TODO: add validation here

  try {
    const savedConsumable = await Consumable.create({
      ...consumable,
    });

    await Expense.create({
      category: 'CONSUMABLES',
      description: `Purchased ${consumable.name}`,
      amount: consumable.price * consumable.quantity,
      date: new Date(consumable.date_purchased),
    });

    return {
      success: true,
      consumable: { id: savedConsumable._id.toString() },
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      errors: [{ field: 'unknown', message: 'An unexpected error occurred' }],
    };
  }
};

export const deleteConsumableById = async (consumable_id: string) => {
  // TODO: add validation here

  try {
    const document = await Consumable.findByIdAndDelete(consumable_id);

    if (document) {
      return {
        success: true,
        consumable: document._id.toString(),
      };
    }

    return {
      success: false,
      status: 404,
      error: {
        field: 'consumable_id',
        message: 'Consumable does not exist',
      },
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
