"use server";

import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { ValidationPolicy, type ValidationIssue } from "../../domain/policies/validation";
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

    for (const model of models) {
      const [elementsRes, relationshipsRes] = await Promise.all([
        getElementsByModelId(model.id),
        getRelationshipsByModelId(model.id),
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

    const issues = ValidationPolicy.validate({
      elements: allElements,
      traceLinks,
      relationships: allRelationships,
    });

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
