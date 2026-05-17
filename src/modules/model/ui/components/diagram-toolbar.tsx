import { getProjectById } from "@/modules/project/presentation/server-actions/get-by-id";
import { getDiagramById } from "../../presentation/server-actions/get-diagram-by-id";
import { getDiagramLayer } from "../helpers/diagram";
import { getLayerInfo } from "../helpers/layer";
import { DiagramToolbarActions } from "./diagram-toolbar-actions";
import { DiagramToolbarBreadcrumb } from "./diagram-toolbar-breadcrumb";

export type DiagramToolbarProps = {
  params: Promise<{ id: string; diagramId: string }>;
};

export async function DiagramToolbar({ params }: DiagramToolbarProps) {
  const { id: projectId, diagramId } = await params;

  const [project, diagram] = await Promise.all([
    getProjectById(+projectId),
    getDiagramById(diagramId),
  ]);

  const layer = getLayerInfo(getDiagramLayer(diagram.data.type));

  return (
    <div className="flex items-center justify-between h-11 shrink-0 gap-1 border-b bg-background px-6">
      <DiagramToolbarBreadcrumb
        projectId={projectId}
        layerName={layer.labelFa}
        diagramName={diagram.data.name}
        projectName={project.data.name}
      />

      <DiagramToolbarActions
        layer={layer.value}
        projectName={project.data.name}
        diagramName={diagram.data.name}
      />
    </div>
  );
}
