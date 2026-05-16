import { Suspense } from "react";
import { getProjectById } from "../../presentation/server-actions/get-by-id";
import { LayerBadge } from "../components/layer-badge";
import { LayerList } from "../components/layer-list";
import { ProjectDetailsToolbar } from "../components/project-details-toolbar";
import { LAYERS } from "../constants/layer";

type ProjectDetailsViewProps = {
  params: Promise<{ id: string }>;
};

export async function ProjectDetailsView({ params }: ProjectDetailsViewProps) {
  const { id: projectId } = await params;

  const { data: project } = await getProjectById(+projectId);

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
      <ProjectDetailsToolbar project={project} />
      <div className="flex items-center gap-2 overflow-x-auto">
        {LAYERS.map((layer) => (
          <LayerBadge key={layer.value} layer={layer} showLabel />
        ))}
      </div>
      <Suspense>
        <LayerList projectId={projectId} />
      </Suspense>
    </div>
  );
}
