import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { RelationshipProperties } from "../../domain/entities/relationship";
import type { RelationshipTypeValue } from "../../domain/value-objects/relationship-type";
import type { IModelRepository } from "../ports/model";
import type { IRelationshipRepository } from "../ports/relationship";

export type GetRelationshipsByModelIdPayload = {
  query: {
    modelId: string;
  };
  context: {
    token: string;
  };
};

export type GetRelationshipsByModelIdResponse = {
  id: string;
  modelId: string;
  name: string;
  description?: string;
  sourceElementId: string;
  targetElementId: string;
  type: RelationshipTypeValue;
  updatedAt: string;
  createdAt: string;
  properties: RelationshipProperties;
};

/**
 * GetRelationshipsByModelUseCase
 *
 * Business rules:
 * 1. مدل باید وجود داشته باشد
 */
export class GetRelationshipsByModelIdUseCase
  implements
    IUseCase<
      GetRelationshipsByModelIdPayload,
      GetRelationshipsByModelIdResponse[]
    >
{
  constructor(
    private readonly modelRepository: IModelRepository,
    private readonly relationshipRepository: IRelationshipRepository,
  ) {}

  async execute({
    query,
  }: GetRelationshipsByModelIdPayload): Promise<
    GetRelationshipsByModelIdResponse[]
  > {
    try {
      const model = await this.modelRepository.findModelById(query.modelId);

      if (!model) throw new Error(`Model not found with id : ${query.modelId}`);

      const response =
        await this.relationshipRepository.findRelationshipsByModelId(query);

      return response.map((relationship) => relationship.toJSON());
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in get relationship by model id"),
      );
    }
  }
}
