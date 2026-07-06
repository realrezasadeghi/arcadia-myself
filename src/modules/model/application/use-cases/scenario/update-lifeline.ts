import type { ScenarioLifelineRepository } from "@/modules/model/application/ports/scenario";
import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";

export type UpdateScenarioLifelinePayload = {
  payload: {
    id: string;
    selector?: string;
    decomposed?: boolean;
    layout?: {
      position?: { x: number; y: number };
      size?: { width: number; height: number };
      headPosition?: number;
    };
  };
  context: {
    token: string;
  };
};

export type UpdateScenarioLifelineResponse = {
  id: string;
  diagramId: string;
  elementId: string;
  type: string;
  selector?: string;
  decomposed: boolean;
  layout: {
    position: { x: number; y: number };
    size: { width: number; height: number };
    headPosition: number;
  };
  createdAt: string;
  updatedAt: string;
};

export class UpdateScenarioLifelineUseCase
  implements
    IUseCase<UpdateScenarioLifelinePayload, UpdateScenarioLifelineResponse>
{
  constructor(
    private readonly lifelineRepository: ScenarioLifelineRepository,
  ) {}

  async execute(
    payload: UpdateScenarioLifelinePayload,
  ): Promise<UpdateScenarioLifelineResponse> {
    try {
      const lifeline = await this.lifelineRepository.findById(
        payload.payload.id,
      );

      if (!lifeline)
        throw new Error(`Lifeline not found with id : ${payload.payload.id}`);

      if (payload.payload.selector !== undefined) {
        lifeline.updateSelector(payload.payload.selector);
      }

      if (payload.payload.decomposed !== undefined) {
        lifeline.setDecomposed(payload.payload.decomposed);
      }

      if (payload.payload.layout) {
        lifeline.updateLayout(payload.payload.layout);
      }

      await this.lifelineRepository.save(lifeline);

      return lifeline.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in update scenario lifeline"),
      );
    }
  }
}
