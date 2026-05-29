import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { ElementProperties } from "../../domain/entities/element";
import type { IElementRepository } from "../ports/element";

export type UpdateElementPayload = {
  payload: {
    id: string;
    name: string;
    description?: string;
    properties?: ElementProperties;
  };
  context: {
    token: string;
  };
};

export type UpdateElementResponse = {
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
 * UpdateElementUseCase
 *
 * Business rules:
 * 1. المنت باید وجود داشته باشد
 * 2. نام اگر داده شود نمی‌تواند خالی باشد
 * 3. المنت deprecated نمی‌تواند به VALIDATED تغییر وضعیت دهد
 */
export class UpdateElementUseCase
  implements IUseCase<UpdateElementPayload, UpdateElementResponse>
{
  constructor(private readonly elementRepository: IElementRepository) {}

  async execute({
    payload,
  }: UpdateElementPayload): Promise<UpdateElementResponse> {
    try {
      const element = await this.elementRepository.findElementById({
        id: payload.id,
      });

      if (!element)
        throw new Error(`Element not found with id : ${payload.id}`);

      if (
        payload.properties?.status === "VALIDATED" &&
        element.isDeprecated()
      ) {
        throw new Error("Element is deprecated and can't update");
      }

      element.rename(payload.name);

      element.updateDescription(payload.description);

      element.updateProperties({ ...payload.properties });

      const response = await this.elementRepository.updateElement({
        id: payload.id,
        name: element.name,
        description: element.description,
        properties: element.properties,
      });

      return response.toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in update element"));
    }
  }
}
