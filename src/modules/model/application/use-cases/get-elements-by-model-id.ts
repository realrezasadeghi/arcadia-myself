import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { ElementProperties } from "../../domain/entities/element";
import type { IElementRepository } from "../ports/element";
import type { IModelRepository } from "../ports/model";

export type GetElementsByModelIdPayload = {
  query: {
    modelId: string;
  };
  context: {
    token: string;
  };
};

export type GetElementsByModelIdResponse = {
  id: string;
  modelId: string;
  name: string;
  description?: string;
  type: string;
  updatedAt: string;
  createdAt: string;
  properties: ElementProperties;
};

/**
 * GetElementsByModelUseCase
 *
 * Business rules:
 * 1. مدل باید وجود داشته باشد
 */
export class GetElementsByModelIdUseCase
  implements
    IUseCase<GetElementsByModelIdPayload, GetElementsByModelIdResponse[]>
{
  constructor(
    private readonly modelRepository: IModelRepository,
    private readonly elementRepository: IElementRepository,
  ) {}

  async execute({
    query,
  }: GetElementsByModelIdPayload): Promise<GetElementsByModelIdResponse[]> {
    try {
      const model = await this.modelRepository.findModelById(query.modelId);

      if (!model) throw new Error(`Model not found with id : ${query.modelId}`);

      const response =
        await this.elementRepository.findElementsByModelId(query);

      return response.map((element) => element.toJSON());
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in get elements by model id"),
      );
    }
  }
}
