import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IClassDiagramRepository, RemoveClassElementPayload } from "../../ports/class-diagram";

export type RemoveClassElementUseCasePayload = {
  payload: RemoveClassElementPayload;
  context: {
    token: string;
  };
};

export type RemoveClassElementUseCaseResponse = boolean;

export class RemoveClassElementUseCase
  implements IUseCase<RemoveClassElementUseCasePayload, RemoveClassElementUseCaseResponse>
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    payload,
  }: RemoveClassElementUseCasePayload): Promise<RemoveClassElementUseCaseResponse> {
    try {
      return await this.repository.removeElement(payload);
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error removing class element"),
      );
    }
  }
}