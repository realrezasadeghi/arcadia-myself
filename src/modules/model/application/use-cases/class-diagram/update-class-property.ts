import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  IClassDiagramRepository,
  UpdateClassPropertyPayload,
} from "../../ports/class-diagram";

export type UpdateClassPropertyUseCasePayload = {
  payload: UpdateClassPropertyPayload;
  context: {
    token: string;
  };
};

export type UpdateClassPropertyUseCaseResponse = {
  id: string;
  classElementId: string;
  modelId: string;
  layer: string;
  name: string;
  description: string;
  typeClassElementId: string | null;
  typeLiteral: string;
  isStatic: boolean;
  isReadOnly: boolean;
  isDerived: boolean;
  isID: boolean;
  visibility: string;
  multiplicityLower: number;
  multiplicityUpper: string;
  isOrdered: boolean;
  isUnique: boolean;
  collectionKind: string;
  aggregationKind: string;
  defaultValue: string;
  ordering: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export class UpdateClassPropertyUseCase
  implements
    IUseCase<
      UpdateClassPropertyUseCasePayload,
      UpdateClassPropertyUseCaseResponse
    >
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    payload,
  }: UpdateClassPropertyUseCasePayload): Promise<UpdateClassPropertyUseCaseResponse> {
    try {
      // Validate property exists and belongs to model (if classElementId is provided in payload)
      const existing = await this.repository.findPropertyById({
        id: payload.id,
      });
      if (!existing) {
        throw new Error(`ClassProperty not found with id: ${payload.id}`);
      }

      // If classElementId is being changed, validate it exists and belongs to same model
      // Note: The current payload doesn't include classElementId for update, so this is future-proofing

      const property = await this.repository.updateProperty(payload);
      return property.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error updating class property"),
      );
    }
  }
}
