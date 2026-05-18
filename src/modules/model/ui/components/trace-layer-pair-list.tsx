import { getModelsByProjectId } from "../../presentation/server-actions/get-models-by-project-id";
import { getTraceLinksByProjectId } from "../../presentation/server-actions/get-trace-links-by-project-id";
import { LAYER_PAIRS } from "../constants/trace-link";
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
        />
      ))}
    </div>
  );
}
