"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  Handle,
  type Node,
  type NodeProps,
  NodeResizer,
  Position,
} from "@xyflow/react";
import { memo, useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/modules/shared/ui/libs/cn";
import { getClassDiagramByIdKey } from "../../../clients/get-class-diagram-by-id";
import { useUpdateClassElement } from "../../../clients/update-class-element";
import { getClassElementTypeInfo } from "../../../constants/class-diagram";
import { useCanvasStore } from "../../../stores/canvas";
import type { ClassNodeData } from "../../../stores/class-canvas";

type PackageNodeType = Node<ClassNodeData>;

/**
 * PackageNode — UML folder-tab container.
 *
 * The entire node is ONE border. The tab is drawn inside the top-left
 * using an absolutely-positioned div whose bottom border merges with
 * the body border, creating the classic UML package silhouette.
 *
 *   ┌── «package» Name ─────────────────┐
 *   │                                     │
 *   │        children render here         │
 *   │                                     │
 *   └─────────────────────────────────────┘
 */
function PackageNodeComponent({ data, selected }: NodeProps<PackageNodeType>) {
  const typeInfo = getClassElementTypeInfo(data.elementType);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(data.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);
  const diagramId = useCanvasStore((s) => s.diagramId);
  const updateClassElement = useUpdateClassElement();
  const queryClient = useQueryClient();

  const handleDoubleClickName = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setEditName(data.name);
      setIsEditingName(true);
      setTimeout(() => inputRef.current?.select(), 10);
    },
    [data.name],
  );

  const handleSaveName = useCallback(() => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== data.name) {
      updateClassElement.mutate(
        { id: data.elementId, modelId: data.modelId, name: trimmed },
        {
          onSuccess: () => {
            updateNodeData(data.elementId, { ...data, name: trimmed });
            queryClient.invalidateQueries({
              queryKey: ["class-elements", data.modelId],
            });
            if (diagramId) {
              queryClient.invalidateQueries({
                queryKey: getClassDiagramByIdKey(diagramId),
              });
            }
          },
          onError: ({ message }: { message: string }) => {
            toast.error(message || "Failed to rename package");
          },
        },
      );
    }
    setIsEditingName(false);
  }, [
    editName,
    data,
    updateNodeData,
    updateClassElement,
    queryClient,
    diagramId,
  ]);

  return (
    <div
      className={cn(
        "relative h-full w-full select-none rounded-md",
        data.status === "DEPRECATED" && "opacity-60",
      )}
    >
      {/* ── Single outer border wrapping everything ── */}
      <div
        className="absolute inset-0 rounded-md border-2 bg-background/50"
        style={{ borderColor: typeInfo.color }}
      />

      {/* ── Folder tab — bleeds above the top border ── */}
      <div
        className={cn(
          "absolute z-10 flex items-center max-w-fit",
          "-top-7 left-[50%] -translate-x-1/2",
          "rounded-t-md border-2 border-b-0 px-3 h-7",
          "bg-background",
          selected && "ring-2 ring-primary ring-offset-1",
        )}
        style={{ borderColor: typeInfo.color }}
      >
        {isEditingName ? (
          <input
            ref={inputRef}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSaveName}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveName();
              if (e.key === "Escape") setIsEditingName(false);
            }}
            className="w-24 bg-transparent text-[11px] font-semibold outline-none border-b border-current"
            style={{ color: typeInfo.color }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span
            className="text-[11px] font-semibold cursor-text select-none whitespace-nowrap leading-none"
            style={{ color: typeInfo.color }}
            onDoubleClick={handleDoubleClickName}
          >
            <span className="text-muted-foreground/60 mr-1.5">«package»</span>
            {data.name}
          </span>
        )}
      </div>

      {/* ── Separator line inside body, just below the tab ── */}
      <div
        className="absolute left-0 right-0 h-px z-10"
        style={{
          top: "1px",
          backgroundColor: typeInfo.color,
        }}
      />

      {/* ── NodeResizer (only visible when selected) ── */}
      <NodeResizer
        isVisible={selected}
        minWidth={200}
        minHeight={160}
        lineClassName="border-primary/50"
        handleClassName="bg-primary"
      />

      {/* ── Connection Handles ── */}
      <Handle
        type="target"
        position={Position.Top}
        className="size-2! border! border-current! bg-background!"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="size-2! border! border-current! bg-background!"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="size-2! border! border-current! bg-background!"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="size-2! border! border-current! bg-background!"
      />
    </div>
  );
}

export const PackageNode = memo(PackageNodeComponent);
