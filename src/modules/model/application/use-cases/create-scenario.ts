import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import { ScenarioType } from "../../domain/value-objects/scenario-type";
import type { IModelRepository } from "../ports/model";
import type { IScenarioRepository } from "../ports/scenario";

export type CreateScenarioPayload = {
  payload: {
    modelId: string;
    name: string;
    description?: string;
    scenarioType: string;
  };
  context: {
    token: string;
  };
};

export type CreateScenarioResponse = {
  id: string;
  modelId: string;
  name: string;
  description: string;
  scenarioType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export class CreateScenarioUseCase
  implements IUseCase<CreateScenarioPayload, CreateScenarioResponse>
{
  constructor(
    private readonly scenarioRepository: IScenarioRepository,
    private readonly modelRepository: IModelRepository,
  ) {}

  async execute({
    payload,
  }: CreateScenarioPayload): Promise<CreateScenarioResponse> {
    try {
      const scenarioType = ScenarioType.from(payload.scenarioType);

      const model = await this.modelRepository.findModelById(payload.modelId);
      if (!model)
        throw new Error(`Model not found with id: ${payload.modelId}`);

      if (!scenarioType.layer.equals(model.layer)) {
        throw new Error(
          `Scenario type "${scenarioType.label}" belongs to layer "${scenarioType.layer.label}", not "${model.layer.label}".`,
        );
      }

      const id = crypto.randomUUID();
      const scenario = await this.scenarioRepository.create({
        modelId: payload.modelId,
        name: payload.name,
        description: payload.description,
        scenarioType,
      });

      return scenario.toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in create scenario"));
    }
  }
}
