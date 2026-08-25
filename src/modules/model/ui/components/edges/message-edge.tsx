"use client";

import { useQueryClient } from "@tanstack/react-query";
import { EdgeLabelRenderer, type EdgeProps, useReactFlow } from "@xyflow/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getMessagesByScenarioIdKey } from "../../clients/get-messages-by-scenario-id";
import { useUpdateMessage } from "../../clients/update-message";
import {
  executionOrderToY,
  LIFELINE_HEADER_WIDTH,
  MESSAGE_CONFIG,
  ROW_HEIGHT,
} from "../../constants/scenario";
import type { MessageEdgeData } from "../../stores/scenario-canvas";
import { useScenarioSelectionStore } from "../../stores/scenario-selection";

/**
 * MessageEdge — Capella-style sequence message
 *
 * - Solid arrow + filled arrowhead for synchronous calls (CALL, CREATE)
 * - CREATE terminates at the target lifeline's header box edge
 * - Dashed arrow + open arrowhead for returns (RETURN, REPLY)
 * - DELETE: solid arrow ending in a black X (destruction marker)
 * - FOUND: black filled circle at source
 * - LOST: black filled circle at target
 * - Label positioned ABOVE the arrow with hierarchical sequence number
 * - Drag to reorder (vertical only) — swaps with the occupant of the row
 * - Double-click to rename
 */
