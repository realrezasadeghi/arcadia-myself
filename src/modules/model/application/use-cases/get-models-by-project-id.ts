import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import { LayerValue } from "../../domain/value-objects/layer";
import type { IModelRepository } from "../ports/model";

export type GetModelsByProjectIdPayload = {
  query: {
    projectId: string;
  };
  context: {
    token: string;
  };
};

export type GetModelsByProjectIdResponse = {
  id: string;
  projectId: string;
  layer: LayerValue;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * GetModelsByProjectUseCase
 *
 * تمام مدل‌های یک پروژه را بازمی‌گرداند.
 * Business rule: projectId نمی‌تواند خالی باشد.
 */
export class GetModelsByProjectIdUseCase
  implements
    IUseCase<GetModelsByProjectIdPayload, GetModelsByProjectIdResponse[]>
{
  constructor(private readonly modelRepository: IModelRepository) {}

  async execute({
    query,
  }: GetModelsByProjectIdPayload): Promise<GetModelsByProjectIdResponse[]> {
    try {
      if (!query.projectId) {
        throw new Error("Project id is required.");
      }

      const response = await this.modelRepository.findModelsByProjectId(
        query.projectId,
      );

      return response.map((model) => model.toJSON());
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in get models by project id"),
      );
    }
  }
}
