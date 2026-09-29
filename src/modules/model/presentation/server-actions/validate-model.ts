"use server";

import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { ClassDiagramPolicy } from "../../domain/policies/class-diagram";
import {
  ValidationPolicy,
  type ValidationIssue,
} from "../../domain/policies/validation";
import { getClassElementsByModelId } from "./get-class-elements-by-model-id";
import { getClassRelationshipsByModelId } from "./get-class-relationships-by-model-id";
import { getElementsByModelId } from "./get-elements-by-model-id";
import { getModelsByProjectId } from "./get-models-by-project-id";
import { getTraceLinksByProjectId } from "./get-trace-links-by-project-id";
import { getRelationshipsByModelId } from "./get-relationships-by-model-id";

export type ValidateModelResponse = {
  issues: ValidationIssue[];
  summary: {
    total: number;
    errors: number;
    warnings: number;
    infos: number;
  };
};

export async function validateModel(
  projectId: string,
  _modelIds: string[],
): Promise<IRes<ValidateModelResponse>> {
  try {
    const modelsRes = await getModelsByProjectId(projectId);
    const models = modelsRes.data ?? [];

    const allElements: Array<{
      id: string;
      modelId: string;
      layer: string;
      type: string;
      name: string;
      parentId: string | null;
      status: string;
    }> = [];

    const allRelationships: Array<{
      id: string;
      sourceElementId: string;
      targetElementId: string;
      type: string;
    }> = [];

    const allClassElements: Array<{
      id: string;
      modelId: string;
      layer: string;
      type: string;
      name: string;
      isAbstract: boolean;
      isStatic: boolean;
      parentId: string | null;
      status: string;
      enumerationLiteralCount: number;
    }> = [];

    const allClassRelationships: Array<{
      id: string;
      modelId: string;
      layer: string;
      sourceElementId: string;
      targetElementId: string;
      relationshipType: string;
      aggregationKind: "NONE" | "SHARED" | "COMPOSITE";
      sourceMultiplicityLower: number;
      sourceMultiplicityUpper: string;
      targetMultiplicityLower: number;
      targetMultiplicityUpper: string;
      isNavigableSource: boolean;
      isNavigableTarget: boolean;
      status: string;
    }> = [];

    for (const model of models) {
      const [elementsRes, relationshipsRes, classElementsRes, classRelsRes] =
        await Promise.all([
          getElementsByModelId(model.id),
          getRelationshipsByModelId(model.id),
          getClassElementsByModelId(model.id),
          getClassRelationshipsByModelId(model.id),
        ]);

      for (const el of elementsRes.data ?? []) {
        allElements.push({
          id: el.id,
          modelId: el.modelId,
          layer: model.layer,
          type: el.type,
          name: el.name,
          parentId: el.parentId,
          status: el.properties.status,
        });
      }

      for (const r of relationshipsRes.data ?? []) {
        allRelationships.push({
          id: r.id,
          sourceElementId: r.sourceElementId,
          targetElementId: r.targetElementId,
          type: r.type,
        });
      }

      for (const el of classElementsRes.data ?? []) {
        allClassElements.push({
          id: el.id,
          modelId: el.modelId,
          layer: el.layer,
          type: el.elementType,
          name: el.name,
          isAbstract: el.isAbstract,
          isStatic: el.isStatic,
          parentId: el.parentId,
          status: el.status,
          enumerationLiteralCount: el.enumerationLiterals.length,
        });
      }

      for (const r of classRelsRes.data ?? []) {
        allClassRelationships.push({
          id: r.id,
          modelId: r.modelId,
          layer: r.layer,
          sourceElementId: r.sourceElementId,
          targetElementId: r.targetElementId,
          relationshipType: r.relationshipType,
          aggregationKind:
            r.aggregationKind === "SHARED" || r.aggregationKind === "COMPOSITE"
              ? r.aggregationKind
              : "NONE",
          sourceMultiplicityLower: r.sourceMultiplicityLower,
          sourceMultiplicityUpper: r.sourceMultiplicityUpper,
          targetMultiplicityLower: r.targetMultiplicityLower,
          targetMultiplicityUpper: r.targetMultiplicityUpper,
          isNavigableSource: r.isNavigableSource,
          isNavigableTarget: r.isNavigableTarget,
          status: r.status,
        });
      }
    }

    const traceLinksRes = await getTraceLinksByProjectId(projectId);
    const traceLinks = (traceLinksRes.data ?? []).map((t) => ({
      id: t.id,
      sourceElementId: t.sourceElementId,
      targetElementId: t.targetElementId,
      sourceLayer: t.sourceLayer,
      targetLayer: t.targetLayer,
      type: t.type,
    }));

    const issues = [
      ...ValidationPolicy.validate({
        elements: allElements,
        traceLinks,
        relationships: allRelationships,
      }),
      ...ClassDiagramPolicy.validate({
        elements: allClassElements,
        relationships: allClassRelationships,
      }),
    ].map((issue, index) => ({ ...issue, id: `val-${index + 1}` }));

    const errors = issues.filter((i) => i.severity === "error").length;
    const warnings = issues.filter((i) => i.severity === "warning").length;
    const infos = issues.filter((i) => i.severity === "info").length;

    return ok({
      issues,
      summary: { total: issues.length, errors, warnings, infos },
    });
  } catch (error) {
    return fail(error);
  }
}
