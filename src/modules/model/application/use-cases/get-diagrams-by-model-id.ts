import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  ElementLayout,
  Viewport,
} from "../../domain/value-objects/diagram-layout";
import type { DiagramTypeValue } from "../../domain/value-objects/diagram-type";
import type { IDiagramRepository } from "../ports/diagram";
import type { IDiagramLayoutRepository } from "../ports/diagram-layout";
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
  type: DiagramTypeValue;
  name: string;
  description?: string;
  updatedAt: string;
  createdAt: string;
  viewport: Viewport;
  elementLayouts: ElementLayout[];
};

/**
 * GetDiagramsByModelUseCase
 *
 * Business rules:
 * 1. Model must exist
 */
export class GetDiagramsByModelUseCase
  implements
    IUseCase<GetDiagramsByModelIdPayload, GetDiagramsByModelIdResponse[]>
{
  constructor(
    private readonly diagramRepository: IDiagramRepository,
    private readonly diagramLayoutRepository: IDiagramLayoutRepository,
    private readonly modelRepository: IModelRepository,
  ) {}

  async execute({
    query,
  }: GetDiagramsByModelIdPayload): Promise<GetDiagramsByModelIdResponse[]> {
    try {
      const model = await this.modelRepository.findModelById(query.modelId);
      if (!model) throw new Error(`Model not found with id : ${query.modelId}`);

      const diagrams = await this.diagramRepository.findByModelId(query);

      // Fetch all layouts in one query
      const diagramIds = diagrams.map((d) => d.id);
      const layouts = await this.diagramLayoutRepository.findByDiagramIds({
        diagramIds,
      });

      return diagrams.map((diagram) => {
        const layout = layouts.get(diagram.id);
        return {
          ...diagram.toJSON(),
          viewport: layout?.viewport ?? { x: 0, y: 0, zoom: 1 },
          elementLayouts: layout?.elementLayouts ?? [],
        };
      });
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in get diagram by model id"),
      );
    }
  }
}
