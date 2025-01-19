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
    const totalCount = await Service.countDocuments();

    const services = data.map((item) => {
      return {
        id: item._id.toString(),
        title: item.title,
        description: item.description,
        image: item.image,
        type: item.type,
        price_list: item.price_list,
        ratings: item.ratings,
        reviews_count: item.reviews_count,
        last_review: item.last_review,
      };
    });

    return {
      success: true,
      services,
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
