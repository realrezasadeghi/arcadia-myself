import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { ElementProperties } from "../../domain/entities/element";
import {
  ElementType,
  type ElementTypeValue,
} from "../../domain/value-objects/element-type";
import { Layer, type LayerValue } from "../../domain/value-objects/layer";
import type { IElementRepository } from "../ports/element";
import type { IModelRepository } from "./../ports/model";

export type CreateElementPayload = {
  payload: {
    modelId: string;
    type: ElementTypeValue;
    name: string;
    parentId?: string;
    description?: string;
    layer: LayerValue;
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
  layer: LayerValue;
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

      const layer = Layer.from(payload.layer);

      if (!model.layer.equals(layer)) {
        throw new Error(
          `Layer mismatch: model is ${model.layer.label} but element layer is ${layer.label}`,
        );
      }

      if (payload.parentId) {
        const parent = await this.elementRepository.findElementById({
          id: payload.parentId,
        });
        if (!parent)
          throw new Error(`Parent element "${payload.parentId}" not found`);
        if (!parent.layer.equals(layer)) {
          throw new Error("Parent element must be in the same layer");
        }
      }

      const response = await this.elementRepository.createElement({
        modelId: payload.modelId,
        layer: layer.toString(),
        parentId: payload.parentId ?? null,
        type: ElementType.from(payload.type).toString(),
        name: payload.name,
        description: payload.description,
      });

      return response.toJSON();
    } catch (error) {
      console.log("error", error);
      throw new Error(resolveErrorMessage(error, "Error in create element"));
    }
  }
}
