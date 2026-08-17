import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IFragmentRepository } from "../ports/fragment";

export type UpdateFragmentPayload = {
  payload: {
    id: string;
    name: string;
    guard?: string;
  };
  context: {
    token: string;
  };
};

export type UpdateFragmentResponse = {
  id: string;
  scenarioId: string;
  name: string;
  operator: string;
  guard: string;
  rowIndex: number;
  columnIndex: number;
  spanColumns: number;
  createdAt: string;
  updatedAt: string;
};

export class UpdateFragmentUseCase
  implements IUseCase<UpdateFragmentPayload, UpdateFragmentResponse>
{
  constructor(private readonly fragmentRepository: IFragmentRepository) {}

  async execute({
    payload,
  }: UpdateFragmentPayload): Promise<UpdateFragmentResponse> {
    try {
      const fragment = await this.fragmentRepository.update({
        id: payload.id,
        name: payload.name,
        guard: payload.guard,
      });
      return fragment.toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in update fragment"));
    }
  }
}
