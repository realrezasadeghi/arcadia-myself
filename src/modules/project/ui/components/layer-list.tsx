import { getModelsByProjectId } from "@/modules/model/presentation/server-actions/get-models-by-project-id";
import { LAYERS } from "@/modules/model/ui/constants/layer";
import { LayerCard } from "./layer-card";

type LayerListProps = {
  projectId: string;
};

export async function LayerList({ projectId }: LayerListProps) {
  const { data: models } = await getModelsByProjectId(projectId);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {LAYERS.map((layer) => {
        const model = models?.find((m) => m.layer === layer.value) || null;
        return (
          <LayerCard
            model={model}
            key={layer.value}
            projectId={projectId}
            layer={{ label: layer.label, value: layer.value }}
          />
        );
      })}
    </div>
  );
}
