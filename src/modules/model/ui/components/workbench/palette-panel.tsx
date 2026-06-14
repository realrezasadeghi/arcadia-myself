"use client";

import { ScrollArea } from "@/modules/shared/ui/components/ui/scroll-area";
import { Separator } from "@/modules/shared/ui/components/ui/separator";
import { Boxes, Spline } from "lucide-react";
import { useMemo } from "react";
import { RELATIONSHIP_VISUAL } from "../../constants/relationship";
import { getDiagramPalette } from "../../helpers/diagram";
import { getRelationshipTypeInfo } from "../../helpers/relationship";
import { useWorkbenchStore } from "../../stores/workbench";
import { ElementShapeList } from "../element-shape-list";

/**
 * PalettePanel
 *
 * جعبه‌ابزار کنار canvas. عناصر قابل کشیدن مخصوص لایه تب فعال را نشان می‌دهد
 * (drag → ساخت node + ذخیره debounced) و فهرست انواع روابط/تبادلات همان لایه را.
 * یال‌ها با کشیدن بین handleها ساخته می‌شوند (ConnectionPolicy اعتبارسنجی می‌کند).
 */
export function PalettePanel() {
  const activeTab = useWorkbenchStore((s) =>
    s.tabs.find((t) => t.diagramId === s.activeDiagramId),
  );

  const layer = activeTab?.layer ?? null;

  const palette = useMemo(
    () => (activeTab ? getDiagramPalette(activeTab.type) : null),
    [activeTab],
  );

  const relationships = useMemo(
    () =>
      palette
        ? palette.relationshipTypes.map((value) =>
            getRelationshipTypeInfo(value),
          )
        : [],
    [palette],
  );

  return (
    <aside className="flex h-full min-h-0 flex-col border-l bg-card">
      <div className="flex h-8 shrink-0 items-center gap-1.5 border-b bg-muted/30 px-3">
        <Boxes className="size-3.5 text-muted-foreground" />
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Palette
        </p>
      </div>

      {!activeTab || !layer || !palette ? (
        <div className="flex flex-1 items-center justify-center p-4 text-center">
          <p className="text-[11px] text-muted-foreground">
            Open a diagram to see its tools
          </p>
        </div>
      ) : (
        <ScrollArea className="min-h-0 flex-1">
          <div className="px-3 pt-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Nodes · {activeTab.type}
            </p>
          </div>
          <ElementShapeList layer={layer} types={palette.elementTypes} />

          {relationships.length > 0 && (
            <>
              <Separator className="my-1" />
              <div className="px-3 pt-1">
                <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <Spline className="size-3" />
                  Exchanges
                </p>
              </div>
              <div className="flex flex-col gap-1 p-2">
                {relationships.map((rel) => {
              const visual = RELATIONSHIP_VISUAL[rel.value];
              return (
                <div
                  key={rel.value}
                  className="flex items-center gap-2 rounded-md px-2.5 py-1.5"
                  title={`${rel.label} — drag between node handles to create`}
                >
                  <svg
                    width="20"
                    height="8"
                    viewBox="0 0 20 8"
                    className="shrink-0"
                    aria-hidden="true"
                    role="presentation"
                  >
                    <line
                      x1="1"
                      y1="4"
                      x2="19"
                      y2="4"
                      stroke={visual.strokeColor}
                      strokeWidth={visual.strokeWidth}
                      strokeDasharray={
                        visual.strokeDash && visual.strokeDash !== "none"
                          ? visual.strokeDash
                          : undefined
                      }
                    />
                  </svg>
                  <span className="text-xs leading-tight">{rel.label}</span>
                </div>
              );
                })}
              </div>
            </>
          )}

          <div className="px-3 py-2 text-center">
            <p className="text-[10px] text-muted-foreground">
              Drag nodes onto the canvas. Connect by dragging between handles.
            </p>
          </div>
        </ScrollArea>
      )}
    </aside>
  );
}
