import {
  IServiceRepsository,
  ServiceRepositoryParams,
} from '../../../application/ports/repositories/IServiceRepository';
import { ServiceObject } from '../../../application/use-cases/services/interfaces/common';
import { MongoDB } from './MongoDB';
import { Collection, ObjectId } from 'mongodb';

interface IServicePricing {
  size: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  price: number;
}
interface IServiceCollection {
  _id: ObjectId;
  title: string;
  description: string;
  type: 'car' | 'motorcycle';
  price_list: IServicePricing[];
  image: string;
  rating: number;
  reviews_count: number;
  last_review: string;
  ratings: number;
}

function parseField(key: keyof ServiceObject): keyof IServiceCollection | keyof ServiceObject {
  if (key === 'reviews') return 'reviews_count';
  if (key === 'image_url') return 'image';
  if (key === 'rating') return 'ratings';

  return key;
}

export class ServiceRepository implements IServiceRepsository {
  private readonly mongo_client = MongoDB.instance();

  public async findAll(params: ServiceRepositoryParams): Promise<ServiceObject[]> {
    await this.mongo_client.connect();
    const db = this.mongo_client.db(process.env.MONGO_DATASOURCE);
    const collection: Collection<IServiceCollection> = db.collection(
      process.env.MONGO_SERVICES_COLLECTION!,
    );
    const entries = await collection
      .find({})
      .sort({ [parseField(params.order_by.field)]: params.order_by.direction === 'desc' ? -1 : 1 })
      .limit(params.limit)
      .skip(params.offset)
      .toArray();

    await this.mongo_client.close();

    return entries.map((entry) => ({
      id: entry._id.toString(),
      description: entry.description,
      price_list: entry.price_list,
      reviews: entry.reviews_count,
      title: entry.title,
      type: entry.type,
      image_url: entry.image,
      rating: {
        '1': 5,
        '2': 10,
        '3': 30,
        '4': 80,
        '5': 220,
      },
    }));
  }
}
