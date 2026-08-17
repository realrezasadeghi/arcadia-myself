import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IScenarioRepository } from "../ports/scenario";

export type GetScenariosByModelIdPayload = {
  payload: {
    modelId: string;
  };
  context: {
    token: string;
  };
};

export type GetScenariosByModelIdResponse = Array<{
  id: string;
  modelId: string;
  name: string;
  description: string;
  scenarioType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}>;

export class GetScenariosByModelIdUseCase
  implements
    IUseCase<GetScenariosByModelIdPayload, GetScenariosByModelIdResponse>
{
  constructor(private readonly scenarioRepository: IScenarioRepository) {}

  async execute({
    payload,
  }: GetScenariosByModelIdPayload): Promise<GetScenariosByModelIdResponse> {
    try {
      const scenarios = await this.scenarioRepository.findByModelId({
        modelId: payload.modelId,
      });
      return scenarios.map((s) => s.toJSON());
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in get scenarios by model id"),
      );
    }
  }
}
