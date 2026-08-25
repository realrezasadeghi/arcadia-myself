"use client";

import { LIFELINE_TYPE_CONFIG, MESSAGE_CONFIG } from "../constants/scenario";

const LIFELINE_ORDER = [
  "ACTOR",
  "FUNCTION",
  "COMPONENT",
  "CLASS_ELEMENT",
  "EXTERNAL",
] as const;

const MESSAGE_ORDER = [
  "CALL",
  "RETURN",
  "CREATE",
  "DELETE",
  "FOUND",
  "LOST",
] as const;

const MESSAGE_LABELS: Record<string, string> = {
  CALL: "Call (sync)",
  RETURN: "Return / Reply",
  CREATE: "Create",
  DELETE: "Delete",
  FOUND: "Found (unknown src)",
  LOST: "Lost (unknown tgt)",
};

function MessageSwatch({ kind }: { kind: string }) {
  const config = MESSAGE_CONFIG[kind] ?? MESSAGE_CONFIG.CALL;

  if (kind === "DELETE") {
    return (
      <svg width="24" height="10" viewBox="0 0 24 10" aria-hidden="true">
        <line
          x1="0"
          y1="5"
          x2="16"
          y2="5"
          className="stroke-canvas-ink"
          strokeWidth="1.5"
        />
        <line
          x1="16"
          y1="1"
          x2="22"
          y2="9"
          className="stroke-canvas-ink"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="22"
          y1="1"
          x2="16"
          y2="9"
          className="stroke-canvas-ink"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (kind === "FOUND") {
    return (
      <svg width="24" height="10" viewBox="0 0 24 10" aria-hidden="true">
        <circle cx="3" cy="5" r="2.5" className="fill-canvas-ink" />
        <line
          x1="6"
          y1="5"
          x2="20"
          y2="5"
          className="stroke-canvas-ink"
          strokeWidth="1.5"
        />
        <polygon points="18,2 23,5 18,8" className="fill-canvas-ink" />
      </svg>
    );
  }

  if (kind === "LOST") {
    return (
      <svg width="24" height="10" viewBox="0 0 24 10" aria-hidden="true">
        <line
          x1="0"
          y1="5"
          x2="17"
          y2="5"
          className="stroke-canvas-ink"
          strokeWidth="1.5"
        />
        <circle cx="20" cy="5" r="2.5" className="fill-canvas-ink" />
      </svg>
    );
  }

  return (
    <svg width="24" height="10" viewBox="0 0 24 10" aria-hidden="true">
      <line
        x1="0"
        y1="5"
        x2="19"
        y2="5"
        style={{ stroke: config.color }}
        strokeWidth="1.5"
        strokeDasharray={config.dashed ? "4,3" : undefined}
      />
      {config.openArrow ? (
        <polyline
          points="17,1.5 22,5 17,8.5"
          fill="none"
          style={{ stroke: config.color }}
          strokeWidth="1.5"
        />
      ) : (
        <polygon points="17,1.5 23,5 17,8.5" style={{ fill: config.color }} />
      )}
    </svg>
  );
}

export function ScenarioLegend() {
  return (
    <div className="absolute bottom-4 right-4 z-20 w-56 rounded-lg border bg-background/95 p-3 text-[10px] shadow-sm backdrop-blur-md">
      <p className="mb-2 text-xs font-semibold text-foreground">Legend</p>

      <p className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/60">
        Lifelines
      </p>
      <div className="mb-2 grid grid-cols-2 gap-x-2 gap-y-1">
        {LIFELINE_ORDER.map((type) => {
          const config = LIFELINE_TYPE_CONFIG[type];
          return (
            <div key={type} className="flex items-center gap-1.5">
              <span
                className={`size-3 rounded border ${config.headerBg} ${config.headerBorder}`}
              />
              <span className="text-muted-foreground truncate">
                {config.stereotype}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/60">
        Messages
      </p>
      <div className="mb-2 space-y-1">
        {MESSAGE_ORDER.map((kind) => (
          <div key={kind} className="flex items-center gap-2">
            <MessageSwatch kind={kind} />
            <span className="text-muted-foreground">
              {MESSAGE_LABELS[kind]}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-1 border-t pt-2">
        <div className="flex items-center gap-2">
          <span className="h-3 w-1.5 rounded-[1px] bg-canvas-surface shadow-[0_0_0_1px_var(--canvas-surface-border)]" />
          <span className="text-muted-foreground">Execution (activity)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-4 rounded-[2px] border border-dashed border-sky-500/50 bg-sky-500/10" />
          <span className="text-muted-foreground">Fragment</span>
        </div>
      </div>
    </div>
  );
}
