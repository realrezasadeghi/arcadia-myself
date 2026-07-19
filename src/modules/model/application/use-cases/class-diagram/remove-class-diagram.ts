import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IClassDiagramRepository, RemoveClassDiagramPayload } from "../../ports/class-diagram";

export type RemoveClassDiagramUseCasePayload = {
  payload: RemoveClassDiagramPayload;
  context: {
    token: string;
  };
};

export type RemoveClassDiagramUseCaseResponse = boolean;

export class RemoveClassDiagramUseCase
  implements IUseCase<RemoveClassDiagramUseCasePayload, RemoveClassDiagramUseCaseResponse>
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    payload,
  }: RemoveClassDiagramUseCasePayload): Promise<RemoveClassDiagramUseCaseResponse> {
    try {
      // Note: Elements and relationships are owned by Model, not Diagram
      // Removing a diagram only removes the diagram and its layouts
      return await this.repository.remove(payload);
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error removing class diagram"),
      );
    }
  }
}