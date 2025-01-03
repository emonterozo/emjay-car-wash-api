import { ServiceFilterInput, ServiceObject } from '../../../application/use-cases/services/interfaces/common';
import { Limit, Offset, OrderBy } from './common';

export interface ServiceRepositoryParams {
  offset: Offset;
  order_by: OrderBy<keyof ServiceObject>;
  limit: Limit;
}

export interface IServiceRepsository {
  findAll(params: ServiceRepositoryParams): Promise<ServiceObject[]>;
  findOne(params: ServiceFilterInput): Promise<ServiceObject | null>;
}
