import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IClassDiagramRepository, RemoveClassRelationshipPayload } from "../../ports/class-diagram";

export type RemoveClassRelationshipUseCasePayload = {
  payload: RemoveClassRelationshipPayload;
  context: {
    token: string;
  };
};

export type RemoveClassRelationshipUseCaseResponse = boolean;

export class RemoveClassRelationshipUseCase
  implements IUseCase<RemoveClassRelationshipUseCasePayload, RemoveClassRelationshipUseCaseResponse>
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    payload,
  }: RemoveClassRelationshipUseCasePayload): Promise<RemoveClassRelationshipUseCaseResponse> {
    try {
      return await this.repository.removeRelationship(payload);
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error removing class relationship"),
      );
    }
  }
}