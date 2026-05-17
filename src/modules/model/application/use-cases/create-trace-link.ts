import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import { TracePolicy } from "../../domain/policies/trace";
import { ElementType } from "../../domain/value-objects/element-type";
import { Layer, type LayerValue } from "../../domain/value-objects/layer";
import {
  TraceLinkType,
  type TraceLinkTypeValue,
} from "../../domain/value-objects/trace-link";
import type { IElementRepository } from "../ports/element";
import type { ITraceLinkRepository } from "../ports/trace-link";

export type CreateTraceLinkPayload = {
  payload: {
    projectId: string;
    type: TraceLinkTypeValue;
    sourceElementId: string;
    sourceLayer: string;
    targetElementId: string;
    targetLayer: string;
    description?: string;
  };
  context: {
    token: string;
  };
};

export type CreateTraceLinkResponse = {
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
 * CreateTraceLinkUseCase
 *
 * هر دو repository از بیرون inject می‌شوند (Dependency Inversion).
 * TracePolicy برای اعتبارسنجی استفاده می‌شود — httpClient مستقیم نیست.
 */
export class CreateTraceLinkUseCase
  implements IUseCase<CreateTraceLinkPayload, CreateTraceLinkResponse>
{
  constructor(
    private readonly traceLinkRepository: ITraceLinkRepository,
    private readonly elementRepository: IElementRepository,
  ) {}

  async execute({
    payload,
  }: CreateTraceLinkPayload): Promise<CreateTraceLinkResponse> {
    try {
      const [sourceEl, targetEl] = await Promise.all([
        this.elementRepository.findElementById({ id: payload.sourceElementId }),
        this.elementRepository.findElementById({ id: payload.targetElementId }),
      ]);

      if (!sourceEl)
        throw new Error(
          `Element not found with id : ${payload.sourceElementId}`,
        );

      if (!targetEl)
        throw new Error(
          `Element not found with id : ${payload.targetElementId}`,
        );

      const sourceType = ElementType.from(sourceEl.type.value);
      const targetType = ElementType.from(targetEl.type.value);
      const sourceLayer = Layer.from(payload.sourceLayer);
      const targetLayer = Layer.from(payload.targetLayer);
      const traceType = TraceLinkType.from(payload.type);

      // Policy validation — throws TraceLinkNotAllowedError if invalid
      TracePolicy.assertAllowed(
        sourceType,
        sourceLayer,
        targetType,
        targetLayer,
        traceType,
      );

      const response = await this.traceLinkRepository.create({
        projectId: payload.projectId,
        type: traceType,
        sourceElementId: payload.sourceElementId,
        sourceLayer,
        targetElementId: payload.targetElementId,
        targetLayer,
        description: payload.description,
      });

      return response.toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in create trace link"));
    }
  }
}
