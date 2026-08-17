import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IFragmentRepository } from "../ports/fragment";

export type UpdateFragmentPositionPayload = {
  payload: {
    id: string;
    rowIndex: number;
    columnIndex: number;
    spanColumns?: number;
  };
  context: {
    token: string;
  };
};

export type UpdateFragmentPositionResponse = {
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

export class UpdateFragmentPositionUseCase
  implements
    IUseCase<UpdateFragmentPositionPayload, UpdateFragmentPositionResponse>
{
  constructor(private readonly fragmentRepository: IFragmentRepository) {}

  async execute({
    payload,
  }: UpdateFragmentPositionPayload): Promise<UpdateFragmentPositionResponse> {
    try {
      const fragment = await this.fragmentRepository.updatePosition({
        id: payload.id,
        rowIndex: payload.rowIndex,
        columnIndex: payload.columnIndex,
        spanColumns: payload.spanColumns,
      });
      return fragment.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in update fragment position"),
      );
    }
  }
}
