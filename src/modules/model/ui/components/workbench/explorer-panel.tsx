"use client";

import { DiagramFormDialog } from "@/modules/project/ui/components/diagram-form-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/modules/shared/ui/components/ui/dropdown-menu";
import { ScrollArea } from "@/modules/shared/ui/components/ui/scroll-area";
import { useConfirm } from "@/modules/shared/ui/hooks/use-confirm";
import { Check, FolderTree, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { LAYERS } from "../../constants/layer";
import { getDiagramPalette, resolveDiagramLayer } from "../../helpers/diagram";
import { getLayerInfo } from "../../helpers/layer";
import { useCanvasStore } from "../../stores/canvas";
import { useWorkbenchStore } from "../../stores/workbench";
import type { Diagram } from "../../types/diagram";
import type { Model } from "../../types/model";
import { useExplorerActions } from "../../hooks/use-explorer-actions";
import {
  type ElementTreeNode,
  type ExplorerHandlers,
  ExplorerTree,
} from "./explorer-tree";
import { TransitionWizard } from "./transition-wizard";
import type { WorkbenchModelData } from "./workbench";

type ExplorerPanelProps = {
  projectId: string;
  modelData: WorkbenchModelData[];
  onTreeChanged: () => void;
};

export function ExplorerPanel({
  projectId,
  modelData,
  onTreeChanged,
}: ExplorerPanelProps) {
  const confirm = useConfirm();

  const openTab = useWorkbenchStore((s) => s.openTab);
  const closeTab = useWorkbenchStore((s) => s.closeTab);
  const renameTab = useWorkbenchStore((s) => s.renameTab);
  const selectElement = useWorkbenchStore((s) => s.selectElement);
  const currentLayer = useWorkbenchStore((s) => s.currentLayer);

  const selectCanvasNode = useCanvasStore((s) => s.selectNode);
  const canvasNodes = useCanvasStore((s) => s.nodes);

  const scrollRef = useRef<HTMLDivElement>(null);

  const [transitionModel, setTransitionModel] = useState<Model | null>(null);

  const {
    isCreateDiagramPending,
    isUpdateDiagramPending,
    isCreateModelPending,
    onNewModel,
    onNewElement,
    onNewClassElement,
    onDeleteElement,
    onDeleteDiagram,
    onAddElementToDiagram,
    diagramDialogModel,
    setDiagramDialogModel,
    editDiagram,
    setEditDiagram,
    onSubmitDiagram,
    onSubmitEditDiagram,
  } = useExplorerActions({
    projectId,
    modelData,
    onTreeChanged,
    openTab,
    closeTab,
    renameTab,
  });

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const target = container.querySelector(`[data-layer="${currentLayer}"]`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentLayer]);

  const existingLayers = useMemo(
    () => new Set(modelData.map((m) => m.model.layer)),
    [modelData],
  );

  const handleSelectElement = useCallback(
    (elementId: string) => {
      selectElement(elementId);

      // find first diagram that contains this element and open it
      for (const { model, diagrams } of modelData) {
        const diagram = diagrams.find((d) =>
          d.elementLayouts.some((l) => l.elementId === elementId),
        );
        if (diagram) {
          openTab({
            diagramId: diagram.id,
            modelId: model.id,
            name: diagram.name,
            type: diagram.type,
            layer: resolveDiagramLayer(diagram.type, model.layer),
          });
          return;
        }
      }

      // fallback: if on current canvas, select the node
      if (canvasNodes.some((n) => n.id === elementId)) {
        selectCanvasNode(elementId);
      }
    },
    [selectElement, selectCanvasNode, canvasNodes, modelData, openTab],
  );

  const handleDeleteElement = useCallback(
    async (element: ElementTreeNode) => {
      const ok = await confirm({
        tone: "danger",
        title: "Delete element",
        description: `Delete "${element.name}"? This also removes it from any diagram.`,
        confirmText: "Delete",
      });
      if (!ok) return;
      onDeleteElement(element);
    },
    [confirm, onDeleteElement],
  );

  const handleDeleteDiagram = useCallback(
    async (diagram: Diagram) => {
      const ok = await confirm({
        tone: "danger",
        title: "Delete diagram",
        description: `Delete diagram "${diagram.name}"?`,
        confirmText: "Delete",
      });
      if (!ok) return;
      onDeleteDiagram(diagram);
    },
    [confirm, onDeleteDiagram],
  );

  const handleAddElementToDiagram = useCallback(
    (element: ElementTreeNode, diagram: Diagram) => {
      const palette = getDiagramPalette(diagram.type);
      if (!palette.elementTypes.includes(element.type)) {
        toast.error(
          `Cannot add "${element.name}" to ${diagram.type} diagram. ` +
            `This diagram type only supports: ${palette.elementTypes.join(", ")}`,
        );
        return;
      }
      onAddElementToDiagram(element, diagram);
    },
    [onAddElementToDiagram],
  );

  const handleOpenDiagram = useCallback(
    (model: Model, diagram: Diagram) => {
      openTab({
        diagramId: diagram.id,
        modelId: model.id,
        name: diagram.name,
        type: diagram.type,
        layer: resolveDiagramLayer(diagram.type, model.layer),
      });
    },
    [openTab],
  );

  const handlers: ExplorerHandlers = useMemo(
    () => ({
      onOpenDiagram: handleOpenDiagram,
      onSelectElement: handleSelectElement,
      onNewElement,
      onNewClassElement,
      onDeleteElement: handleDeleteElement,
      onDeleteDiagram: handleDeleteDiagram,
      onNewDiagram: setDiagramDialogModel,
      onEditDiagram: (model: Model, diagram: Diagram) =>
        setEditDiagram({ model, diagram }),
      onTransition: setTransitionModel,
      onAddElementToDiagram: handleAddElementToDiagram,
      diagrams: modelData.flatMap((m) => m.diagrams),
    }),
    [
      handleOpenDiagram,
      handleSelectElement,
      onNewElement,
      onNewClassElement,
      handleDeleteElement,
      handleDeleteDiagram,
      setDiagramDialogModel,
      setEditDiagram,
      handleAddElementToDiagram,
      modelData,
    ],
  );

  return (
    <aside className="flex h-full min-h-0 flex-col border-r bg-card">
      <div className="flex h-8 shrink-0 items-center gap-1.5 border-b bg-muted/30 px-3">
        <FolderTree className="size-3.5 text-muted-foreground" />
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Project Explorer
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              title="New model"
              aria-label="New model"
              disabled={isCreateModelPending}
              className="ms-auto flex size-5 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            >
              <Plus className="size-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-62" align="end">
            <DropdownMenuLabel>New Model</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {LAYERS.map((layer) => {
              const exists = existingLayers.has(layer.value);
              return (
                <DropdownMenuItem
                  key={layer.value}
                  disabled={exists}
                  onSelect={() => onNewModel(layer.value)}
                >
                  <span className="flex-1">{layer.label}</span>
                  {exists ? (
                    <Check className="size-3.5 text-muted-foreground" />
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {layer.value}
                    </span>
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div ref={scrollRef}>
          <ExplorerTree
            modelData={modelData}
            handlers={handlers}
            existingLayers={existingLayers}
            onNewModel={onNewModel}
          />
        </div>
      </ScrollArea>

      {diagramDialogModel && (
        <DiagramFormDialog
          open={!!diagramDialogModel}
          onOpenChange={(open) => !open && setDiagramDialogModel(null)}
          diagram={null}
          loading={isCreateDiagramPending}
          onSubmit={onSubmitDiagram}
          layer={{
            value: diagramDialogModel.layer,
            label: getLayerInfo(diagramDialogModel.layer).label,
          }}
        />
      )}

      {editDiagram && (
        <DiagramFormDialog
          open={!!editDiagram}
          onOpenChange={(open) => !open && setEditDiagram(null)}
          diagram={{
            name: editDiagram.diagram.name,
            description: editDiagram.diagram.description,
            type: editDiagram.diagram.type,
          }}
          loading={isUpdateDiagramPending}
          onSubmit={onSubmitEditDiagram}
          layer={{
            value: editDiagram.model.layer,
            label: getLayerInfo(editDiagram.model.layer).label,
          }}
        />
      )}

      {transitionModel && (
        <TransitionWizard
          open={!!transitionModel}
          onOpenChange={(open) => !open && setTransitionModel(null)}
          projectId={projectId}
          sourceModel={transitionModel}
          sourceElements={
            modelData.find((m) => m.model.id === transitionModel.id)
              ?.elements ?? []
          }
          onCompleted={() => {
            setTransitionModel(null);
            onTreeChanged();
          }}
        />
      )}
    </aside>
  );
}
