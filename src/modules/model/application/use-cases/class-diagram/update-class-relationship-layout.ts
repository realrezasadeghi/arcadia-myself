import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IClassDiagramRepository, UpdateClassRelationshipLayoutPayload } from "../../ports/class-diagram";

export type UpdateClassRelationshipLayoutUseCasePayload = {
  payload: UpdateClassRelationshipLayoutPayload;
  context: {
    token: string;
  };
};

export type UpdateClassRelationshipLayoutUseCaseResponse = {
  id: string;
  classDiagramId: string;
  classRelationshipId: string;
  labelX: number | null;
  labelY: number | null;
  waypoints: Array<{ x: number; y: number }>;
  createdAt: string;
  updatedAt: string;
};

export class UpdateClassRelationshipLayoutUseCase
  implements IUseCase<UpdateClassRelationshipLayoutUseCasePayload, UpdateClassRelationshipLayoutUseCaseResponse>
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    payload,
  }: UpdateClassRelationshipLayoutUseCasePayload): Promise<UpdateClassRelationshipLayoutUseCaseResponse> {
    try {
      const existing = await this.repository.findRelationshipLayoutById({ id: payload.id });
      if (!existing) {
        throw new Error(`ClassRelationshipLayout not found with id: ${payload.id}`);
      }
      return (await this.repository.updateRelationshipLayout(payload)).toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error updating class relationship layout"));
    }
  }
}