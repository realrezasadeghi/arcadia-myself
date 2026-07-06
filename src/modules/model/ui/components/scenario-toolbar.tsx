"use client";

import { cn } from "@/modules/shared/ui/libs/cn";
import {
  AlertTriangle,
  ArrowDownToLine,
  GitBranchPlus,
  LayoutDashboard,
  Pencil,
  Redo2,
  Trash2,
  Undo2,
} from "lucide-react";
import { useWorkbenchStore } from "../stores/workbench";
import { useScenarioCanvasStore } from "../stores/scenario-canvas";
import { getDiagramTypeInfo } from "../helpers/diagram";
import { useDeleteScenarioLifeline } from "../clients/delete-scenario-lifeline";
import { useDeleteScenarioMessage } from "../clients/delete-scenario-message";
import { useDeleteScenarioFragment } from "../clients/delete-scenario-fragment";
import { useUpdateScenarioLayout } from "../clients/update-scenario-layout";
import { useConfirm } from "@/modules/shared/ui/hooks/use-confirm";
import { toast } from "sonner";

export function ScenarioToolbar() {
  const activeDiagramId = useWorkbenchStore((s) => s.activeDiagramId);
  const tabs = useWorkbenchStore((s) => s.tabs);
  const activeTab = tabs.find((t) => t.diagramId === activeDiagramId);

  const {
    selectedNodeId,
    selectedEdgeId,
    undo,
    redo,
    nodes,
    edges,
    diagramId,
  } = useScenarioCanvasStore();

  const deleteLifeline = useDeleteScenarioLifeline();
  const deleteMessage = useDeleteScenarioMessage();
  const deleteFragment = useDeleteScenarioFragment();
  const updateLayout = useUpdateScenarioLayout();
  const confirm = useConfirm();

  const diagramInfo = activeTab ? getDiagramTypeInfo(activeTab.type) : null;

  const handleDeleteSelected = async () => {
    if (selectedNodeId) {
      const node = nodes.find((n) => n.id === selectedNodeId);
      if (!node) return;

      const ok = await confirm({
        tone: "danger",
        title: "Delete element",
        description: `Delete this ${node.type === "lifeline" ? "lifeline" : "fragment"}?`,
        confirmText: "Delete",
      });
      if (!ok) return;

      if (node.type === "lifeline") {
        deleteLifeline.mutate({ lifelineId: node.id });
      } else if (node.type === "fragment") {
        deleteFragment.mutate({ fragmentId: node.id });
      }
    } else if (selectedEdgeId) {
      const edge = edges.find((e) => e.id === selectedEdgeId);
      if (!edge) return;

      const ok = await confirm({
        tone: "danger",
        title: "Delete message",
        description: "Delete this message?",
        confirmText: "Delete",
      });
      if (!ok) return;

      deleteMessage.mutate({ messageId: edge.id });
    }
  };

  const handleSaveLayout = () => {
    if (!diagramId) return;

    const lifelinePositions = nodes
      .filter((n) => n.type === "lifeline")
      .map((n) => ({
        id: n.id,
        position: n.position,
        size: { width: n.width ?? 120, height: n.height ?? 600 },
      }));

    const fragmentPositions = nodes
      .filter((n) => n.type === "fragment")
      .map((n) => ({
        id: n.id,
        position: n.position,
        size: { width: n.width ?? 300, height: n.height ?? 200 },
      }));

    updateLayout.mutate(
      {
        diagramId,
        lifelinePositions,
        fragmentPositions,
      },
      {
        onSuccess: () => {
          toast.success("Layout saved");
        },
      },
    );
  };

  if (!activeTab) return null;

  return (
    <div className="flex h-8 shrink-0 items-center gap-1 border-b bg-muted/30 px-2">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <LayoutDashboard className="size-3" />
        <span className="font-medium text-foreground">{activeTab.name}</span>
        <span className="text-[10px] uppercase">{activeTab.type}</span>
      </div>

      <div className="w-px h-4 bg-border mx-2" />

      {/* Undo/Redo */}
      <ToolbarButton
        icon={Undo2}
        label="Undo"
        onClick={undo}
      />
      <ToolbarButton
        icon={Redo2}
        label="Redo"
        onClick={redo}
      />

      <div className="w-px h-4 bg-border mx-2" />

      {/* Delete */}
      <ToolbarButton
        icon={Trash2}
        label="Delete Selected"
        onClick={handleDeleteSelected}
        disabled={!selectedNodeId && !selectedEdgeId}
        variant="danger"
      />

      <div className="w-px h-4 bg-border mx-2" />

      {/* Save Layout */}
      <ToolbarButton
        icon={ArrowDownToLine}
        label="Save Layout"
        onClick={handleSaveLayout}
      />

      {/* Diagram info */}
      {diagramInfo && (
        <div className="ms-auto text-[10px] text-muted-foreground">
          {diagramInfo.label}
        </div>
      )}
    </div>
  );
}

function ToolbarButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  variant,
}: {
  icon: typeof Trash2;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={cn(
        "flex size-6 items-center justify-center rounded-md transition-colors",
        disabled
          ? "text-muted-foreground/40 cursor-not-allowed"
          : variant === "danger"
            ? "text-destructive hover:bg-destructive/10"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="size-3.5" />
    </button>
  );
}
