import {
  CreateUserInput,
  UserDetails,
  UserId,
  UserObject,
} from '../../../application/use-cases/users/interfaces.ts/common';
import { Condition, InsertedId } from './common';

export interface IUserRepository {
  create(input: CreateUserInput): Promise<InsertedId>;
  retrieve(id: UserId): Promise<UserObject | null>;
  findOneBy(conditions: Condition<keyof UserDetails>[]): Promise<UserObject | null>;
}
