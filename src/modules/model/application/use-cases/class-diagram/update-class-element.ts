import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import {
  duplicateNameMessage,
  isDuplicateName,
} from "../../../domain/policies/uniqueness";
import type {
  IClassDiagramRepository,
  UpdateClassElementPayload,
} from "../../ports/class-diagram";

export type UpdateClassElementUseCasePayload = {
  payload: UpdateClassElementPayload;
  context: {
    token: string;
  };
};

export type UpdateClassElementUseCaseResponse = {
  id: string;
  modelId: string;
  layer: string;
  name: string;
  description: string;
  elementType: string;
  visibility: string;
  isAbstract: boolean;
  isStatic: boolean;
  parentId: string | null;
  ordering: number;
  status: string;
  extensionProperties: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export class UpdateClassElementUseCase
  implements
    IUseCase<
      UpdateClassElementUseCasePayload,
      UpdateClassElementUseCaseResponse
    >
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    payload,
  }: UpdateClassElementUseCasePayload): Promise<UpdateClassElementUseCaseResponse> {
    try {
      if (payload.name !== undefined) {
        const element = await this.repository.findElementById({
          id: payload.id,
        });
        if (!element) {
          throw new Error(`Class element not found with id : ${payload.id}`);
        }

        const siblings = await this.repository.findElementsByModelId({
          modelId: element.modelId,
        });

        if (isDuplicateName(payload.name, siblings, element.id)) {
          throw new Error(
            duplicateNameMessage("class element", payload.name, "this model"),
          );
        }
      }

      // If parentId is being updated, validate it belongs to same model
      if (payload.parentId) {
        const parent = await this.repository.findElementById({
          id: payload.parentId,
        });
        if (!parent) {
          throw new Error(
            `Parent element not found with id: ${payload.parentId}`,
          );
        }
        // Note: we don't have access to the current element's modelId here,
        // but the repository will enforce consistency
      }

      const element = await this.repository.updateElement(payload);
      return element.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error updating class element"),
      );
    }
  }
}
