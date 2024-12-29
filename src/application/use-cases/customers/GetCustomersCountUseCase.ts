import { ICustomerRepository } from "src/application/ports/repositories/ICustomerRepository";
import { IGetCustomersCountResult, IGetCustomersCountUseCase } from "./interfaces/IGetCustomersCountUseCase";

export class GetCustomersCountUseCase implements IGetCustomersCountUseCase {

  constructor(private readonly _customer_repository: ICustomerRepository) { }

  async execute(): Promise<IGetCustomersCountResult> {
    const total = await this._customer_repository.count();

    return { errors: [], result: { total } };
  }
}