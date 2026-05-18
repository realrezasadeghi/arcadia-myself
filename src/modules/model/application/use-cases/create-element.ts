import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { ElementProperties } from "../../domain/entities/element";
import {
  ElementType,
  type ElementTypeValue,
} from "../../domain/value-objects/element-type";
import type { IElementRepository } from "../ports/element";
import type { IModelRepository } from "./../ports/model";

export type CreateElementPayload = {
  payload: {
    modelId: string;
    type: ElementTypeValue;
    name: string;
    description?: string;
  };
  context: {
    token: string;
  };
};

export type CreateElementResponse = {
  id: string;
  modelId: string;
  name: string;
  description?: string;
  type: ElementTypeValue;
  updatedAt: string;
  createdAt: string;
  properties: ElementProperties;
};

export class CreateElementUseCase
  implements IUseCase<CreateElementPayload, CreateElementResponse>
{
  constructor(
    private readonly modelRepository: IModelRepository,
    private readonly elementRepository: IElementRepository,
  ) {}

  async execute({
    payload,
  }: CreateElementPayload): Promise<CreateElementResponse> {
    try {
      const model = await this.modelRepository.findModelById(payload.modelId);

      if (!model)
        throw new Error(`Model not found with id : ${payload.modelId}`);

      const response = await this.elementRepository.createElement({
        modelId: payload.modelId,
        type: ElementType.from(payload.type).toString(),
        name: payload.name,
        description: payload.description,
      });

      return response.toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in create element"));
    }
  }
}
