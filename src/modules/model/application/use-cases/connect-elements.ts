import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { RelationshipProperties } from "../../domain/entities/relationship";
import { ConnectionPolicy } from "../../domain/policies/connection";
import { ElementType } from "../../domain/value-objects/element-type";
import { RelationshipType } from "../../domain/value-objects/relationship-type";
import type { IElementRepository } from "../ports/element";
import type { IRelationshipRepository } from "../ports/relationship";

export type ConnectElementsPayload = {
  payload: {
    modelId: string;
    sourceElementId: string;
    targetElementId: string;
    relationshipType: string;
    name?: string;
    description?: string;
  };
  context: {
    token: string;
  };
};

export type ConnectElementsResponse = {
  id: string;
  modelId: string;
  name: string;
  description?: string;
  sourceElementId: string;
  targetElementId: string;
  type: string;
  updatedAt: string;
  createdAt: string;
  properties: RelationshipProperties;
};

export class ConnectElementsUseCase
  implements IUseCase<ConnectElementsPayload, ConnectElementsResponse>
{
  constructor(
    private readonly elementRepository: IElementRepository,
    private readonly relationshipRepository: IRelationshipRepository,
  ) {}

  async execute({
    payload,
  }: ConnectElementsPayload): Promise<ConnectElementsResponse> {
    try {
      const [source, target] = await Promise.all([
        this.elementRepository.findElementById({
          id: payload.sourceElementId,
        }),
        this.elementRepository.findElementById({
          id: payload.targetElementId,
        }),
      ]);

      if (!source)
        throw new Error(
          `Element source not found : ${payload.sourceElementId}`,
        );
      if (!target)
        throw new Error(
          `Element target not found : ${payload.targetElementId}`,
        );

      const sourceType = ElementType.from(source.type.value);
      const targetType = ElementType.from(target.type.value);
      const relationshipType = RelationshipType.from(payload.relationshipType);

      // Policy validation — throws ConnectionNotAllowedError if invalid
      ConnectionPolicy.assertAllowed(sourceType, targetType, relationshipType);

      const response = await this.relationshipRepository.createRelationship({
        modelId: payload.modelId,
        type: relationshipType,
        sourceElementId: payload.sourceElementId,
        targetElementId: payload.targetElementId,
        name: payload.name ?? "",
        description: payload.description ?? "",
      });

      return response.toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in connect elements "));
    }
  }
}
