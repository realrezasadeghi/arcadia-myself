import { getProjectById } from "@/modules/project/presentation/server-actions/get-by-id";
import { getDiagramsByModelId } from "../../../presentation/server-actions/get-diagrams-by-model-id";
import { getElementsByModelId } from "../../../presentation/server-actions/get-elements-by-model-id";
import { getModelsByProjectId } from "../../../presentation/server-actions/get-models-by-project-id";
import { getScenarioDiagramsByModelId } from "../../../presentation/server-actions/scenario/get-diagrams-by-model-id";
import { Workbench, type WorkbenchModelData } from "./workbench";

type WorkbenchViewProps = {
  params: Promise<{ id: string }>;
};

/**
 * WorkbenchView (Server Component)
 *
 * درخت کامل پروژه را سمت سرور واکشی می‌کند و به Workbench (client) می‌دهد.
 * پس از mutationها، client با router.refresh() این server component را
 * دوباره اجرا می‌کند تا props تازه شوند (state کلاینت حفظ می‌شود).
 */
export async function WorkbenchView({ params }: WorkbenchViewProps) {
  const { id: projectId } = await params;

  const [projectResult, modelsResult] = await Promise.all([
    getProjectById(+projectId),
    getModelsByProjectId(projectId),
  ]);

  const project = projectResult.data;
  const models = modelsResult.data ?? [];

  const modelData: WorkbenchModelData[] = await Promise.all(
    models.map(async (model) => {
      const [elementsResult, diagramsResult, scenarioDiagramsResult] =
        await Promise.all([
          getElementsByModelId(model.id),
          getDiagramsByModelId(model.id),
          getScenarioDiagramsByModelId(model.id),
        ]);

      const architectureDiagrams = diagramsResult.data ?? [];
      const scenarioDiagrams = (scenarioDiagramsResult.data ?? []).map((d) => ({
        id: d.id,
        modelId: d.modelId,
        type: d.type as import("../../types/diagram").DiagramTypeValue,
        name: d.name,
        description: d.description,
        viewport: { x: d.viewport.x, y: d.viewport.y, zoom: d.viewport.zoom },
        elementLayouts: [],
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      }));

      return {
        model,
        elements: (elementsResult.data ?? []).map((el) => ({
          id: el.id,
          modelId: el.modelId,
          type: el.type,
          name: el.name,
          description: el.description,
          parentId: el.parentId,
          status: el.properties.status,
          createdAt: el.createdAt,
          updatedAt: el.updatedAt,
        })),
        diagrams: [...architectureDiagrams, ...scenarioDiagrams],
      };
    }),
  );

  return (
    <Workbench
      projectId={projectId}
      modelData={modelData}
      projectName={project?.name ?? "Project"}
    />
  );
}
