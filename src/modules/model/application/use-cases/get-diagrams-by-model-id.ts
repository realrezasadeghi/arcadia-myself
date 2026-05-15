import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { ElementLayout, Viewport } from "../../domain/entities/diagram";
import type { IDiagramRepository } from "../ports/diagram";
import type { IModelRepository } from "../ports/model";

export interface GetDiagramsByModelIdPayload {
  query: {
    modelId: string;
  };
  context: {
    token: string;
  };
}

export type GetDiagramsByModelIdResponse = {
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
 * GetDiagramsByModelUseCase
 *
 * Business rules:
 * 1. مدل باید وجود داشته باشد
 */
export class GetDiagramsByModelUseCase
  implements
    IUseCase<GetDiagramsByModelIdPayload, GetDiagramsByModelIdResponse[]>
{
  constructor(
    private readonly diagramRepository: IDiagramRepository,
    private readonly modelRepository: IModelRepository,
  ) {}

  async execute({
    query,
  }: GetDiagramsByModelIdPayload): Promise<GetDiagramsByModelIdResponse[]> {
    try {
      const model = await this.modelRepository.findModelById(query.modelId);
      if (!model) throw new Error(`Model not found with id : ${query.modelId}`);
      const response = await this.diagramRepository.findByModelId(query);
      return response.map((diagram) => diagram.toJSON());
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in get diagram by model id"),
      );
    }
  }
}
