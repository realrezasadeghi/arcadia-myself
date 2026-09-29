"use server";

import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { updateTag } from "next/cache";
import { getTransitionedDiagramType } from "../../domain/diagram-transition";
import type { ElementLayout } from "../../domain/entities/diagram";
import { ConnectionPolicy } from "../../domain/policies/connection";
import type { ElementTypeValue } from "../../domain/value-objects/element-type";
import type { LayerValue } from "../../domain/value-objects/layer";
import type { TraceLinkTypeValue } from "../../domain/value-objects/relationship-type";
import { connectElements } from "./connect-elements";
import { createDiagram } from "./create-diagram";
import { createElement } from "./create-element";
import { createModel } from "./create-model";
import { createTraceLink } from "./create-trace-link";
import { getDiagramsByModelId } from "./get-diagrams-by-model-id";
import { getModelsByProjectId } from "./get-models-by-project-id";
import { getRelationshipsByModelId } from "./get-relationships-by-model-id";
import { updateDiagramLayout } from "./update-diagram-layout";

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
  createdDiagrams: number;
  createdRelationships: number;
};

/**
 * transitionLayer
 *
 * گذار از یک لایه Arcadia به لایه بعدی (OA→SA→LA→PA).
 * برای هر نگاشت: یک المنت در لایه مقصد می‌سازد و یک trace link از نوع
 * Realization بین المنت جدید (مبدأ trace) و المنت قدیمی (مقصد trace) ایجاد می‌کند
 * (مطابق TRACE RULES: لایه پایین‌تر، لایه بالاتر را realize می‌کند).
 *
 * علاوه بر آن، دیاگرام‌های معماری لایه مبدأ را در لایه مقصد بازسازی می‌کند
 * (با نوع دیاگرامِ معادل در لایه جدید، layout بازنویسی‌شده با شناسه‌های جدید) و
 * روابطی را که هر دو سرِ آن‌ها گذار کرده‌اند — در صورت مجاز بودن در لایه جدید —
 * دوباره می‌سازد.
 *
 * این action، actionهای موجود (createModel/createElement/createTraceLink/
 * createDiagram/connectElements) را هماهنگ می‌کند تا از DTOها و قوانین
 * اعتبارسنجی موجود استفاده مجدد شود. معادل REST: `POST /api/models/:id/transition`.
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

    // ۱) مدل لایه مقصد را پیدا یا ایجاد کن + داده‌های لایه مبدأ را بخوان
    const [modelsRes, sourceDiagramsRes, sourceRelationshipsRes] =
      await Promise.all([
        getModelsByProjectId(projectId),
        getDiagramsByModelId(sourceModelId),
        getRelationshipsByModelId(sourceModelId),
      ]);
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

    /** شناسه هر المنتِ مبدأ → (شناسه و نوعِ) المنت جدید در لایه مقصد */
    const transitioned = new Map<
      string,
      { id: string; type: ElementTypeValue }
    >();

    for (const mapping of mappings) {
      const elementRes = await createElement({
        type: mapping.targetType,
        layer: targetLayer,
        modelId: targetModelId,
        name: mapping.targetName,
      });
      if (!elementRes.success) throw new Error(elementRes.message);
      createdElements += 1;
      transitioned.set(mapping.sourceElementId, {
        id: elementRes.data.id,
        type: mapping.targetType,
      });

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

    // ۳) دیاگرام‌های معماری لایه مبدأ را در لایه مقصد بازسازی کن
    let createdDiagrams = 0;

    for (const diagram of sourceDiagramsRes.data ?? []) {
      const targetType = getTransitionedDiagramType(diagram.type);
      if (!targetType) continue;

      const diagramRes = await createDiagram({
        type: targetType,
        name: diagram.name,
        modelId: targetModelId,
        description: diagram.description,
      });
      if (!diagramRes.success) continue;

      const elementLayouts: ElementLayout[] = [];
      for (const layout of diagram.elementLayouts) {
        const element = transitioned.get(layout.elementId);
        if (!element) continue;
        elementLayouts.push({
          elementId: element.id,
          position: layout.position,
          size: layout.size,
        });
      }

      if (elementLayouts.length > 0) {
        await updateDiagramLayout({
          id: diagramRes.data.id,
          viewport: diagram.viewport,
          elementLayouts,
        });
      }

      createdDiagrams += 1;
    }

    // ۴) روابطی که هر دو سرشان گذار کرده‌اند را در لایه مقصد بساز
    let createdRelationships = 0;

    for (const relationship of sourceRelationshipsRes.data ?? []) {
      const source = transitioned.get(relationship.sourceElementId);
      const target = transitioned.get(relationship.targetElementId);
      if (!source || !target) continue;

      const relationshipType = ConnectionPolicy.resolveTransitionType(
        source.type,
        target.type,
        relationship.type,
      );
      if (!relationshipType) continue;

      const connectRes = await connectElements({
        modelId: targetModelId,
        sourceElementId: source.id,
        targetElementId: target.id,
        relationshipType,
        name: relationship.name,
        description: relationship.description,
        properties: relationship.properties,
      });
      if (connectRes.success) createdRelationships += 1;
    }

    updateTag(`get-models-by-project-id-${projectId}`);
    updateTag(`get-elements-by-model-id-${targetModelId}`);
    updateTag(`get-diagrams-by-model-id-${targetModelId}`);
    updateTag(`get-relationships-by-model-id-${targetModelId}`);

    return ok({
      targetModelId,
      createdElements,
      createdTraceLinks,
      createdDiagrams,
      createdRelationships,
    });
  } catch (error) {
    return fail(error);
  }
}
