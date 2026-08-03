"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/modules/shared/ui/components/ui/context-menu";
import { Copy, Eye, Trash2 } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import { getClassElementTypeInfo } from "../constants/class-diagram";
import type { ClassEdgeData, ClassNodeData } from "../stores/canvas";
import { useCanvasStore } from "../stores/canvas";

type ClassDiagramContextMenuProps = {
  children: React.ReactNode;
};

export function ClassDiagramContextMenu({
  children,
}: ClassDiagramContextMenuProps) {
  const selectedNodeId = useCanvasStore((s) => s.selectedNodeId);
  const selectedEdgeId = useCanvasStore((s) => s.selectedEdgeId);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        {selectedNodeId && <NodeContextMenu nodeId={selectedNodeId} />}
        {selectedEdgeId && <EdgeContextMenu edgeId={selectedEdgeId} />}
        {!selectedNodeId && !selectedEdgeId && <EmptyContextMenu />}
      </ContextMenuContent>
    </ContextMenu>
  );
}

function NodeContextMenu({ nodeId }: { nodeId: string }) {
  const node = useCanvasStore((s) => s.nodes.find((n) => n.id === nodeId));
  const removeElement = useCanvasStore((s) => s.removeNode);
  const selectNode = useCanvasStore((s) => s.selectNode);

  if (!node) return null;

  const data = node.data as ClassNodeData;
  const typeInfo = getClassElementTypeInfo(data.elementType);

  const handleCopyId = useCallback(() => {
    navigator.clipboard.writeText(data.elementId);
    toast.success("Element ID copied");
  }, [data.elementId]);

  const handleDelete = useCallback(() => {
    removeElement(nodeId);
    toast.success(`Deleted "${data.name}"`);
  }, [nodeId, data.name, removeElement]);

  return (
    <>
      <div className="px-2 py-1.5">
        <p className="text-xs font-medium truncate">{data.name}</p>
        <p className="text-[10px] text-muted-foreground">{typeInfo.label}</p>
      </div>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={handleCopyId}>
        <Copy className="mr-2 size-3.5" />
        Copy Element ID
      </ContextMenuItem>
      <ContextMenuItem onClick={() => selectNode(nodeId)}>
        <Eye className="mr-2 size-3.5" />
        Select
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem
        onClick={handleDelete}
        className="text-destructive focus:text-destructive"
      >
        <Trash2 className="mr-2 size-3.5" />
        Delete
      </ContextMenuItem>
    </>
  );
}

function EdgeContextMenu({ edgeId }: { edgeId: string }) {
  const edge = useCanvasStore((s) => s.edges.find((e) => e.id === edgeId));
  const removeEdge = useCanvasStore((s) => s.removeEdge);

  if (!edge) return null;

  const data = edge.data as ClassEdgeData;

  const handleCopyId = useCallback(() => {
    navigator.clipboard.writeText(data.relationshipId);
    toast.success("Relationship ID copied");
  }, [data.relationshipId]);

  const handleDelete = useCallback(() => {
    removeEdge(edgeId);
    toast.success(`Deleted relationship "${data.name}"`);
  }, [edgeId, data.name, removeEdge]);

  return (
    <>
      <div className="px-2 py-1.5">
        <p className="text-xs font-medium truncate">
          {data.name || "Relationship"}
        </p>
        <p className="text-[10px] text-muted-foreground">
          {data.relationshipType}
        </p>
      </div>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={handleCopyId}>
        <Copy className="mr-2 size-3.5" />
        Copy Relationship ID
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem
        onClick={handleDelete}
        className="text-destructive focus:text-destructive"
      >
        <Trash2 className="mr-2 size-3.5" />
        Delete
      </ContextMenuItem>
    </>
  );
}

function EmptyContextMenu() {
  return (
    <div className="px-2 py-1.5">
      <p className="text-xs text-muted-foreground">
        Right-click on an element or relationship for options
      </p>
    </div>
  );
}
