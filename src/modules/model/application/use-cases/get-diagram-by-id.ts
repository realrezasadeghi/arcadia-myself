import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  ElementLayout,
  Viewport,
} from "../../domain/value-objects/diagram-layout";
import type { DiagramTypeValue } from "../../domain/value-objects/diagram-type";
import type { IDiagramRepository } from "../ports/diagram";
import type { IDiagramLayoutRepository } from "../ports/diagram-layout";

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
  type: DiagramTypeValue;
  name: string;
  description?: string;
  updatedAt: string;
  createdAt: string;
  viewport: Viewport;
  elementLayouts: ElementLayout[];
};

/**
 * GetDiagramUseCase
 *
 * Returns diagram metadata + layout data combined.
 */
export class GetDiagramByIdUseCase
  implements IUseCase<GetDiagramPayload, GetDiagramByIdResponse>
{
  constructor(
    private readonly diagramRepository: IDiagramRepository,
    private readonly diagramLayoutRepository: IDiagramLayoutRepository,
  ) {}

  async execute({ query }: GetDiagramPayload): Promise<GetDiagramByIdResponse> {
    try {
      const diagram = await this.diagramRepository.findById(query);

      if (!diagram) throw new Error(`Diagram not found with id : ${query.id}`);

      const layout = await this.diagramLayoutRepository.findByDiagramId({
        diagramId: query.id,
      });

      return {
        ...diagram.toJSON(),
        viewport: layout?.viewport ?? { x: 0, y: 0, zoom: 1 },
        elementLayouts: layout?.elementLayouts ?? [],
      };
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in get diagram by id"));
    }
  }
}
