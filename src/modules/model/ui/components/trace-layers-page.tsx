"use server";

import { getModelsByProjectId } from "@/modules/model/presentation/server-actions/get-models-by-project-id";
import { getElementsByModelId } from "@/modules/model/presentation/server-actions/get-elements-by-model-id";
import { getTraceLinksByProjectId } from "@/modules/model/presentation/server-actions/get-trace-links-by-project-id";
import { TraceLayersViewClient } from "./trace-layers-view-client";

interface TraceLayersPageProps {
  projectId: string;
}

export async function TraceLayersPage({ projectId }: TraceLayersPageProps) {
  // Fetch all data in parallel
  const [modelsRes, traceLinksRes] = await Promise.all([
    getModelsByProjectId(projectId),
    getTraceLinksByProjectId(projectId),
  ]);

  if (!modelsRes.data) {
    return <div className="p-6 text-center text-muted-foreground">No models found</div>;
  }

  // Fetch elements for each model in parallel
  const elementsResponses = await Promise.all(
    modelsRes.data.map(model => getElementsByModelId(model.id))
  );

  // Build layers map
  const layers: Record<string, any[]> = { OA: [], SA: [], LA: [], PA: [] };

  modelsRes.data.forEach((model, index) => {
    const elementsRes = elementsResponses[index];
    if (elementsRes.data) {
      layers[model.layer] = elementsRes.data.map(el => ({
        id: el.id,
        name: el.name,
        type: el.type,
        status: el.properties?.status || "DRAFT",
      }));
    }
  });

  // Transform trace links
  const traceLinks = (traceLinksRes.data || []).map(trace => ({
    id: trace.id,
    sourceElementId: trace.sourceElementId,
    sourceLayer: trace.sourceLayer,
    targetElementId: trace.targetElementId,
    targetLayer: trace.targetLayer,
    type: trace.type as "Realization" | "Allocation" | "Deployment",
    description: trace.description,
  }));

  return <TraceLayersViewClient layers={layers} traceLinks={traceLinks} />;
}
