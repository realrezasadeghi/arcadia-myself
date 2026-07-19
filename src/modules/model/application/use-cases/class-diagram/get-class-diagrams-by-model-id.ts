import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IClassDiagramRepository, FindClassDiagramsByModelIdQuery } from "../../ports/class-diagram";

export type GetClassDiagramsByModelIdUseCasePayload = {
  query: FindClassDiagramsByModelIdQuery;
  context: {
    token: string;
  };
};

export type GetClassDiagramsByModelIdUseCaseResponse = {
  id: string;
  modelId: string;
  layer: string;
  name: string;
  description: string | undefined;
  viewport: { x: number; y: number; zoom: number };
  elementLayouts: Array<{
    elementId: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
  }>;
  status: string;
  createdAt: string;
  updatedAt: string;
}[];

export class GetClassDiagramsByModelIdUseCase
  implements IUseCase<GetClassDiagramsByModelIdUseCasePayload, GetClassDiagramsByModelIdUseCaseResponse>
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    query,
  }: GetClassDiagramsByModelIdUseCasePayload): Promise<GetClassDiagramsByModelIdUseCaseResponse> {
    try {
      const diagrams = await this.repository.findByModelId(query);
      return diagrams.map((d) => d.toJSON());
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error getting class diagrams"),
      );
    }
  }
}