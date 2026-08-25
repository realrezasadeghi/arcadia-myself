"use client";

import { MessageSquare, Puzzle, Waypoints } from "lucide-react";
import { Separator } from "@/modules/shared/ui/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/modules/shared/ui/components/ui/tooltip";
import type { FragmentOperatorValue } from "../../../domain/value-objects/fragment-operator";
import type { LifelineTypeValue } from "../../../domain/value-objects/lifeline-type";
import type { MessageTypeValue } from "../../../domain/value-objects/message-type";

type ScenarioPaletteProps = {
  type: string;
};

function startDrag(
  event: React.DragEvent<HTMLDivElement>,
  payload: Record<string, string>,
) {
  event.dataTransfer.setData(
    "application/scenario-palette",
    JSON.stringify(payload),
  );
  event.dataTransfer.effectAllowed = "copy";
}

const LIFELINE_TYPES: {
  value: LifelineTypeValue;
  label: string;
  description: string;
  color: string;
}[] = [
  {
    value: "ACTOR",
    label: "Actor",
    description: "An actor participating in the scenario",
    color:
      "bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-400",
  },
  {
    value: "FUNCTION",
    label: "Function",
    description: "A function or activity",
    color: "bg-blue-500/10 border-blue-500/40 text-blue-700 dark:text-blue-400",
  },
  {
    value: "COMPONENT",
    label: "Component",
    description: "A system or logical component",
    color:
      "bg-violet-500/10 border-violet-500/40 text-violet-700 dark:text-violet-400",
  },
  {
    value: "CLASS_ELEMENT",
    label: "Class Element",
    description: "A class element from a class diagram",
    color:
      "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-400",
  },
  {
    value: "EXTERNAL",
    label: "External",
    description: "An external element not modeled in the system",
    color: "bg-gray-400/10 border-gray-400/40 text-gray-600 dark:text-gray-400",
  },
];

const MESSAGE_TYPES: {
  value: MessageTypeValue;
  label: string;
  description: string;
  dashed?: boolean;
  marker?: "source-circle" | "target-circle";
}[] = [
  {
    value: "CALL",
    label: "Synchronous Call",
    description: "A synchronous message call between lifelines",
  },
  {
    value: "CREATE",
    label: "Create",
    description: "Message that creates a lifeline",
  },
  {
    value: "DELETE",
    label: "Delete",
    description: "Message that destroys a lifeline",
  },
  {
    value: "RETURN",
    label: "Return",
    description: "Return message from a call",
    dashed: true,
  },
  {
    value: "REPLY",
    label: "Reply",
    description: "Reply to a previous message",
    dashed: true,
  },
  {
    value: "FOUND",
    label: "Found",
    description: "Message from an unknown source",
    marker: "source-circle",
  },
  {
    value: "LOST",
    label: "Lost",
    description: "Message to an unknown target",
    marker: "target-circle",
  },
];

const FRAGMENT_OPERATORS: {
  value: FragmentOperatorValue;
  label: string;
  description: string;
  color: string;
}[] = [
  {
    value: "alt",
    label: "Alternative",
    description: "Exclusive choice between operands (if/else)",
    color: "border-[#3b82f6] bg-[#3b82f6]/5 text-[#2563eb]",
  },
  {
    value: "opt",
    label: "Option",
    description: "Optional execution (if condition)",
    color: "border-[#22c55e] bg-[#22c55e]/5 text-[#16a34a]",
  },
  {
    value: "loop",
    label: "Loop",
    description: "Repeated execution",
    color: "border-[#f97316] bg-[#f97316]/5 text-[#ea580c]",
  },
  {
    value: "break",
    label: "Break",
    description: "Break out of enclosing loop",
    color: "border-[#ef4444] bg-[#ef4444]/5 text-[#dc2626]",
  },
  {
    value: "par",
    label: "Parallel",
    description: "Parallel execution of operands",
    color: "border-[#a855f7] bg-[#a855f7]/5 text-[#9333ea]",
  },
  {
    value: "critical",
    label: "Critical",
    description: "Critical region (atomic execution)",
    color: "border-[#eab308] bg-[#eab308]/5 text-[#ca8a04]",
  },
  {
    value: "assert",
    label: "Assertion",
    description: "Assert condition must be true",
    color: "border-[#06b6d4] bg-[#06b6d4]/5 text-[#0891b2]",
  },
  {
    value: "neg",
    label: "Negative",
    description: "Messages that should not occur",
    color: "border-[#ec4899] bg-[#ec4899]/5 text-[#db2777]",
  },
  {
    value: "ignore",
    label: "Ignore",
    description: "Messages explicitly ignored",
    color: "border-[#9ca3af] bg-[#9ca3af]/5 text-[#6b7280]",
  },
  {
    value: "consider",
    label: "Consider",
    description: "Only considered messages matter",
    color: "border-[#9ca3af] bg-[#9ca3af]/5 text-[#6b7280]",
  },
  {
    value: "strict",
    label: "Strict",
    description: "Strict sequencing of operands",
    color: "border-[#6366f1] bg-[#6366f1]/5 text-[#4f46e5]",
  },
  {
    value: "seq",
    label: "Weak Seq",
    description: "Weak sequencing of operands",
    color: "border-[#14b8a6] bg-[#14b8a6]/5 text-[#0d9488]",
  },
];

