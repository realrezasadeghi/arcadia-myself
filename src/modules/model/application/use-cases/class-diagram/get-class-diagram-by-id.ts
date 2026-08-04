import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  IClassDiagramRepository,
  FindClassDiagramByIdQuery,
} from "../../ports/class-diagram";

export type GetClassDiagramByIdUseCasePayload = {
  query: FindClassDiagramByIdQuery;
  context: {
    token: string;
  };
};

export type GetClassDiagramByIdUseCaseResponse = {
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
} | null;

export class GetClassDiagramByIdUseCase
  implements
    IUseCase<
      GetClassDiagramByIdUseCasePayload,
      GetClassDiagramByIdUseCaseResponse
    >
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    query,
  }: GetClassDiagramByIdUseCasePayload): Promise<GetClassDiagramByIdUseCaseResponse> {
    try {
      const diagram = await this.repository.findById(query);
      if (!diagram) return null;
      return diagram.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error getting class diagram"),
      );
    }
  }
}
