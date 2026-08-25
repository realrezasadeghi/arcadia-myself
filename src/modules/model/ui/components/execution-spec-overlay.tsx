"use client";

import { useStore } from "@xyflow/react";
import { useMemo } from "react";
import {
  EXECUTION_SPEC_NESTED_OFFSET,
  EXECUTION_SPEC_WIDTH,
  LIFELINE_AXIS_X,
  LIFELINE_SPACING,
} from "../constants/scenario";
import {
  computeExecutionSpecs,
  executionSpecGeometry,
} from "../lib/execution-specs";

type LifelineData = {
  id: string;
  columnIndex: number;
  representedElementType: string;
};

type MessageData = {
  sourceLifelineId: string;
  targetLifelineId: string;
  kind: string;
  executionOrder: number;
};

type ExecutionSpecOverlayProps = {
  lifelines: LifelineData[];
  messages: MessageData[];
};

/**
 * ExecutionSpecOverlay — Capella-style execution specification bars.
 *
 * Activations are auto-derived from the message sequence (UML semantics):
 * a bar opens when a lifeline receives a request and closes when it sends
 * the reply; a synchronous caller's bar spans until the reply arrives.
 * Nested activations are offset horizontally.
 *
 * Rendered inside <ReactFlow> (outside the transformed viewport), so the
 * viewport transform is applied manually — subscribed reactively via the
 * store so bars track pan/zoom.
 */
export function ExecutionSpecOverlay({
  lifelines,
  messages,
}: ExecutionSpecOverlayProps) {
  const transform = useStore((s) => s.transform);

  const specs = useMemo(() => {
    const sorted = [...lifelines].sort((a, b) => a.columnIndex - b.columnIndex);
    const columnIndexById = new Map(sorted.map((l, i) => [l.id, i]));
    const intervals = computeExecutionSpecs(sorted, messages);

    return intervals.flatMap((interval) => {
      const columnIndex = columnIndexById.get(interval.lifelineId);
      if (columnIndex === undefined) return [];
      const { top, height } = executionSpecGeometry(
        interval.startOrder,
        interval.endOrder,
      );
      const x =
        LIFELINE_AXIS_X +
        columnIndex * LIFELINE_SPACING -
        EXECUTION_SPEC_WIDTH / 2 +
        interval.depth * EXECUTION_SPEC_NESTED_OFFSET;
      return [
        {
          key: `${interval.lifelineId}-${interval.startOrder}-${interval.depth}`,
          x,
          top,
          width: EXECUTION_SPEC_WIDTH,
          height,
        },
      ];
    });
  }, [lifelines, messages]);

  const [tx, ty, zoom] = transform;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        style={{
          transform: `translate(${tx}px, ${ty}px) scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {specs.map((spec) => (
          <div
            key={spec.key}
            className="absolute rounded-[2px] bg-canvas-surface shadow-[0_0_0_1px_var(--canvas-surface-border)]"
            style={{
              left: spec.x,
              top: spec.top,
              width: spec.width,
              height: spec.height,
            }}
          />
        ))}
      </div>
    </div>
  );
}
