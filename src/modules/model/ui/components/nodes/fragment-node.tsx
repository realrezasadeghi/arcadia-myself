"use client";

import {
  NodeResizer,
  type ResizeDragEvent,
  useReactFlow,
  useStore,
} from "@xyflow/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  executionOrderToY,
  LIFELINE_HEADER_WIDTH,
  LIFELINE_SPACING,
  OPERATOR_COLORS,
  ROW_HEIGHT,
} from "../../constants/scenario";
import type { FragmentNodeData } from "../../stores/scenario-canvas";

type FragmentNodeProps = {
  data: FragmentNodeData;
  selected?: boolean;
  id: string;
};

const OPERATOR_LABELS: Record<string, string> = {
  alt: "alt",
  opt: "opt",
  loop: "loop",
  break: "break",
  par: "par",
  critical: "critical",
  assert: "assert",
  neg: "neg",
  ignore: "ignore",
  consider: "consider",
  strict: "strict",
  seq: "seq",
};

export const FRAGMENT_H_PADDING = 40;
export const FRAGMENT_TOP_PAD = 20;

/**
 * FragmentNode — Capella-style Combined Fragment
 *
 * - Dashed border in the operator's color, semi-transparent background
 * - Pentagon operator tag (UML style) in the top-left corner
 * - Real operand separators (one per branch boundary) — draggable vertically
 * - Per-branch guard labels — double-click to edit inline
 * - Horizontal resize persists spanColumns; vertical extent is derived
 *   from the contained messages and stays fixed
 */
