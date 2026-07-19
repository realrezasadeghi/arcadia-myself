"use client";

import { DiagramFormDialog } from "@/modules/project/ui/components/diagram-form-dialog";
import type { DiagramFormValues } from "@/modules/project/ui/schemas/diagram";
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
import { useCreateDiagram } from "../../clients/create-diagram";
import { useCreateElement } from "../../clients/create-element";
import { useCreateModel } from "../../clients/create-model";
import { useRemoveDiagram } from "../../clients/remove-diagram";
import { useRemoveElement } from "../../clients/remove-element";
import { useUpdateDiagram } from "../../clients/update-diagram";
import { LAYERS } from "../../constants/layer";
import { getDiagramLayer, getDiagramPalette } from "../../helpers/diagram";
import { getElementTypeInfo } from "../../helpers/element";
import { getLayerInfo } from "../../helpers/layer";
import { useCanvasStore } from "../../stores/canvas";
import { useWorkbenchStore } from "../../stores/workbench";
import type { Diagram } from "../../types/diagram";
import type { ElementTypeValue } from "../../types/element";
import type { LayerValue } from "../../types/layer";
import type { Model } from "../../types/model";
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

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const target = container.querySelector(`[data-layer="${currentLayer}"]`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentLayer]);

  const createDiagram = useCreateDiagram();
  const createElement = useCreateElement();
  const createModel = useCreateModel();
  const removeDiagram = useRemoveDiagram();
  const removeElement = useRemoveElement();
  const updateDiagram = useUpdateDiagram();

  const existingLayers = useMemo(
    () => new Set(modelData.map((m) => m.model.layer)),
    [modelData],
  );

  const onNewModel = useCallback(
    (layer: LayerValue) => {
      createModel.mutate(
        { projectId, layer, name: getLayerInfo(layer).label },
        {
          onSuccess: () => {
            toast.success(`${getLayerInfo(layer).label} model created`);
            onTreeChanged();
          },
          onError: ({ message }) =>
            toast.error(message || "Error creating model"),
        },
      );
    },
    [createModel, projectId, onTreeChanged],
  );

  // دیالوگ ساخت دیاگرام
  const [diagramDialogModel, setDiagramDialogModel] = useState<Model | null>(
    null,
  );
  const [editDiagram, setEditDiagram] = useState<{
    model: Model;
    diagram: Diagram;
  } | null>(null);

  const [transitionModel, setTransitionModel] = useState<Model | null>(null);

  const onOpenDiagram = useCallback(
    (model: Model, diagram: Diagram) => {
      openTab({
        diagramId: diagram.id,
        modelId: model.id,
        name: diagram.name,
        type: diagram.type,
        layer: getDiagramLayer(diagram.type),
      });
    },
    [openTab],
  );

  const onSelectElement = useCallback(
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
            layer: getDiagramLayer(diagram.type),
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

  const onNewElement = useCallback(
    (model: Model, type: ElementTypeValue) => {
      const info = getElementTypeInfo(type);
      createElement.mutate(
        {
          type,
          layer: model.layer,
          modelId: model.id,
          name: `New ${info.label}`,
        },
        {
          onSuccess: () => {
            toast.success(`${info.label} created`);
            onTreeChanged();
          },
          onError: ({ message }) =>
            toast.error(message || "Error creating element"),
        },
      );
    },
    [createElement, onTreeChanged],
  );

  const onDeleteElement = useCallback(
    async (element: ElementTreeNode) => {
      const ok = await confirm({
        tone: "danger",
        title: "Delete element",
        description: `Delete "${element.name}"? This also removes it from any diagram.`,
        confirmText: "Delete",
      });
      if (!ok) return;

      removeElement.mutate(element.id, {
        onSuccess: () => {
          toast.success("Element deleted");
          onTreeChanged();
        },
        onError: ({ message }) =>
          toast.error(message || "Error deleting element"),
      });
    },
    [confirm, removeElement, onTreeChanged],
  );

  const onDeleteDiagram = useCallback(
    async (diagram: Diagram) => {
      const ok = await confirm({
        tone: "danger",
        title: "Delete diagram",
        description: `Delete diagram "${diagram.name}"?`,
        confirmText: "Delete",
      });
      if (!ok) return;

      removeDiagram.mutate(diagram.id, {
        onSuccess: () => {
          closeTab(diagram.id);
          toast.success("Diagram deleted");
          onTreeChanged();
        },
        onError: ({ message }) =>
          toast.error(message || "Error deleting diagram"),
      });
    },
    [confirm, removeDiagram, closeTab, onTreeChanged],
  );

  const onSubmitDiagram = useCallback(
    (values: DiagramFormValues) => {
      if (!diagramDialogModel) return;
      const model = diagramDialogModel;

      createDiagram.mutate(
        {
          name: values.name,
          type: values.type,
          modelId: model.id,
          description: values.description,
        },
        {
          onSuccess: ({ data }) => {
            setDiagramDialogModel(null);
            openTab({
              diagramId: data.id,
              modelId: model.id,
              name: data.name,
              type: data.type,
              layer: getDiagramLayer(data.type),
            });
            toast.success("Diagram created");
            onTreeChanged();
          },
          onError: ({ message }) =>
            toast.error(message || "Error creating diagram"),
        },
      );
    },
    [createDiagram, diagramDialogModel, openTab, onTreeChanged],
  );

  const onSubmitEditDiagram = useCallback(
    (values: DiagramFormValues) => {
      if (!editDiagram) return;
      const { diagram } = editDiagram;

      updateDiagram.mutate(
        {
          id: diagram.id,
          name: values.name,
          description: values.description,
        },
        {
          onSuccess: () => {
            renameTab(diagram.id, values.name);
            setEditDiagram(null);
            toast.success("Diagram updated");
            onTreeChanged();
          },
          onError: ({ message }) =>
            toast.error(message || "Error updating diagram"),
        },
      );
    },
    [updateDiagram, editDiagram, renameTab, onTreeChanged],
  );

  const onAddElementToDiagram = useCallback(
    (element: ElementTreeNode, diagram: Diagram) => {
      const palette = getDiagramPalette(diagram.type);
      if (!palette.elementTypes.includes(element.type)) {
        toast.error(
          `Cannot add "${element.name}" to ${diagram.type} diagram. ` +
            `This diagram type only supports: ${palette.elementTypes.join(", ")}`,
        );
        return;
      }

      // Open the diagram and trigger insert
      openTab({
        diagramId: diagram.id,
        modelId: diagram.modelId,
        name: diagram.name,
        type: diagram.type,
        layer: getDiagramLayer(diagram.type),
      });

      // Find the element data
      for (const { elements } of modelData) {
        const el = elements.find((e) => e.id === element.id);
        if (el) {
          useCanvasStore.getState().requestElementInsert({
            elementId: el.id,
            elementType: el.type,
            name: el.name,
            description: el.description,
            status: el.status,
          });
          toast.success(`Added "${el.name}" to ${diagram.name}`);
          return;
        }
      }
    },
    [modelData, openTab],
  );

  const handlers: ExplorerHandlers = {
    onOpenDiagram,
    onSelectElement,
    onNewElement,
    onDeleteElement,
    onDeleteDiagram,
    onNewDiagram: setDiagramDialogModel,
    onEditDiagram: (model, diagram) => setEditDiagram({ model, diagram }),
    onTransition: setTransitionModel,
    onAddElementToDiagram,
    diagrams: modelData.flatMap((m) => m.diagrams),
  };

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
              disabled={createModel.isPending}
              className="ms-auto flex size-5 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            >
              <Plus className="size-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
          loading={createDiagram.isPending}
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
          loading={updateDiagram.isPending}
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
