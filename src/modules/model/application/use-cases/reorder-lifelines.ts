import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { ILifelineRepository } from "../ports/lifeline";

export type ReorderLifelinesPayload = {
  payload: {
    scenarioId: string;
    lifelineIds: string[];
  };
  context: {
    token: string;
  };
};

export type ReorderLifelinesResponse = void;

export class ReorderLifelinesUseCase
  implements IUseCase<ReorderLifelinesPayload, ReorderLifelinesResponse>
{
  constructor(private readonly lifelineRepository: ILifelineRepository) {}

  async execute({
    payload,
  }: ReorderLifelinesPayload): Promise<ReorderLifelinesResponse> {
    try {
      await this.lifelineRepository.reorder({
        scenarioId: payload.scenarioId,
        lifelineIds: payload.lifelineIds,
      });
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in reorder lifelines"));
    }
  }
}