export function MessageEdge({ sourceX, targetX, data, selected }: EdgeProps) {
  const edgeData = data as MessageEdgeData;
  const kind = edgeData?.kind ?? "CALL";
  const config = MESSAGE_CONFIG[kind] ?? MESSAGE_CONFIG.CALL;
  const executionOrder = edgeData?.executionOrder ?? 0;
  const isDelete = kind === "DELETE";
  const isCreate = kind === "CREATE";
  const isFound = kind === "FOUND";
  const isLost = kind === "LOST";
  const isSelfMessage = Math.abs(sourceX - targetX) < 1;

  const handleY = executionOrderToY(executionOrder);

  const strokeColor = selected ? "var(--primary)" : config.color;
  const labelBg = selected ? "bg-primary/10" : "bg-background/90";

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(edgeData?.name ?? "");
  const inputRef = useRef<HTMLInputElement>(null);
  const updateMessage = useUpdateMessage();
  const queryClient = useQueryClient();
  const { getViewport } = useReactFlow();
  const isRenaming = useScenarioSelectionStore((s) => s.isRenaming);
  const setRenaming = useScenarioSelectionStore((s) => s.setRenaming);

  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const dragStartOrder = useRef(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.select();
    }
  }, [isEditing]);

  // Context-menu rename: open the inline editor when requested.
  useEffect(() => {
    if (isRenaming && selected) {
      setEditName(edgeData?.name ?? "");
      setIsEditing(true);
      setRenaming(false);
    }
  }, [isRenaming, selected, edgeData?.name, setRenaming]);

  const handleDoubleClick = useCallback(() => {
    setEditName(edgeData?.name ?? "");
    setIsEditing(true);
  }, [edgeData?.name]);

  const handleBlur = useCallback(() => {
    if (editName.trim() && editName !== edgeData?.name && edgeData?.messageId) {
      updateMessage.mutate(
        { id: edgeData.messageId, name: editName.trim() },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: getMessagesByScenarioIdKey(edgeData.scenarioId),
            });
          },
        },
      );
    }
    setIsEditing(false);
  }, [
    editName,
    edgeData?.name,
    edgeData?.messageId,
    edgeData?.scenarioId,
    updateMessage,
    queryClient,
  ]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleBlur();
      } else if (e.key === "Escape") {
        setEditName(edgeData?.name ?? "");
        setIsEditing(false);
      }
    },
    [edgeData?.name, handleBlur],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isEditing) return;
      e.stopPropagation();
      e.preventDefault();
      setIsDragging(true);
      dragStartY.current = e.clientY;
      dragStartOrder.current = executionOrder;
      setDragOffsetY(0);
    },
    [isEditing, executionOrder],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const viewport = getViewport();
      const deltaY = (e.clientY - dragStartY.current) * viewport.zoom;
      setDragOffsetY(deltaY);
    },
    [isDragging, getViewport],
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const viewport = getViewport();
      const deltaY = (e.clientY - dragStartY.current) * viewport.zoom;
      const newOrder = Math.max(
        0,
        dragStartOrder.current + Math.round(deltaY / ROW_HEIGHT),
      );

      // Persist via the canvas callback (handles swap with row occupant)
      if (newOrder !== dragStartOrder.current && edgeData?.messageId) {
        edgeData.onMoveToOrder?.(edgeData.messageId, newOrder);
      }

      setIsDragging(false);
      setDragOffsetY(0);
    },
    [isDragging, edgeData, getViewport],
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const currentY = handleY + (isDragging ? dragOffsetY : 0);

  const midpointX = (sourceX + targetX) / 2;
  const isRightward = targetX >= sourceX;

  const arrowSize = 10;
  const padding = 4;

  // CREATE arrows terminate at the target lifeline's header box edge.
  const createGap = LIFELINE_HEADER_WIDTH / 2 + 4;
  const createLineEndX = isRightward
    ? targetX - createGap
    : targetX + createGap;

  const lineEndX = isCreate ? createLineEndX : targetX;

  const arrowTipX = isRightward ? lineEndX - padding : lineEndX + padding;
  const arrowBaseX = isRightward
    ? lineEndX - arrowSize - padding
    : lineEndX + arrowSize + padding;

  const deleteXSize = 6;
  const deleteLineEndX = isRightward
    ? targetX - deleteXSize
    : targetX + deleteXSize;

  return (
    <>
      {/* Self-message loop */}
      {isSelfMessage && (
        <>
          <path
            d={`M ${sourceX},${currentY} L ${sourceX + 44},${currentY} L ${sourceX + 44},${currentY + 24} L ${sourceX - 2},${currentY + 24}`}
            fill="none"
            style={{ stroke: strokeColor }}
            strokeWidth={config.strokeWidth}
            strokeDasharray={config.dashed ? "6,4" : undefined}
            className="pointer-events-none"
          />
          {/* Invisible hit area for self-message */}
          <rect
            x={sourceX - 4}
            y={currentY - 7}
            width={50}
            height={38}
            fill="transparent"
            className="cursor-grab"
            onMouseDown={handleMouseDown}
          />
          {/* Arrowhead pointing left */}
          {config.openArrow ? (
            <>
              <line
                x1={sourceX + 8}
                y1={currentY + 24 - arrowSize / 2}
                x2={sourceX - 2}
                y2={currentY + 24}
                style={{ stroke: strokeColor }}
                strokeWidth={config.strokeWidth}
                className="pointer-events-none"
              />
              <line
                x1={sourceX + 8}
                y1={currentY + 24 + arrowSize / 2}
                x2={sourceX - 2}
                y2={currentY + 24}
                style={{ stroke: strokeColor }}
                strokeWidth={config.strokeWidth}
                className="pointer-events-none"
              />
            </>
          ) : (
            <polygon
              points={`${sourceX + 8},${currentY + 24 - arrowSize / 2} ${sourceX - 2},${currentY + 24} ${sourceX + 8},${currentY + 24 + arrowSize / 2}`}
              style={{ fill: strokeColor }}
              className="pointer-events-none"
            />
          )}
        </>
      )}

      {/* Main message line */}
      {!isFound && !isLost && !isSelfMessage && (
        <>
          <line
            x1={sourceX}
            y1={currentY}
            x2={isDelete ? deleteLineEndX : lineEndX}
            y2={currentY}
            style={{ stroke: strokeColor }}
            strokeWidth={config.strokeWidth}
            strokeDasharray={config.dashed ? "6,4" : undefined}
            className="pointer-events-none"
          />
          {/* Invisible hit area for drag */}
          <line
            x1={sourceX}
            y1={currentY}
            x2={isDelete ? deleteLineEndX : lineEndX}
            y2={currentY}
            stroke="transparent"
            strokeWidth={14}
            className="cursor-grab"
            onMouseDown={handleMouseDown}
          />
        </>
      )}

      {/* FOUND message: black filled circle at source */}
      {isFound && (
        <>
          <circle
            cx={sourceX}
            cy={currentY}
            r={5}
            style={{ fill: "var(--canvas-ink)" }}
            className="pointer-events-none"
          />
          <line
            x1={sourceX + 6}
            y1={currentY}
            x2={targetX}
            y2={currentY}
            style={{ stroke: strokeColor }}
            strokeWidth={config.strokeWidth}
            className="pointer-events-none"
          />
          <line
            x1={sourceX + 6}
            y1={currentY}
            x2={targetX}
            y2={currentY}
            stroke="transparent"
            strokeWidth={14}
            className="cursor-grab"
            onMouseDown={handleMouseDown}
          />
        </>
      )}

      {/* LOST message: arrow from source to black filled circle at target */}
      {isLost && (
        <>
          <line
            x1={sourceX}
            y1={currentY}
            x2={targetX - 6}
            y2={currentY}
            style={{ stroke: strokeColor }}
            strokeWidth={config.strokeWidth}
            className="pointer-events-none"
          />
          <circle
            cx={targetX}
            cy={currentY}
            r={5}
            style={{ fill: "var(--canvas-ink)" }}
            className="pointer-events-none"
          />
          <line
            x1={sourceX}
            y1={currentY}
            x2={targetX - 6}
            y2={currentY}
            stroke="transparent"
            strokeWidth={14}
            className="cursor-grab"
            onMouseDown={handleMouseDown}
          />
        </>
      )}

      {/* Arrowhead — filled for calls, open for returns */}
      {!isDelete &&
        !isSelfMessage &&
        !isFound &&
        !isLost &&
        config.openArrow && (
          <>
            <line
              x1={arrowBaseX}
              y1={currentY - arrowSize / 2}
              x2={arrowTipX}
              y2={currentY}
              style={{ stroke: strokeColor }}
              strokeWidth={config.strokeWidth}
              className="pointer-events-none"
            />
            <line
              x1={arrowBaseX}
              y1={currentY + arrowSize / 2}
              x2={arrowTipX}
              y2={currentY}
              style={{ stroke: strokeColor }}
              strokeWidth={config.strokeWidth}
              className="pointer-events-none"
            />
          </>
        )}

      {!isDelete &&
        !isSelfMessage &&
        !isFound &&
        !isLost &&
        !config.openArrow && (
          <polygon
            points={`${arrowBaseX},${currentY - arrowSize / 2} ${arrowTipX},${currentY} ${arrowBaseX},${currentY + arrowSize / 2}`}
            style={{ fill: strokeColor }}
            className="pointer-events-none"
          />
        )}

      {/* FOUND: filled arrowhead at target side */}
      {isFound && (
        <polygon
          points={`${arrowBaseX},${currentY - arrowSize / 2} ${arrowTipX},${currentY} ${arrowBaseX},${currentY + arrowSize / 2}`}
          style={{ fill: strokeColor }}
          className="pointer-events-none"
        />
      )}

      {/* Delete marker: black X at target */}
      {isDelete && !isFound && !isLost && (
        <>
          <line
            x1={targetX - deleteXSize}
            y1={currentY - deleteXSize}
            x2={targetX + deleteXSize}
            y2={currentY + deleteXSize}
            style={{ stroke: "var(--canvas-ink)" }}
            strokeWidth={2.5}
            strokeLinecap="round"
            className="pointer-events-none"
          />
          <line
            x1={targetX + deleteXSize}
            y1={currentY - deleteXSize}
            x2={targetX - deleteXSize}
            y2={currentY + deleteXSize}
            style={{ stroke: "var(--canvas-ink)" }}
            strokeWidth={2.5}
            strokeLinecap="round"
            className="pointer-events-none"
          />
        </>
      )}

      {/* Selection highlight */}
      {selected && !isSelfMessage && (
        <line
          x1={sourceX}
          y1={currentY}
          x2={targetX}
          y2={currentY}
          stroke="transparent"
          strokeWidth={12}
          className="pointer-events-none"
          style={{ filter: "blur(4px)" }}
        />
      )}

      {/* Label — placed ABOVE the arrow */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: isSelfMessage
              ? `translate(0, -100%) translate(${sourceX + 48}px,${currentY - 12}px)`
              : `translate(-50%, -100%) translate(${midpointX}px,${currentY - 12}px)`,
            pointerEvents: "all",
          }}
          className={`flex items-center gap-1.5 select-none whitespace-nowrap rounded px-1.5 py-0.5 ${
            isDragging ? "cursor-grabbing opacity-80" : "cursor-grab"
          } ${labelBg} ${selected ? "ring-1 ring-primary/30" : ""}`}
          onDoubleClick={handleDoubleClick}
          onMouseDown={handleMouseDown}
        >
          {/* Hierarchical sequence number */}
          <span
            className="text-[10px] font-mono font-bold"
            style={{ color: strokeColor }}
          >
            {edgeData?.numberLabel ?? executionOrder + 1}:
          </span>

          {/* Editable name */}
          {isEditing ? (
            <input
              ref={inputRef}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="bg-transparent outline-none border-b border-primary min-w-[60px] text-xs"
            />
          ) : (
            <span
              className="text-xs font-medium"
              style={{ color: strokeColor }}
            >
              {edgeData?.name}
            </span>
          )}

          {/* Return type indicator */}
          {config.openArrow && (
            <span className="text-[9px] text-muted-foreground font-normal italic">
              return
            </span>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
