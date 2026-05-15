import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { ElementLayout, Viewport } from "../../domain/entities/diagram";
import type { IDiagramRepository } from "../ports/diagram";

export type UpdateDiagramPayload = {
  payload: {
    id: string;
    name: string;
    description?: string;
  };
  context: {
    token: string;
  };
};

export type UpdateDiagramResponse = {
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
 * UpdateDiagramUseCase
 *
 * Business rules:
 * 1. دیاگرام باید وجود داشته باشد
 * 2. نام اگر داده شود نمی‌تواند خالی باشد
 */
export class UpdateDiagramUseCase
  implements IUseCase<UpdateDiagramPayload, UpdateDiagramResponse>
{
  constructor(private readonly diagramRepository: IDiagramRepository) {}

  async execute({
    payload,
  }: UpdateDiagramPayload): Promise<UpdateDiagramResponse> {
    try {
      const diagram = await this.diagramRepository.findById({
        id: payload.id,
      });

      if (!diagram)
        throw new Error(`Diagram not found with id : ${payload.id}`);

      diagram.rename(payload.name);

      diagram.updateDescription(payload.description);

      const response = await this.diagramRepository.update({
        id: payload.id,
        name: diagram.name,
        description: diagram.description,
      });

      return response.toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in update diagram"));
    }
  }
}
