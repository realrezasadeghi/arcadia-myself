import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import { LifelineType, type LifelineTypeValue } from "@/modules/model/domain/value-objects/lifeline-type";
import type { ScenarioLifelineRepository } from "@/modules/model/application/ports/scenario";
import type { ScenarioDiagramRepository } from "@/modules/model/application/ports/scenario";

export type CreateScenarioLifelinePayload = {
  payload: {
    diagramId: string;
    elementId: string;
    type: LifelineTypeValue;
    selector?: string;
    decomposed?: boolean;
  };
  context: {
    token: string;
  };
};

export type CreateScenarioLifelineResponse = {
  id: string;
  diagramId: string;
  elementId: string;
  type: LifelineTypeValue;
  selector?: string;
  decomposed: boolean;
  layout: { position: { x: number; y: number }; size: { width: number; height: number }; headPosition: number };
  createdAt: string;
  updatedAt: string;
};

export class CreateScenarioLifelineUseCase implements IUseCase<CreateScenarioLifelinePayload, CreateScenarioLifelineResponse> {
  constructor(
    private readonly lifelineRepository: ScenarioLifelineRepository,
    private readonly diagramRepository: ScenarioDiagramRepository,
  ) {}

  async execute(payload: CreateScenarioLifelinePayload): Promise<CreateScenarioLifelineResponse> {
    try {
      const lifelineType = LifelineType.from(payload.payload.type);

      const diagram = await this.diagramRepository.findById(payload.payload.diagramId);

      if (!diagram)
        throw new Error(`Scenario diagram not found with id : ${payload.payload.diagramId}`);

      const lifeline = await this.lifelineRepository.create({
        diagramId: payload.payload.diagramId,
        elementId: payload.payload.elementId,
        type: lifelineType,
        selector: payload.payload.selector,
        decomposed: payload.payload.decomposed,
      });

      return lifeline.toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in create scenario lifeline"));
    }
  }
}