import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  IClassDiagramRepository,
  UpdateClassEnumerationLiteralPayload,
} from "../../ports/class-diagram";

export type UpdateClassEnumerationLiteralUseCasePayload = {
  payload: UpdateClassEnumerationLiteralPayload;
  context: {
    token: string;
  };
};

export type UpdateClassEnumerationLiteralUseCaseResponse = {
  id: string;
  classElementId: string;
  modelId: string;
  layer: string;
  name: string;
  value: string;
  ordering: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export class UpdateClassEnumerationLiteralUseCase
  implements
    IUseCase<
      UpdateClassEnumerationLiteralUseCasePayload,
      UpdateClassEnumerationLiteralUseCaseResponse
    >
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    payload,
  }: UpdateClassEnumerationLiteralUseCasePayload): Promise<UpdateClassEnumerationLiteralUseCaseResponse> {
    try {
      const existing = await this.repository.findEnumerationLiteralById({
        id: payload.id,
      });
      if (!existing) {
        throw new Error(
          `ClassEnumerationLiteral not found with id: ${payload.id}`,
        );
      }
      return (await this.repository.updateEnumerationLiteral(payload)).toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error updating class enumeration literal"),
      );
    }
  }
}
