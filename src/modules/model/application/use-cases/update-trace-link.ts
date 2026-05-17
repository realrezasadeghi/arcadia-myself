import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { LayerValue } from "../../domain/value-objects/layer";
import type { TraceLinkTypeValue } from "../../domain/value-objects/relationship-type";
import type { ITraceLinkRepository } from "../ports/trace-link";

export type UpdateTraceLinkPayload = {
  payload: {
    id: string;
    description?: string;
  };
  context: {
    token: string;
  };
};

export type UpdateTraceLinkResponse = {
  id: string;
  projectId: string;
  type: TraceLinkTypeValue;
  updatedAt: string;
  createdAt: string;
  sourceElementId: string;
  sourceLayer: LayerValue;
  targetElementId: string;
  targetLayer: LayerValue;
  description?: string;
};

/**
 * UpdateTraceLinkDescriptionUseCase
 *
 * Business rules:
 * 1. Trace Link باید وجود داشته باشد
 * 2. فقط توضیحات قابل ویرایش است — نوع، source و target تغییر نمی‌کنند
 */
export class UpdateTraceLinkDescriptionUseCase {
  constructor(private readonly traceLinkRepository: ITraceLinkRepository) {}

  async execute({
    payload,
  }: UpdateTraceLinkPayload): Promise<UpdateTraceLinkResponse> {
    try {
      const link = await this.traceLinkRepository.findById({ id: payload.id });

      if (!link)
        throw new Error(`Trace link not found with id : ${payload.id}`);

      link.updateDescription(payload.description);

      const response = await this.traceLinkRepository.update({
        id: payload.id,
        description: link.description,
      });

      return response.toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in update trace link"));
    }
  }
}
