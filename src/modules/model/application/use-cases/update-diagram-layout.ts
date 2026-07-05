import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  ElementLayout,
  Viewport,
} from "../../domain/value-objects/diagram-layout";
import type { IDiagramLayoutRepository } from "../ports/diagram-layout";

export type UpdateDiagramLayoutPayload = {
  payload: {
    id: string;
    viewport?: Viewport;
    elementLayouts?: ElementLayout[];
  };
  context: {
    token: string;
  };
};

export type UpdateDiagramLayoutResponse = {
  diagramId: string;
  viewport: Viewport;
  elementLayouts: ElementLayout[];
};

/**
 * UpdateDiagramLayoutUseCase
 *
 * Business rules:
 * 1. Layout must exist (or be created on first save)
 * 2. Layout is independent of Diagram metadata
 */
export class UpdateDiagramLayoutUseCase
  implements IUseCase<UpdateDiagramLayoutPayload, UpdateDiagramLayoutResponse>
{
  constructor(
    private readonly diagramLayoutRepository: IDiagramLayoutRepository,
  ) {}

  async execute({
    payload,
  }: UpdateDiagramLayoutPayload): Promise<UpdateDiagramLayoutResponse> {
    try {
      let layout = await this.diagramLayoutRepository.findByDiagramId({
        diagramId: payload.id,
      });

      // Auto-create layout if it doesn't exist yet (backward compat)
      if (!layout) {
        await this.diagramLayoutRepository.create({ diagramId: payload.id });
        layout = await this.diagramLayoutRepository.findByDiagramId({
          diagramId: payload.id,
        });
      }

      if (!layout) {
        throw new Error(`Failed to create layout for diagram: ${payload.id}`);
      }

      await this.diagramLayoutRepository.update({
        diagramId: payload.id,
        viewport: payload.viewport,
        elementPositions: payload.elementLayouts,
      });

      // Re-fetch to get the updated state
      const updated = await this.diagramLayoutRepository.findByDiagramId({
        diagramId: payload.id,
      });

      return {
        diagramId: payload.id,
        viewport: updated?.viewport ?? { x: 0, y: 0, zoom: 1 },
        elementLayouts: updated?.elementLayouts ?? [],
      };
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in update diagram layout"),
      );
    }
  }
}
