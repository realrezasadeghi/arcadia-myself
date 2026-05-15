import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { ElementProperties } from "../../domain/entities/element";
import type { IElementRepository } from "../ports/element";

export type GetElementByIdPayload = {
  query: {
    id: string;
  };
  context: {
    token: string;
  };
};

export type GetElementByIdResponse = {
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
 * GetElementUseCase
 *
 * Business rules:
 * 1. المنت باید وجود داشته باشد
 */
export class GetElementUseCase
  implements IUseCase<GetElementByIdPayload, GetElementByIdResponse>
{
  constructor(private readonly elementRepository: IElementRepository) {}

  async execute({
    query,
  }: GetElementByIdPayload): Promise<GetElementByIdResponse> {
    try {
      const element = await this.elementRepository.findElementById(query);
      if (!element) throw new Error(`Element not found with id : ${query.id}`);
      return element.toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in get element by id"));
    }
  }
}
