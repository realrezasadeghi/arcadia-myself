import type { ScenarioDiagramRepository } from "@/modules/model/application/ports/scenario";
import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";

export type ValidateScenarioPayload = {
  payload: {
    diagramId: string;
  };
  context: {
    token: string;
  };
};

export type ValidateScenarioResponse = {
  valid: boolean;
  errors: string[];
};

export class ValidateScenarioUseCase
  implements IUseCase<ValidateScenarioPayload, ValidateScenarioResponse>
{
  constructor(private readonly diagramRepository: ScenarioDiagramRepository) {}

  async execute(
    payload: ValidateScenarioPayload,
  ): Promise<ValidateScenarioResponse> {
    try {
      const diagram = await this.diagramRepository.findById(
        payload.payload.diagramId,
      );

      if (!diagram)
        throw new Error(
          `Diagram not found with id : ${payload.payload.diagramId}`,
        );

      return diagram.validate();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in validate scenario"));
    }
  }
}
