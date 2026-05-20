import { getElementsByModelId } from "../../presentation/server-actions/get-elements-by-model-id"; // همین server action که هوک کلاینت از آن استفاده می‌کند
import { getModelsByProjectId } from "../../presentation/server-actions/get-models-by-project-id";
import { getTraceLinksByProjectId } from "../../presentation/server-actions/get-trace-links-by-project-id";
import { LAYER_PAIRS } from "../constants/trace-link";
import type { Element } from "../types/element";
import { TraceLayerPair } from "./trace-layer-pair";

type TraceLayerPairListProps = {
  params: Promise<{ id: string }>;
};

export async function TraceLayerPairList({ params }: TraceLayerPairListProps) {
  const { id: projectId } = await params;

  const [models, traceLinks] = await Promise.all([
    getModelsByProjectId(projectId),
    getTraceLinksByProjectId(projectId),
  ]);

  const modelIds = (models.data ?? []).map((model) => model.id);

  const elementsResults = await Promise.all(
    modelIds.map((id) => getElementsByModelId(id)),
  );

  const elementsByModelId = new Map<string, Element[]>();

  modelIds.forEach((id, index) => {
    elementsByModelId.set(
      id,
      elementsResults[index].data.map((element) => ({
        id: element.id,
        name: element.name,
        type: element.type,
        modelId: element.modelId,
        updatedAt: element.updatedAt,
        createdAt: element.createdAt,
        description: element.description,
        status: element.properties.status,
      })) ?? [],
    );
  });

  return (
    <div className="flex flex-col gap-8">
      {LAYER_PAIRS.map(({ upper, lower, label }) => (
        <TraceLayerPair
          key={label}
          upper={upper}
          lower={lower}
          label={label}
          projectId={projectId}
          models={models.data ?? []}
          traceLinks={traceLinks.data ?? []}
          elementsByModelId={elementsByModelId}
        />
      ))}
    </div>
  );
}
