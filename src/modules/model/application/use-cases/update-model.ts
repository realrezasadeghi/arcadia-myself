import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import {
  duplicateNameMessage,
  isDuplicateName,
} from "../../domain/policies/uniqueness";
import type { IModelRepository } from "../ports/model";

export type UpdateModelPayload = {
  payload: {
    modelId: string;
    name?: string;
    description?: string;
  };
  context: {
    token: string;
  };
};

export type UpdateModelResponse = {
  id: string;
  projectId: string;
  layer: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * UpdateModelUseCase
 *
 * Business rules:
 * 1. مدل باید وجود داشته باشد
 * 2. نام اگر داده شود نمی‌تواند خالی باشد
 */
export class UpdateModelUseCase {
  constructor(private readonly modelRepository: IModelRepository) {}

  async execute({ payload }: UpdateModelPayload): Promise<UpdateModelResponse> {
    try {
      const model = await this.modelRepository.findModelById(payload.modelId);

      if (!model) throw new Error(`Model id not found : ${payload.modelId}`);

      if (payload.name !== undefined) {
        const siblings = await this.modelRepository.findModelsByProjectId(
          model.projectId,
        );

        if (isDuplicateName(payload.name, siblings, model.id)) {
          throw new Error(
            duplicateNameMessage("model", payload.name, "this project"),
          );
        }
      }

      model.rename(payload.name);

      model.updateDescription(payload.description);

      const response = await this.modelRepository.updateModel({
        id: payload.modelId,
        name: model.name,
        layer: model.layer,
        description: model.description,
        projectId: model.projectId,
      });

      return response.toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in update model"));
    }
  }
}
