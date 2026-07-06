import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  ScenarioDiagramRepository,
  ScenarioLifelineRepository,
  ScenarioFragmentRepository,
} from "@/modules/model/application/ports/scenario";

export type UpdateScenarioLayoutPayload = {
  payload: {
    diagramId: string;
    viewport?: { x: number; y: number; zoom: number; timeScale: number };
    lifelinePositions?: Array<{
      id: string;
      position: { x: number; y: number };
      size?: { width: number; height: number };
    }>;
    fragmentPositions?: Array<{
      id: string;
      position: { x: number; y: number };
      size?: { width: number; height: number };
    }>;
  };
  context: {
    token: string;
  };
};

export type UpdateScenarioLayoutResponse = {
  updated: boolean;
};

export class UpdateScenarioLayoutUseCase
  implements
    IUseCase<UpdateScenarioLayoutPayload, UpdateScenarioLayoutResponse>
{
  constructor(
    private readonly diagramRepository: ScenarioDiagramRepository,
    private readonly lifelineRepository: ScenarioLifelineRepository,
    private readonly fragmentRepository: ScenarioFragmentRepository,
  ) {}

  async execute(
    payload: UpdateScenarioLayoutPayload,
  ): Promise<UpdateScenarioLayoutResponse> {
    try {
      const diagram = await this.diagramRepository.findById(
        payload.payload.diagramId,
      );

      if (!diagram)
        throw new Error(
          `Scenario diagram not found: ${payload.payload.diagramId}`,
        );

      // Update viewport if provided
      if (payload.payload.viewport) {
        diagram.updateViewport(payload.payload.viewport);
        await this.diagramRepository.save(diagram);
      }

      // Update lifeline positions
      if (payload.payload.lifelinePositions) {
        for (const pos of payload.payload.lifelinePositions) {
          const lifeline = await this.lifelineRepository.findById(pos.id);
          if (lifeline) {
            lifeline.updateLayout({
              position: pos.position,
              ...(pos.size ? { size: pos.size } : {}),
            });
            await this.lifelineRepository.save(lifeline);
          }
        }
      }

      // Update fragment positions
      if (payload.payload.fragmentPositions) {
        for (const pos of payload.payload.fragmentPositions) {
          const fragment = await this.fragmentRepository.findById(pos.id);
          if (fragment) {
            fragment.updateLayout({
              position: pos.position,
              ...(pos.size ? { size: pos.size } : {}),
            });
            await this.fragmentRepository.save(fragment);
          }
        }
      }

      return { updated: true };
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error updating scenario layout"),
      );
    }
  }
}
