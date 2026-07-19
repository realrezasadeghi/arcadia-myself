import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IClassDiagramRepository, FindClassElementByIdQuery } from "../../ports/class-diagram";

export type GetClassRelationshipLayoutByIdUseCasePayload = {
  query: FindClassElementByIdQuery;
  context: {
    token: string;
  };
};

export type GetClassRelationshipLayoutByIdUseCaseResponse = {
  id: string;
  classDiagramId: string;
  classRelationshipId: string;
  labelX: number | null;
  labelY: number | null;
  waypoints: Array<{ x: number; y: number }>;
  createdAt: string;
  updatedAt: string;
} | null;

export class GetClassRelationshipLayoutByIdUseCase
  implements IUseCase<GetClassRelationshipLayoutByIdUseCasePayload, GetClassRelationshipLayoutByIdUseCaseResponse>
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    query,
  }: GetClassRelationshipLayoutByIdUseCasePayload): Promise<GetClassRelationshipLayoutByIdUseCaseResponse> {
    try {
      const layout = await this.repository.findRelationshipLayoutById(query);
      return layout ? layout.toJSON() : null;
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error getting class relationship layout"));
    }
  }
}