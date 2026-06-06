import { getProjectById } from "@/modules/project/presentation/server-actions/get-by-id";
import { ScrollArea } from "@/modules/shared/ui/components/ui/scroll-area";
import { getDiagramsByModelId } from "../../presentation/server-actions/get-diagrams-by-model-id";
import { getElementsByModelId } from "../../presentation/server-actions/get-elements-by-model-id";
import { getModelsByProjectId } from "../../presentation/server-actions/get-models-by-project-id";
import { ModelExplorerTree } from "./model-explorer-tree";

export type ModelExplorerProps = {
  params: Promise<{ id: string; diagramId?: string }>;
};

export async function ModelExplorer({ params }: ModelExplorerProps) {
  const { id: projectId, diagramId } = await params;

  const [projectResult, modelsResult] = await Promise.all([
    getProjectById(+projectId),
    getModelsByProjectId(projectId),
  ]);

  const project = projectResult.data;
  const models = modelsResult.data ?? [];

  const modelData = await Promise.all(
    models.map(async (model) => {
      const [elementsResult, diagramsResult] = await Promise.all([
        getElementsByModelId(model.id),
        getDiagramsByModelId(model.id),
      ]);

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
        diagrams: diagramsResult.data ?? [],
      };
    }),
  );

  return (
    <aside className="flex w-60 shrink-0 flex-col border-l bg-card overflow-hidden">
      <div className="sticky top-0 z-10 bg-card border-b px-3 py-2.5 shrink-0">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
          {project?.name ?? "Project"}
        </p>
      </div>
      <ScrollArea className="flex-1">
        <ModelExplorerTree
          modelData={modelData}
          currentDiagramId={diagramId}
          projectId={projectId}
        />
      </ScrollArea>
    </aside>
  );
}
