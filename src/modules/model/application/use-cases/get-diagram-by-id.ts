import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { ElementLayout, Viewport } from "../../domain/entities/diagram";
import type { IDiagramRepository } from "../ports/diagram";

export type GetDiagramPayload = {
  query: {
    id: string;
  };
  context: {
    token: string;
  };
};

export type GetDiagramByIdResponse = {
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
 * GetDiagramUseCase
 *
 * Business rules:
 * 1. دیاگرام باید وجود داشته باشد
 */
export class GetDiagramByIdUseCase
  implements IUseCase<GetDiagramPayload, GetDiagramByIdResponse>
{
  constructor(private readonly repository: IDiagramRepository) {}

  async execute({ query }: GetDiagramPayload): Promise<GetDiagramByIdResponse> {
    try {
      const diagram = await this.repository.findById(query);

      if (!diagram) throw new Error(`Diagram not found with id : ${query.id}`);

      return diagram.toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in get diagram by id"));
    }
  }
}
