import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { ElementLayout, Viewport } from "../../domain/entities/diagram";
import type { IDiagramRepository } from "../ports/diagram";

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
  id: string;
  modelId: string;
  type: string;
  viewport: Viewport;
  name: string;
  description?: string;
  updatedAt: string;
  createdAt: string;
  elementLayouts: ElementLayout[];
};

/**
 * UpdateDiagramLayoutUseCase
 *
 * Business rules:
 * 1. دیاگرام باید وجود داشته باشد
 * 2. layout شامل موقعیت و اندازه المنت‌ها و viewport می‌شود
 */
export class UpdateDiagramLayoutUseCase
  implements IUseCase<UpdateDiagramLayoutPayload, UpdateDiagramLayoutResponse>
{
  constructor(private readonly diagramRepository: IDiagramRepository) {}

  async execute({
    payload,
  }: UpdateDiagramLayoutPayload): Promise<UpdateDiagramLayoutResponse> {
    try {
      const diagram = await this.diagramRepository.findById({ id: payload.id });
      if (!diagram)
        throw new Error(`Diagram not found with id : ${payload.id}`);

      console.log("payload use case", payload);

      diagram.updateViewport({ ...diagram.viewport, ...payload.viewport });

      const response = await this.diagramRepository.updateLayout({
        id: payload.id,
        viewport: diagram.viewport,
        elementLayouts: [
          ...diagram.elementLayouts,
          ...(payload?.elementLayouts ?? []),
        ],
      });

      console.log("response layout", response);

      return response.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in update diagram layout"),
      );
    }
  }
}
