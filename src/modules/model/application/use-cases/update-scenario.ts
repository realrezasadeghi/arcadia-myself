import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import {
  duplicateNameMessage,
  isDuplicateName,
} from "../../domain/policies/uniqueness";
import type { IScenarioRepository } from "../ports/scenario";
import type { DiagramKindNameService } from "../services/diagram-kind-names";

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
  constructor(
    private readonly scenarioRepository: IScenarioRepository,
    private readonly nameService: DiagramKindNameService,
  ) {}

  async execute({
    payload,
  }: UpdateScenarioPayload): Promise<UpdateScenarioResponse> {
    try {
      const scenario = await this.scenarioRepository.findById({
        id: payload.id,
      });

      if (!scenario)
        throw new Error(`Scenario not found with id : ${payload.id}`);

      const siblings = await this.nameService.findSiblings(scenario.modelId);

      if (isDuplicateName(payload.name, siblings, scenario.id)) {
        throw new Error(
          duplicateNameMessage("scenario", payload.name, "this model"),
        );
      }

      const updated = await this.scenarioRepository.update({
        id: payload.id,
        name: payload.name,
        description: payload.description,
      });
      return updated.toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in update scenario"));
    }
  }
}
