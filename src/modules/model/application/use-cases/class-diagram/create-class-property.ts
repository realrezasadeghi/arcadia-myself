import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  CreateClassPropertyPayload,
  IClassDiagramRepository,
} from "../../ports/class-diagram";

export type CreateClassPropertyUseCasePayload = {
  payload: CreateClassPropertyPayload;
  context: {
    token: string;
  };
};

export type CreateClassPropertyUseCaseResponse = {
  id: string;
  classElementId: string;
  modelId: string;
  layer: string;
  name: string;
  typeClassElementId: string | null;
  typeLiteral: string;
  isStatic: boolean;
  isReadOnly: boolean;
  visibility: string;
  multiplicityLower: number;
  multiplicityUpper: string;
  collectionKind: string;
  defaultValue: string;
  ordering: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export class CreateClassPropertyUseCase
  implements
    IUseCase<
      CreateClassPropertyUseCasePayload,
      CreateClassPropertyUseCaseResponse
    >
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    payload,
  }: CreateClassPropertyUseCasePayload): Promise<CreateClassPropertyUseCaseResponse> {
    try {
      const property = await this.repository.createProperty(payload);
      return property.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error creating class property"),
      );
    }
  }
}
