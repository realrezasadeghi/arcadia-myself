import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IScenarioRepository } from "../ports/scenario";

export type GetScenarioByIdPayload = {
  payload: {
    id: string;
  };
  context: {
    token: string;
  };
};

export type GetScenarioByIdResponse = {
  id: string;
  modelId: string;
  name: string;
  description: string;
  scenarioType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export class GetScenarioByIdUseCase
  implements IUseCase<GetScenarioByIdPayload, GetScenarioByIdResponse | null>
{
  constructor(private readonly scenarioRepository: IScenarioRepository) {}

  async execute({
    payload,
  }: GetScenarioByIdPayload): Promise<GetScenarioByIdResponse | null> {
    try {
      const scenario = await this.scenarioRepository.findById({
        id: payload.id,
      });
      return scenario?.toJSON() ?? null;
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in get scenario by id"),
      );
    }
  }
}
