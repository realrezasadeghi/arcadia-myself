import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  CreateClassEnumerationLiteralPayload,
  IClassDiagramRepository,
} from "../../ports/class-diagram";

export type CreateClassEnumerationLiteralUseCasePayload = {
  payload: CreateClassEnumerationLiteralPayload;
  context: {
    token: string;
  };
};

export type CreateClassEnumerationLiteralUseCaseResponse = {
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

export class CreateClassEnumerationLiteralUseCase
  implements
    IUseCase<
      CreateClassEnumerationLiteralUseCasePayload,
      CreateClassEnumerationLiteralUseCaseResponse
    >
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    payload,
  }: CreateClassEnumerationLiteralUseCasePayload): Promise<CreateClassEnumerationLiteralUseCaseResponse> {
    try {
      const literal = await this.repository.createEnumerationLiteral(payload);
      return literal.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error creating class enumeration literal"),
      );
    }
  }
}
