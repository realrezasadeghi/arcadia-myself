import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  IClassDiagramRepository,
  RemoveClassRelationshipLayoutPayload,
} from "../../ports/class-diagram";

export type RemoveClassRelationshipLayoutUseCasePayload = {
  payload: RemoveClassRelationshipLayoutPayload;
  context: {
    token: string;
  };
};

export type RemoveClassRelationshipLayoutUseCaseResponse = boolean;

export class RemoveClassRelationshipLayoutUseCase
  implements
    IUseCase<
      RemoveClassRelationshipLayoutUseCasePayload,
      RemoveClassRelationshipLayoutUseCaseResponse
    >
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    payload,
  }: RemoveClassRelationshipLayoutUseCasePayload): Promise<RemoveClassRelationshipLayoutUseCaseResponse> {
    try {
      const existing = await this.repository.findRelationshipLayoutById({
        id: payload.id,
      });
      if (!existing) {
        throw new Error(
          `ClassRelationshipLayout not found with id: ${payload.id}`,
        );
      }
      return await this.repository.removeRelationshipLayout(payload);
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error removing class relationship layout"),
      );
    }
  }
}
