"use server";

import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { updateTag } from "next/cache";
import type { ElementTypeValue } from "../../domain/value-objects/element-type";
import type { LayerValue } from "../../domain/value-objects/layer";
import type { TraceLinkTypeValue } from "../../domain/value-objects/relationship-type";
import { createElement } from "./create-element";
import { createModel } from "./create-model";
import { createTraceLink } from "./create-trace-link";
import { getModelsByProjectId } from "./get-models-by-project-id";

export type TransitionMapping = {
  sourceElementId: string;
  targetType: ElementTypeValue;
  targetName: string;
  traceType: TraceLinkTypeValue;
};

export type TransitionLayerPayload = {
  projectId: string;
  sourceModelId: string;
  sourceLayer: LayerValue;
  targetLayer: LayerValue;
  targetModelName: string;
  mappings: TransitionMapping[];
};

export type TransitionLayerResponse = {
  targetModelId: string;
  createdElements: number;
  createdTraceLinks: number;
};

/**
 * transitionLayer
 *
 * گذار از یک لایه Arcadia به لایه بعدی (OA→SA→LA→PA).
 * برای هر نگاشت: یک المنت در لایه مقصد می‌سازد و یک trace link از نوع
 * Realization بین المنت جدید (مبدأ trace) و المنت قدیمی (مقصد trace) ایجاد می‌کند
 * (مطابق TracePolicy: لایه بالاتر، لایه پایین‌تر را realize می‌کند).
 *
 * این action، actionهای موجود (createModel/createElement/createTraceLink) را
 * هماهنگ می‌کند تا از DTOها و قوانین اعتبارسنجی موجود استفاده مجدد شود.
 * معادل REST: `POST /api/models/:id/transition`.
 */
export async function transitionLayer(
  payload: TransitionLayerPayload,
): Promise<IRes<TransitionLayerResponse>> {
  try {
    const {
      projectId,
      sourceModelId,
      sourceLayer,
      targetLayer,
      targetModelName,
      mappings,
    } = payload;

    if (mappings.length === 0) {
      throw new Error("No elements selected to transition");
    }

    // ۱) مدل لایه مقصد را پیدا یا ایجاد کن
    const modelsRes = await getModelsByProjectId(projectId);
    if (!modelsRes.success) throw new Error(modelsRes.message);

    let targetModelId = modelsRes.data.find((m) => m.layer === targetLayer)?.id;

    if (!targetModelId) {
      const created = await createModel({
        projectId,
        layer: targetLayer,
        name: targetModelName || `${targetLayer} Model`,
      });
      if (!created.success) throw new Error(created.message);
      targetModelId = created.data.id;
    }

    // ۲) برای هر نگاشت: المنت جدید + trace link
    let createdElements = 0;
    let createdTraceLinks = 0;

    for (const mapping of mappings) {
      const elementRes = await createElement({
        type: mapping.targetType,
        layer: targetLayer,
        modelId: targetModelId,
        name: mapping.targetName,
      });
      if (!elementRes.success) throw new Error(elementRes.message);
      createdElements += 1;

      const traceRes = await createTraceLink({
        projectId,
        type: mapping.traceType,
        // المنت جدید (لایه مقصد) المنت قدیمی (لایه مبدأ) را realize می‌کند
        sourceModelId: targetModelId,
        sourceLayer: targetLayer,
        sourceElementId: elementRes.data.id,
        targetModelId: sourceModelId,
        targetLayer: sourceLayer,
        targetElementId: mapping.sourceElementId,
      });
      if (traceRes.success) createdTraceLinks += 1;
    }

    updateTag(`get-models-by-project-id-${projectId}`);
    updateTag(`get-elements-by-model-id-${targetModelId}`);

    return ok({ targetModelId, createdElements, createdTraceLinks });
  } catch (error) {
    return fail(error);
  }
}