export function FragmentNode({ data, selected, id }: FragmentNodeProps) {
  const colors = OPERATOR_COLORS[data.operator] ?? OPERATOR_COLORS.alt;
  const operatorLabel = OPERATOR_LABELS[data.operator] ?? data.operator;
  const { getViewport } = useReactFlow();

  const measuredHeight = useStore(
    (s) => s.nodeLookup.get(id)?.measured?.height ?? 0,
  );

  const operands = [...data.operands].sort((a, b) => a.position - b.position);
  const hasOperands = operands.length > 1;

  const [editingGuardIndex, setEditingGuardIndex] = useState<number | null>(
    null,
  );
  const [editGuard, setEditGuard] = useState("");
  const guardInputRef = useRef<HTMLInputElement>(null);

  const [separatorDrag, setSeparatorDrag] = useState<{
    index: number;
    startY: number;
    offsetY: number;
  } | null>(null);

  const topY = executionOrderToY(data.rowIndex);

  useEffect(() => {
    if (editingGuardIndex !== null) {
      guardInputRef.current?.select();
    }
  }, [editingGuardIndex]);

  const startGuardEdit = useCallback((index: number, currentGuard: string) => {
    setEditGuard(currentGuard);
    setEditingGuardIndex(index);
  }, []);

  const commitGuardEdit = useCallback(() => {
    if (editingGuardIndex === null) return;
    if (!hasOperands) {
      data.onOperandsCommit?.(data.fragmentId, [
        { position: data.rowIndex, guard: editGuard.trim() },
      ]);
    } else {
      const updated = operands.map((op, i) => ({
        position: op.position,
        guard: i === editingGuardIndex ? editGuard.trim() : op.guard,
      }));
      data.onOperandsCommit?.(data.fragmentId, updated);
    }
    setEditingGuardIndex(null);
  }, [editingGuardIndex, operands, editGuard, hasOperands, data]);

  const handleGuardKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        commitGuardEdit();
      } else if (e.key === "Escape") {
        setEditingGuardIndex(null);
      }
    },
    [commitGuardEdit],
  );

  const startSeparatorDrag = useCallback(
    (index: number, e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setSeparatorDrag({ index, startY: e.clientY, offsetY: 0 });
    },
    [],
  );

  useEffect(() => {
    if (!separatorDrag) return;

    const handleMove = (e: MouseEvent) => {
      setSeparatorDrag((prev) =>
        prev ? { ...prev, offsetY: e.clientY - prev.startY } : prev,
      );
    };

    const handleUp = (e: MouseEvent) => {
      setSeparatorDrag((drag) => {
        if (!drag) return null;
        const zoom = getViewport().zoom;
        const deltaOrders = Math.round(
          ((e.clientY - drag.startY) * zoom) / ROW_HEIGHT,
        );
        if (deltaOrders !== 0 && hasOperands) {
          const min = data.rowIndex + 1;
          const moved = operands.map((op, i) => ({
            position:
              i === drag.index
                ? Math.max(min, op.position + deltaOrders)
                : op.position,
            guard: op.guard,
          }));
          data.onOperandsCommit?.(data.fragmentId, moved);
        }
        return null;
      });
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [separatorDrag, hasOperands, operands, data, getViewport]);

  const handleResizeEnd = useCallback(
    (_event: ResizeDragEvent, params: { width: number }) => {
      const spanColumns = Math.max(
        1,
        Math.round(
          (params.width - LIFELINE_HEADER_WIDTH - 2 * FRAGMENT_H_PADDING) /
            LIFELINE_SPACING,
        ) + 1,
      );
      if (spanColumns !== data.spanColumns) {
        data.onPositionCommit?.(
          data.fragmentId,
          data.rowIndex,
          data.columnIndex,
          spanColumns,
        );
      }
    },
    [data],
  );

  const firstGuard = hasOperands ? (operands[0]?.guard ?? "") : data.guard;
  const tagGuard = editingGuardIndex === 0 ? null : firstGuard;

  return (
    <div
      className={`relative w-full h-full rounded-sm border-2 border-dashed transition-shadow ${
        selected ? "ring-2 ring-primary/30 shadow-md" : "hover:shadow-sm"
      }`}
      style={{
        borderColor: colors.borderColor,
        backgroundColor: colors.bg,
      }}
    >
      <NodeResizer
        nodeId={id}
        isVisible={selected}
        minWidth={LIFELINE_HEADER_WIDTH + 2 * FRAGMENT_H_PADDING}
        minHeight={measuredHeight || 80}
        maxHeight={measuredHeight || undefined}
        lineClassName="border-primary"
        handleClassName="bg-primary"
        onResizeEnd={handleResizeEnd}
      />

      {/* Pentagon operator tag — top-left corner (UML style) */}
      <div className="absolute -top-[1px] -left-[1px] z-10">
        <div
          className="relative flex items-center h-[26px] pl-3 pr-5"
          style={{
            backgroundColor: colors.tagBg,
            clipPath:
              "polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)",
          }}
        >
          <span
            className="font-mono text-[11px] font-bold uppercase tracking-wide"
            style={{ color: colors.textColor }}
          >
            {operatorLabel}
          </span>
          {tagGuard !== null && tagGuard !== "" && (
            <span
              className="ml-1.5 text-[10px] font-mono"
              style={{ color: colors.tagText }}
            >
              [{tagGuard}]
            </span>
          )}
          <button
            type="button"
            aria-label="Edit first branch guard"
            className="absolute inset-0 cursor-text opacity-0"
            onClick={() => startGuardEdit(0, firstGuard)}
          />
        </div>
      </div>

      {/* First branch guard editing (under the tag) */}
      {hasOperands && editingGuardIndex === 0 && (
        <input
          ref={guardInputRef}
          value={editGuard}
          onChange={(e) => setEditGuard(e.target.value)}
          onBlur={commitGuardEdit}
          onKeyDown={handleGuardKeyDown}
          className="absolute z-10 left-3 top-[30px] bg-background border border-primary rounded px-1 text-[10px] font-mono w-40"
        />
      )}

      {/* Fragment name (if different from operator) */}
      {data.name && data.name !== operatorLabel && (
        <div className="absolute top-1 left-[100px] flex items-center h-[24px]">
          <span className="text-[10px] font-medium text-muted-foreground/70 truncate max-w-[200px]">
            {data.name}
          </span>
        </div>
      )}

      {/* Operand separators + per-branch guard labels */}
      {hasOperands &&
        operands.slice(1).map((operand, sliceIndex) => {
          const separatorIndex = sliceIndex + 1;
          if (operand.position <= data.rowIndex) return null;

          const separatorY =
            executionOrderToY(operand.position) -
            topY -
            ROW_HEIGHT / 2 +
            (separatorDrag?.index === separatorIndex
              ? separatorDrag.offsetY
              : 0);
          const isDraggingSeparator = separatorDrag?.index === separatorIndex;

          return (
            <div
              key={operand.id}
              className="absolute left-0 right-0"
              style={{ top: separatorY }}
            >
              <div
                className="w-full h-px"
                style={{
                  backgroundColor: `color-mix(in oklab, ${colors.borderColor} 32%, transparent)`,
                }}
              />
              <div
                className="w-full h-px -mt-px"
                style={{
                  borderTop: `1px dashed color-mix(in oklab, ${colors.borderColor} ${isDraggingSeparator ? "85%" : "45%"}, transparent)`,
                }}
              />
              {/* Drag hit area */}
              <div
                className="absolute left-0 right-0 -top-2 h-4 cursor-row-resize"
                onMouseDown={(e) => startSeparatorDrag(separatorIndex, e)}
              />
              {/* Branch guard label (below separator) */}
              {editingGuardIndex === separatorIndex ? (
                <input
                  ref={guardInputRef}
                  value={editGuard}
                  onChange={(e) => setEditGuard(e.target.value)}
                  onBlur={commitGuardEdit}
                  onKeyDown={handleGuardKeyDown}
                  className="absolute left-3 top-1.5 bg-background border border-primary rounded px-1 text-[10px] font-mono w-40 z-10"
                />
              ) : (
                <button
                  type="button"
                  onDoubleClick={() =>
                    startGuardEdit(separatorIndex, operand.guard)
                  }
                  className="absolute left-3 top-1.5 text-[9px] font-mono px-1 rounded cursor-text text-left"
                  style={{
                    color: colors.tagText,
                    backgroundColor: colors.tagBg,
                  }}
                  title="Double-click to edit guard"
                >
                  [{operand.guard || "…"}]
                </button>
              )}
            </div>
          );
        })}

      {/* Loop iteration marker */}
      {data.operator === "loop" && data.guard && (
        <div className="absolute top-7 left-2 text-[9px] font-mono text-muted-foreground/50 italic">
          * {data.guard}
        </div>
      )}
    </div>
  );
}
