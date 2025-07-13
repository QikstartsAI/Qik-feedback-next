import { Waiter } from "../entities";
import { WaiterRepository } from "../repositories/iWaiterRepository";

export interface IGetWaiterByIdUseCase {
  execute(id: string): Promise<Waiter>;
}

export class GetWaiterByIdUseCase implements IGetWaiterByIdUseCase {
  constructor(private waiterRepository: WaiterRepository) {}

  async execute(id: string): Promise<Waiter> {
    if (!id || id.trim() === "") {
      throw new Error("Waiter ID is required");
    }

    return await this.waiterRepository.getWaiterById(id);
  }
}
