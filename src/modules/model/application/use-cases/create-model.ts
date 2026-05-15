import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import { Layer } from "../../domain/value-objects/layer";
import type { IModelRepository } from "../ports/model";

export type CreateModelPayload = {
  payload: {
    projectId: string;
    layer: string | Layer;
    name: string;
    description?: string;
  };
  context: {
    token: string;
  };
};

export type CreateModelResponse = {
  id: string;
  projectId: string;
  layer: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * CreateModelUseCase
 *
 * Business rules:
 * 1. لایه باید یکی از لایه‌های معتبر Arcadia باشد (OA/SA/LA/PA)
 * 2. هر پروژه حداکثر یک مدل از هر لایه می‌تواند داشته باشد
 */

export class CreateModelUseCase
  implements IUseCase<CreateModelPayload, CreateModelResponse>
{
  constructor(private readonly modelRepository: IModelRepository) {}

  async execute({ payload }: CreateModelPayload): Promise<CreateModelResponse> {
    try {
      const layer =
        payload.layer instanceof Layer
          ? payload.layer
          : Layer.from(payload.layer);

      const existing = await this.modelRepository.findModelByProjectIdAndLayer(
        payload.projectId,
        layer,
      );

      if (existing) {
        throw new Error(
          `This project already had a model for this layer : ${layer.label}`,
        );
      }

      const response = await this.modelRepository.createModel({
        ...payload,
        layer,
      });

      return response.toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in create model"));
    }
  }
}
