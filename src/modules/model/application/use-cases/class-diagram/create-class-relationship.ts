import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import { ClassConnectionPolicy } from "../../../domain/policies/class-connection";
import { ClassRelationshipType } from "../../../domain/value-objects/class-relationship-type";
import { Layer } from "../../../domain/value-objects/layer";
import type {
  CreateClassRelationshipPayload,
  IClassDiagramRepository,
} from "../../ports/class-diagram";

export type CreateClassRelationshipUseCasePayload = {
  payload: CreateClassRelationshipPayload;
  context: {
    token: string;
  };
};

export type CreateClassRelationshipUseCaseResponse = {
  id: string;
  modelId: string;
  layer: string;
  sourceElementId: string;
  targetElementId: string;
  name: string;
  description: string;
  relationshipType: string;
  aggregationKind: string;
  sourceMultiplicityLower: number;
  sourceMultiplicityUpper: string;
  targetMultiplicityLower: number;
  targetMultiplicityUpper: string;
  sourceRole: string;
  targetRole: string;
  isNavigableSource: boolean;
  isNavigableTarget: boolean;
  status: string;
  extensionProperties: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export class CreateClassRelationshipUseCase
  implements
    IUseCase<
      CreateClassRelationshipUseCasePayload,
      CreateClassRelationshipUseCaseResponse
    >
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    payload,
  }: CreateClassRelationshipUseCasePayload): Promise<CreateClassRelationshipUseCaseResponse> {
    try {
      // Validate relationship type
      const relationshipType = ClassRelationshipType.from(
        payload.relationshipType,
      );

      // Validate layer
      Layer.from(payload.layer);

      // Validate source element exists
      const source = await this.repository.findElementById({
        id: payload.sourceElementId,
      });
      if (!source) {
        throw new Error(
          `Source element not found with id: ${payload.sourceElementId}`,
        );
      }
      if (source.modelId !== payload.modelId) {
        throw new Error("Source element must belong to the same model");
      }

      // Validate target element exists
      const target = await this.repository.findElementById({
        id: payload.targetElementId,
      });
      if (!target) {
        throw new Error(
          `Target element not found with id: ${payload.targetElementId}`,
        );
      }
      if (target.modelId !== payload.modelId) {
        throw new Error("Target element must belong to the same model");
      }

      // Validate connection is allowed
      ClassConnectionPolicy.assertAllowed(
        source.elementType,
        target.elementType,
        relationshipType,
      );

      const relationship = await this.repository.createRelationship(payload);

      return relationship.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error creating class relationship"),
      );
    }
  }
}
