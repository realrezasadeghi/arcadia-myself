"use client";

import {
  ArrowLeft,
  ArrowRight,
  GitMerge,
  LayoutDashboard,
  Loader2,
  MousePointerClick,
  Workflow,
} from "lucide-react";
import type { ReactNode } from "react";
import { ScrollArea } from "@/modules/shared/ui/components/ui/scroll-area";
import { useGetElementRelations } from "../../clients/get-element-relations";
import { resolveDiagramLayer } from "../../helpers/diagram";
import { getElementTypeInfo } from "../../helpers/element";
import { getLayerInfo } from "../../helpers/layer";
import { getRelationshipTypeInfo } from "../../helpers/relationship";
import { getTraceLinkTypeInfo } from "../../helpers/trace-link";
import { useWorkbenchStore } from "../../stores/workbench";

/**
 * SemanticBrowserPanel
 *
 * تمام روابط المنت انتخاب‌شده را نشان می‌دهد: روابط (تبادلات)، trace linkها،
 * و دیاگرام‌هایی که المنت در آن‌ها ظاهر شده است. (مشابه Semantic Browser در Capella)
 */
export function SemanticBrowserPanel() {
  const selectedElementId = useWorkbenchStore((s) => s.selectedElementId);
  const selectElement = useWorkbenchStore((s) => s.selectElement);
  const openTab = useWorkbenchStore((s) => s.openTab);
  const currentLayer = useWorkbenchStore((s) => s.currentLayer);

  const { data, isLoading, isError } = useGetElementRelations(
    selectedElementId ?? undefined,
  );

  return (
    <aside className="flex h-full min-h-0 flex-col border-l bg-card">
      <div className="flex h-8 shrink-0 items-center gap-1.5 border-b bg-muted/30 px-3">
        <Workflow className="size-3.5 text-muted-foreground" />
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Semantic Browser
        </p>
      </div>

      {!selectedElementId ? (
        <EmptyState />
      ) : isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        </div>
      ) : isError || !data ? (
        <div className="flex flex-1 items-center justify-center p-4 text-center">
          <p className="text-xs text-muted-foreground">
            Failed to load relations
          </p>
        </div>
      ) : (
        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col gap-3 p-3">
            <div>
              <p className="truncate text-sm font-semibold">
                {data.element.name}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {getElementTypeInfo(data.element.type).label}
              </p>
            </div>

            <Section
              title="Relationships"
              count={data.relationships.length}
              icon={<ArrowRight className="size-3" />}
            >
              {data.relationships.map((rel) => (
                <button
                  type="button"
                  key={rel.id}
                  onClick={() => selectElement(rel.otherElementId)}
                  className="flex w-full items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1.5 text-left hover:bg-muted"
                >
                  {rel.direction === "outgoing" ? (
                    <ArrowRight className="size-3 shrink-0 text-muted-foreground" />
                  ) : (
                    <ArrowLeft className="size-3 shrink-0 text-muted-foreground" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">
                      {rel.otherElementName}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {getRelationshipTypeInfo(rel.relationshipType).label}
                    </p>
                  </div>
                </button>
              ))}
            </Section>

            <Section
              title="Trace Links"
              count={data.traceLinks.length}
              icon={<GitMerge className="size-3" />}
            >
              {data.traceLinks.map((trace) => (
                <button
                  type="button"
                  key={trace.id}
                  onClick={() => selectElement(trace.otherElementId)}
                  className="flex w-full items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1.5 text-left hover:bg-muted"
                >
                  <GitMerge className="size-3 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">
                      {trace.otherElementName ?? "Linked element"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {getTraceLinkTypeInfo(trace.traceType).label} ·{" "}
                      {getLayerInfo(trace.otherLayer).label}
                    </p>
                  </div>
                </button>
              ))}
            </Section>

            <Section
              title="Appears in Diagrams"
              count={data.diagrams.length}
              icon={<LayoutDashboard className="size-3" />}
            >
              {data.diagrams.map((diagram) => (
                <button
                  type="button"
                  key={diagram.id}
                  onClick={() =>
                    openTab({
                      diagramId: diagram.id,
                      modelId: data.element.modelId,
                      name: diagram.name,
                      type: diagram.type,
                      layer: resolveDiagramLayer(diagram.type, currentLayer),
                    })
                  }
                  className="flex w-full items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1.5 text-left hover:bg-muted"
                >
                  <LayoutDashboard className="size-3 shrink-0 text-muted-foreground" />
                  <span className="truncate text-xs">{diagram.name}</span>
                  <span className="ms-auto text-[9px] uppercase text-muted-foreground">
                    {diagram.type}
                  </span>
                </button>
              ))}
            </Section>
          </div>
        </ScrollArea>
      )}
    </aside>
  );
}

function Section({
  title,
  count,
  icon,
  children,
}: {
  title: string;
  count: number;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {title} ({count})
      </p>
      {count === 0 ? (
        <p className="px-1 text-[11px] text-muted-foreground/70">None</p>
      ) : (
        <div className="flex flex-col gap-1">{children}</div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-4 text-center text-muted-foreground">
      <MousePointerClick className="size-7 opacity-30" />
      <p className="text-xs">Select an element to browse its relations</p>
    </div>
  );
}
