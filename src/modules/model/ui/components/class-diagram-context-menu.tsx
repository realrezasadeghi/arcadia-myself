"use client";

import { Copy, Eye, FolderOpen, Loader2, Package, Trash2 } from "lucide-react";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/modules/shared/ui/components/ui/context-menu";
import { getClassElementTypeInfo } from "../constants/class-diagram";
import { useMoveToPackage } from "../hooks/use-move-to-package";
import { useRemoveElementSync } from "../hooks/use-remove-element";
import { useRemoveRelationshipSync } from "../hooks/use-remove-relationship";
import type { ClassNodeData } from "../stores/canvas";
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
  const { removeElement, isPending } = useRemoveElementSync();
  const selectNode = useCanvasStore((s) => s.selectNode);
  const { moveToPackage, isPending: isMoving } = useMoveToPackage();

  // Get all Package nodes in the canvas (excluding current node)
  const packages = useMemo(() => {
    const currentNodes = useCanvasStore.getState().nodes;
    return currentNodes.filter(
      (n) =>
        n.id !== nodeId && (n.data as ClassNodeData).elementType === "PACKAGE",
    );
  }, [nodeId]);

  const handleDelete = useCallback(() => {
    removeElement(nodeId);
  }, [nodeId, removeElement]);

  if (!node) return null;

  const data = node.data as ClassNodeData;
  const currentParentId = (data as any).parentId as string | null;

  const handleCopyId = useCallback(() => {
    navigator.clipboard.writeText(data.elementId);
    toast.success("Element ID copied");
  }, [data.elementId]);

  const handleMoveToPackage = useCallback(
    (packageId: string | null, packageName?: string) => {
      moveToPackage(data.elementId, data.modelId, packageId, packageName);
    },
    [data.elementId, data.modelId, moveToPackage],
  );

  const typeInfo = getClassElementTypeInfo(data.elementType);

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

      {/* Move to Package submenu */}
      {data.elementType !== "PACKAGE" && packages.length > 0 && (
        <>
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <FolderOpen className="mr-2 size-3.5" />
              Move to Package
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              {currentParentId && (
                <ContextMenuItem
                  onClick={() => handleMoveToPackage(null)}
                  disabled={isMoving}
                >
                  <Package className="mr-2 size-3.5 opacity-50" />
                  <span className="text-muted-foreground">Ungroup</span>
                </ContextMenuItem>
              )}
              {packages.map((pkg) => {
                const pkgData = pkg.data as ClassNodeData;
                const isCurrentParent = pkg.id === currentParentId;
                return (
                  <ContextMenuItem
                    key={pkg.id}
                    onClick={() => handleMoveToPackage(pkg.id, pkgData.name)}
                    disabled={isMoving || isCurrentParent}
                  >
                    <Package className="mr-2 size-3.5" />
                    <span className={isCurrentParent ? "font-medium" : ""}>
                      {pkgData.name}
                      {isCurrentParent && " (current)"}
                    </span>
                  </ContextMenuItem>
                );
              })}
            </ContextMenuSubContent>
          </ContextMenuSub>
        </>
      )}

      <ContextMenuSeparator />
      <ContextMenuItem
        onClick={handleDelete}
        disabled={isPending}
        className="text-destructive focus:text-destructive"
      >
        {isPending ? (
          <Loader2 className="mr-2 size-3.5 animate-spin" />
        ) : (
          <Trash2 className="mr-2 size-3.5" />
        )}
        Delete
      </ContextMenuItem>
    </>
  );
}

function EdgeContextMenu({ edgeId }: { edgeId: string }) {
  const edge = useCanvasStore((s) => s.edges.find((e) => e.id === edgeId));
  const { removeRelationship, isPending } = useRemoveRelationshipSync();

  if (!edge) return null;

  const data = edge.data as import("../stores/canvas").ClassEdgeData;

  const handleCopyId = useCallback(() => {
    navigator.clipboard.writeText(data.relationshipId);
    toast.success("Relationship ID copied");
  }, [data.relationshipId]);

  const handleDelete = useCallback(() => {
    removeRelationship(edgeId);
  }, [edgeId, removeRelationship]);

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
        disabled={isPending}
        className="text-destructive focus:text-destructive"
      >
        {isPending ? (
          <Loader2 className="mr-2 size-3.5 animate-spin" />
        ) : (
          <Trash2 className="mr-2 size-3.5" />
        )}
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
