"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Handle, Position } from "@xyflow/react";
import {
  Box,
  Component,
  ExternalLink,
  FunctionSquare,
  User,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getLifelinesByScenarioIdKey } from "../../clients/get-lifelines-by-scenario-id";
import { useUpdateLifeline } from "../../clients/update-lifeline";
import {
  DEFAULT_LIFELINE_CONFIG,
  executionOrderToY,
  HANDLE_COUNT,
  LIFELINE_HEADER_WIDTH,
  LIFELINE_TYPE_CONFIG,
} from "../../constants/scenario";
import type { LifelineNodeData } from "../../stores/scenario-canvas";
import { useScenarioSelectionStore } from "../../stores/scenario-selection";

type LifelineNodeProps = {
  data: LifelineNodeData;
  selected?: boolean;
};

const ICON_MAP: Record<string, typeof User> = {
  ACTOR: User,
  FUNCTION: FunctionSquare,
  COMPONENT: Component,
  CLASS_ELEMENT: Box,
  EXTERNAL: ExternalLink,
};

function getHandleIds(): string[] {
  return Array.from({ length: HANDLE_COUNT }, (_, i) => `h-${i}`);
}

export function LifelineNode({ data, selected }: LifelineNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(data.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateLifeline = useUpdateLifeline();
  const queryClient = useQueryClient();
  const isRenaming = useScenarioSelectionStore((s) => s.isRenaming);
  const setRenaming = useScenarioSelectionStore((s) => s.setRenaming);

  const config =
    LIFELINE_TYPE_CONFIG[data.representedElementType] ??
    DEFAULT_LIFELINE_CONFIG;
  const Icon = ICON_MAP[data.representedElementType] ?? Component;

  const handleIds = getHandleIds();
  const totalHeight = data.canopyHeight ?? 600;

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.select();
    }
  }, [isEditing]);

  // Context-menu rename: open the inline editor when requested.
  useEffect(() => {
    if (isRenaming && selected) {
      setEditName(data.name);
      setIsEditing(true);
      setRenaming(false);
    }
  }, [isRenaming, selected, data.name, setRenaming]);

  const handleDoubleClick = useCallback(() => {
    setEditName(data.name);
    setIsEditing(true);
  }, [data.name]);

  const handleBlur = useCallback(() => {
    if (editName.trim() && editName !== data.name) {
      updateLifeline.mutate(
        {
          id: data.lifelineId,
          name: editName.trim(),
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: getLifelinesByScenarioIdKey(data.scenarioId),
            });
          },
        },
      );
    }
    setIsEditing(false);
  }, [
    editName,
    data.name,
    data.lifelineId,
    data.scenarioId,
    updateLifeline,
    queryClient,
  ]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleBlur();
      } else if (e.key === "Escape") {
        setEditName(data.name);
        setIsEditing(false);
      }
    },
    [data.name, handleBlur],
  );

  return (
    <div
      className="flex flex-col items-center"
      style={{ width: LIFELINE_HEADER_WIDTH }}
    >
      {/* Header box — Capella style */}
      <div
        className={`
          w-full rounded-md border shadow-sm
          px-3 py-2 text-center cursor-pointer select-none relative z-10
          transition-all duration-150
          ${selected ? "ring-2 ring-primary/40 shadow-md" : "hover:shadow-md"}
          ${config.headerBg} ${config.headerBorder}
        `}
        onDoubleClick={handleDoubleClick}
      >
        {/* Stereotype */}
        <div className="text-[9px] font-mono text-muted-foreground/70 tracking-wider mb-0.5 uppercase">
          &laquo;{config.stereotype}&raquo;
        </div>

        {/* Icon + Name */}
        <div className="flex items-center justify-center gap-1.5">
          <Icon
            className="size-3.5 shrink-0"
            style={{ color: config.lineColor }}
          />
          {isEditing ? (
            <input
              ref={inputRef}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-center text-xs font-medium outline-none border-b border-primary"
            />
          ) : (
            <span className="text-xs font-semibold truncate">{data.name}</span>
          )}
        </div>
      </div>

      {/* Dashed vertical lifeline */}
      <div className="relative w-full" style={{ height: totalHeight }}>
        {/* Vertical lifeline line — stops at destruction X if present */}
        <div
          className="absolute left-1/2"
          style={{
            top: 8,
            width: 0,
            height:
              data.destroyedByExecutionOrder !== undefined
                ? executionOrderToY(data.destroyedByExecutionOrder) - 8
                : `calc(100% - 8px)`,
            borderLeft: `1.5px dashed color-mix(in oklab, ${config.lineColor} 45%, transparent)`,
            transform: "translateX(-0.5px)",
          }}
        />

        {/* Destruction marker: X at the destruction message Y */}
        {data.destroyedByExecutionOrder !== undefined ? (
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: executionOrderToY(data.destroyedByExecutionOrder) - 6,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              className="block"
              aria-hidden="true"
            >
              <line
                x1="1"
                y1="1"
                x2="13"
                y2="13"
                style={{ stroke: "var(--canvas-ink)" }}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="13"
                y1="1"
                x2="1"
                y2="13"
                style={{ stroke: "var(--canvas-ink)" }}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        ) : (
          /* End-of-life circle at bottom */
          <div
            className="absolute left-1/2 bottom-2 -translate-x-1/2 size-2 rounded-full"
            style={{
              backgroundColor: `color-mix(in oklab, ${config.lineColor} 55%, transparent)`,
            }}
          />
        )}

        {/* Hidden handles for message connections */}
        {handleIds.map((handleId, index) => {
          const order = index;
          const yPos = executionOrderToY(order);
          return (
            <Handle
              key={`source-${handleId}`}
              id={handleId}
              type="source"
              position={Position.Right}
              className="!w-3 !h-3 !rounded-full opacity-0 !border-0 !bg-transparent"
              style={{
                top: yPos,
                left: LIFELINE_HEADER_WIDTH / 2,
                transform: "translate(-50%, -50%)",
              }}
            />
          );
        })}

        {handleIds.map((handleId, index) => {
          const order = index;
          const yPos = executionOrderToY(order);
          return (
            <Handle
              key={`target-${handleId}`}
              id={handleId}
              type="target"
              position={Position.Left}
              className="!w-3 !h-3 !rounded-full opacity-0 !border-0 !bg-transparent"
              style={{
                top: yPos,
                left: LIFELINE_HEADER_WIDTH / 2,
                transform: "translate(-50%, -50%)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
