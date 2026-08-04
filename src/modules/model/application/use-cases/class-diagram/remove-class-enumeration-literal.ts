import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  IClassDiagramRepository,
  RemoveClassEnumerationLiteralPayload,
} from "../../ports/class-diagram";

export type RemoveClassEnumerationLiteralUseCasePayload = {
  payload: RemoveClassEnumerationLiteralPayload;
  context: {
    token: string;
  };
};

export type RemoveClassEnumerationLiteralUseCaseResponse = boolean;

export class RemoveClassEnumerationLiteralUseCase
  implements
    IUseCase<
      RemoveClassEnumerationLiteralUseCasePayload,
      RemoveClassEnumerationLiteralUseCaseResponse
    >
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    payload,
  }: RemoveClassEnumerationLiteralUseCasePayload): Promise<RemoveClassEnumerationLiteralUseCaseResponse> {
    try {
      const existing = await this.repository.findEnumerationLiteralById({
        id: payload.id,
      });
      if (!existing) {
        throw new Error(
          `ClassEnumerationLiteral not found with id: ${payload.id}`,
        );
      }
      return await this.repository.removeEnumerationLiteral(payload);
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error removing class enumeration literal"),
      );
    }
  }
}
