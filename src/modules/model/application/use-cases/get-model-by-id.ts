import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IModelRepository } from "../ports/model";

export type GetModelByIdPayload = {
  query: {
    modelId: string;
  };
  context: {
    token: string;
  };
};

export type GetModelByIdResponse = {
  id: string;
  projectId: string;
  layer: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * GetModelUseCase
 *
 * Business rules:
 * 1. مدل باید وجود داشته باشد
 */
export class GetModelUseCase
  implements IUseCase<GetModelByIdPayload, GetModelByIdResponse>
{
  constructor(private readonly repository: IModelRepository) {}

  async execute({ query }: GetModelByIdPayload): Promise<GetModelByIdResponse> {
    try {
      const model = await this.repository.findModelById(query.modelId);
      if (!model) throw new Error(`Model not found with ID : ${query.modelId}`);
      return model.toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in get model id"));
    }
  }
}
