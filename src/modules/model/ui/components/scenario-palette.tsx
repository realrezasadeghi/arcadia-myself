"use client";

import { cn } from "@/modules/shared/ui/libs/cn";
import { Layers, MessageSquare, WrapText } from "lucide-react";
import { useState } from "react";
import { useWorkbenchStore } from "../stores/workbench";
import { getElementTypesForLayer, getElementVisual } from "../helpers/element";
import { isScenarioDiagramType } from "../helpers/diagram";
import { FragmentType } from "@/modules/model/domain/value-objects/fragment-type";
import { MessageSort } from "@/modules/model/domain/value-objects/message-sort";
import type { ElementTypeValue } from "../types/element";
import type { LayerValue } from "../types/layer";

const SCENARIO_DIAGRAM_TYPES = new Set(["OIS", "SS", "LS", "PS"]);

const FRAGMENT_TYPES = FragmentType.all();
const MESSAGE_SORTS = MessageSort.all();

export function ScenarioPalette() {
  const activeDiagramId = useWorkbenchStore((s) => s.activeDiagramId);
  const tabs = useWorkbenchStore((s) => s.tabs);
  const activeTab = tabs.find((t) => t.diagramId === activeDiagramId);

  const isScenario = activeTab ? SCENARIO_DIAGRAM_TYPES.has(activeTab.type) : false;

  if (!isScenario || !activeTab) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground p-4">
        <Layers className="size-8 opacity-20" />
        <p className="text-xs text-center">Select a scenario diagram to see available elements</p>
      </div>
    );
  }

  const layer = activeTab.layer as LayerValue;
  const elementTypes = getElementTypesForLayer(layer);

  return (
    <div className="flex h-full flex-col overflow-auto">
      <div className="flex h-8 shrink-0 items-center gap-1.5 border-b bg-muted/30 px-3">
        <Layers className="size-3.5 text-muted-foreground" />
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Scenario Palette
        </p>
      </div>

      <div className="p-2 space-y-3">
        {/* Element Types (Lifelines) */}
        <PaletteSection title="Elements (Lifelines)" icon={Layers}>
          {elementTypes.map((et) => (
            <PaletteItem
              key={et.value}
              label={et.label}
              type={et.value}
              dragType="element"
              color={getElementVisual(et.value).strokeColor}
            />
          ))}
        </PaletteSection>

        {/* Fragment Types */}
        <PaletteSection title="Fragments" icon={WrapText}>
          {FRAGMENT_TYPES.map((ft) => (
            <PaletteItem
              key={ft.value}
              label={`${ft.operator.toUpperCase()} ${ft.label}`}
              type={ft.value}
              dragType="fragment"
              color={getFragmentColor(ft.value)}
            />
          ))}
        </PaletteSection>

        {/* Message Types */}
        <PaletteSection title="Message Types" icon={MessageSquare}>
          {MESSAGE_SORTS.map((ms) => (
            <PaletteItem
              key={ms.value}
              label={ms.label}
              type={ms.value}
              dragType="message"
              color={getMessageColor(ms.value)}
            />
          ))}
        </PaletteSection>
      </div>
    </div>
  );
}

function PaletteSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Layers;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
      >
        <Icon className="size-3" />
        <span>{title}</span>
      </button>
      {isOpen && <div className="mt-1 space-y-0.5">{children}</div>}
    </div>
  );
}

function PaletteItem({
  label,
  type,
  dragType,
  color,
}: {
  label: string;
  type: string;
  dragType: "element" | "fragment" | "message";
  color: string;
}) {
  const handleDragStart = (e: React.DragEvent) => {
    if (dragType === "element") {
      e.dataTransfer.setData(
        "application/element-type",
        type,
      );
    } else if (dragType === "fragment") {
      e.dataTransfer.setData(
        "application/fragment-type",
        type,
      );
    } else if (dragType === "message") {
      e.dataTransfer.setData(
        "application/message-sort",
        type,
      );
    }
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={cn(
        "flex items-center gap-2 rounded-md border border-border px-2 py-1.5 text-xs cursor-grab active:cursor-grabbing",
        "hover:border-primary/40 hover:bg-accent transition-colors",
      )}
    >
      <span
        className="size-2.5 shrink-0 rounded-sm border"
        style={{
          backgroundColor: `${color}20`,
          borderColor: color,
        }}
      />
      <span className="truncate flex-1 text-left">{label}</span>
    </div>
  );
}

function getFragmentColor(type: string): string {
  const colors: Record<string, string> = {
    alt: "#E74C3C",
    opt: "#F39C12",
    loop: "#3498DB",
    break: "#E67E22",
    par: "#9B59B6",
    critical: "#C0392B",
    region: "#7F8C8D",
    neg: "#E74C3C",
    assert: "#27AE60",
    ignore: "#95A5A6",
    consider: "#3498DB",
  };
  return colors[type] || "#94A3B8";
}

function getMessageColor(type: string): string {
  const colors: Record<string, string> = {
    sync: "#1E8449",
    async: "#2E86C1",
    reply: "#94A3B8",
    create: "#27AE60",
    destroy: "#E74C3C",
    found: "#7F8C8D",
    lost: "#E74C3C",
  };
  return colors[type] || "#94A3B8";
}
