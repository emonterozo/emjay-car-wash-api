import Service from '../models/serviceModel';
import { PaginationOption } from '../common/types';

export const getAllServices = async (option: PaginationOption) => {
  try {
    const { field, direction, limit, offset } = option;
    const query = Service.find();

    if (limit > 0) query.limit(limit);
    if (offset > 0) query.skip(offset);

    query.sort({ [field]: direction });

    const data = await query;

    const services = data.map((item) => {
      const price_list = item.price_list.map((item) => {
        const itemObj = item.toObject();
        const { _id, ...itemWithoutId } = itemObj;

        return {
          ...itemWithoutId,
        };
      });

      return {
        id: item._id.toString(),
        title: item.title,
        description: item.description,
        image: item.image,
        type: item.type,
        price_list,
        ratings: item.ratings,
        reviews_count: item.reviews_count,
        last_review: item.last_review,
      };
    });

    return {
      success: true,
      services,
    };
  } catch (error: any) {
    return {
      success: false,
      status: 500,
      message: {
        field: 'general',
        message: 'An unexpected error occurred during authentication',
      },
    };
  }
};