export function ScenarioPalette({ type: _type }: ScenarioPaletteProps) {
  return (
    <>
      <div className="px-3 pt-2">
        <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <Waypoints className="size-3" />
          Lifelines
        </p>
      </div>
      <div className="flex flex-col gap-1 p-2">
        {LIFELINE_TYPES.map((lt) => (
          <Tooltip key={lt.value}>
            <TooltipTrigger asChild>
              <div
                draggable
                onDragStart={(event) =>
                  startDrag(event, { type: "lifeline", lifelineType: lt.value })
                }
                data-type="lifeline"
                data-lifeline-type={lt.value}
                className={`flex items-center gap-2 rounded-md border px-2.5 py-2 text-xs cursor-grab active:cursor-grabbing hover:bg-accent transition-colors select-none ${lt.color}`}
              >
                <Waypoints className="size-3.5 shrink-0" />
                <span className="font-medium">{lt.label}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{lt.description}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      <Separator className="my-1" />

      <div className="px-3 pt-1">
        <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <MessageSquare className="size-3" />
          Messages
        </p>
      </div>
      <div className="flex flex-col gap-1 p-2">
        {MESSAGE_TYPES.map((mt) => (
          <Tooltip key={mt.value}>
            <TooltipTrigger asChild>
              <div
                draggable
                onDragStart={(event) =>
                  startDrag(event, { type: "message", messageType: mt.value })
                }
                className="flex items-center gap-2 rounded-md border border-border/60 px-2.5 py-2 text-xs text-muted-foreground hover:bg-accent transition-colors cursor-grab active:cursor-grabbing"
              >
                <svg
                  width="20"
                  height="8"
                  viewBox="0 0 20 8"
                  className="shrink-0"
                  aria-hidden="true"
                >
                  {mt.marker === "source-circle" && (
                    <circle cx="3" cy="4" r="2.5" fill="currentColor" />
                  )}
                  {mt.marker === "target-circle" ? (
                    <circle cx="17" cy="4" r="2.5" fill="currentColor" />
                  ) : (
                    <polygon
                      points="14,1 20,4 14,7"
                      fill="currentColor"
                      stroke="none"
                    />
                  )}
                  <line
                    x1={mt.marker === "source-circle" ? 6 : 1}
                    y1="4"
                    x2={mt.marker === "target-circle" ? 14 : 17}
                    y2="4"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeDasharray={mt.dashed ? "4,3" : undefined}
                  />
                </svg>
                <span className="text-xs leading-tight">{mt.label}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{mt.description}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      <Separator className="my-1" />

      <div className="px-3 pt-1">
        <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <Puzzle className="size-3" />
          Fragments
        </p>
      </div>
      <div className="flex flex-col gap-1 p-2">
        {FRAGMENT_OPERATORS.map((fo) => (
          <Tooltip key={fo.value}>
            <TooltipTrigger asChild>
              <div
                draggable
                onDragStart={(event) =>
                  startDrag(event, { type: "fragment", operator: fo.value })
                }
                className={`flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs cursor-grab active:cursor-grabbing hover:bg-accent transition-colors select-none ${fo.color}`}
              >
                <span className="font-mono font-bold text-[10px] uppercase">
                  {fo.value}
                </span>
                <span className="font-medium">{fo.label}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{fo.description}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      <div className="px-3 py-2 text-center">
        <p className="text-[10px] text-muted-foreground">
          Drag a lifeline or fragment onto the canvas. Drag a message onto the
          canvas to choose its participants.
        </p>
      </div>
    </>
  );
}
