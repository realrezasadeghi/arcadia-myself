import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IScenarioRepository } from "../ports/scenario";

export type UpdateScenarioPayload = {
  payload: {
    id: string;
    name: string;
    description?: string;
  };
  context: {
    token: string;
  };
};

export type UpdateScenarioResponse = {
  id: string;
  modelId: string;
  name: string;
  description: string;
  scenarioType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export class UpdateScenarioUseCase
  implements IUseCase<UpdateScenarioPayload, UpdateScenarioResponse>
{
  constructor(private readonly scenarioRepository: IScenarioRepository) {}

  async execute({
    payload,
  }: UpdateScenarioPayload): Promise<UpdateScenarioResponse> {
    try {
      const scenario = await this.scenarioRepository.update({
        id: payload.id,
        name: payload.name,
        description: payload.description,
      });
      return scenario.toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in update scenario"));
    }
  }
}
