"use client";

import { useMemo } from "react";
import { LayerBadge } from "@/modules/shared/ui/components/common/layer-badge";
import { Badge } from "@/modules/shared/ui/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/shared/ui/components/ui/table";
import { getElementVisual } from "../helpers/element";
import { getLayerInfo } from "../helpers/layer";
import { getTraceLinkTypeInfo, getTraceVisual } from "../helpers/trace-link";
import type { Element, ElementTypeValue } from "../types/element";
import type { LayerValue } from "../types/layer";
import type { Model } from "../types/model";
import type { TraceLink } from "../types/trace-link";

interface TraceLayerPairProps {
  upper: LayerValue;
  lower: LayerValue;
  label: string;
  projectId: string;
  models: Model[];
  traceLinks: TraceLink[];
  elementsByModelId: Map<string, Element[]>;
}

export function TraceLayerPair({
  upper,
  lower,
  models,
  traceLinks,
  elementsByModelId,
}: TraceLayerPairProps) {
  // Rows are the concrete layer (`lower`, the trace source) and columns the
  // abstract layer (`upper`, the trace target) — matching how trace links are
  // stored: source realizes target.
  const sourceModel = models.find((model) => model.layer === lower);
  const targetModel = models.find((model) => model.layer === upper);

  const sourceElements = sourceModel
    ? (elementsByModelId.get(sourceModel.id) ?? [])
    : [];
  const targetElements = targetModel
    ? (elementsByModelId.get(targetModel.id) ?? [])
    : [];

  const tracedPairs = useMemo(() => {
    const pairs = new Set<string>();
    for (const trace of traceLinks) {
      if (trace.sourceLayer === lower && trace.targetLayer === upper) {
        pairs.add(`${trace.sourceElementId}|${trace.targetElementId}`);
      } else if (trace.sourceLayer === upper && trace.targetLayer === lower) {
        pairs.add(`${trace.targetElementId}|${trace.sourceElementId}`);
      }
    }
    return pairs;
  }, [traceLinks, upper, lower]);

  if (sourceElements.length === 0 && targetElements.length === 0) {
    return (
      <section>
        <SectionHeader upper={upper} lower={lower} count={0} />
        <p className="text-sm text-muted-foreground">
          No elements in these layers.
        </p>
      </section>
    );
  }

  const pairCount = [...tracedPairs].length;

  return (
    <section className="flex flex-col gap-3">
      <SectionHeader upper={upper} lower={lower} count={pairCount} />

      <div className="overflow-auto max-h-[65vh] rounded-lg border border-border">
        <Table className="w-full text-xs border-collapse">
          <TableHeader>
            <TableRow className="bg-muted/60">
              <TableHead
                scope="col"
                className="sticky left-0 z-10 bg-muted/60 border-b border-r border-border px-3 py-2 text-left font-medium min-w-35"
              >
                {getLayerInfo(lower).label} \ {getLayerInfo(upper).label}
              </TableHead>

              {targetElements.map((element) => (
                <TableHead
                  key={element.id}
                  className="border-b border-l border-border px-2 py-2 font-normal text-muted-foreground min-w-25 max-w-35"
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <ElementDot elementType={element.type} />
                    <span className="text-center">{element.name}</span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {sourceElements.map((rowEl, ri) => {
              const isEven = ri % 2 === 0;
              const stickyBgColor = isEven
                ? "hsl(var(--background))"
                : "hsl(var(--muted) / 0.2)";

              return (
                <TableRow
                  key={rowEl.id}
                  className={isEven ? "bg-background" : "bg-muted/20"}
                >
                  <TableCell
                    style={{ backgroundColor: stickyBgColor }}
                    className="sticky left-0 z-10 border-b border-r border-border px-3 py-2 font-medium bg-background"
                  >
                    <div className="flex items-center gap-1.5">
                      <ElementDot elementType={rowEl.type} />
                      <span>{rowEl.name}</span>
                    </div>
                  </TableCell>

                  {targetElements.map((colEl) => {
                    const hasTrace = tracedPairs.has(`${rowEl.id}|${colEl.id}`);
                    const traceLinkForCell = traceLinks.find(
                      (tr) =>
                        (tr.sourceElementId === rowEl.id &&
                          tr.targetElementId === colEl.id) ||
                        (tr.sourceElementId === colEl.id &&
                          tr.targetElementId === rowEl.id),
                    );
                    const traceInfo = traceLinkForCell
                      ? getTraceLinkTypeInfo(traceLinkForCell.type)
                      : null;
                    const traceSpec = traceLinkForCell
                      ? getTraceVisual(traceLinkForCell.type)
                      : null;

                    return (
                      <TableCell
                        key={colEl.id}
                        className="border-b border-l border-border px-2 py-2 text-center"
                      >
                        {hasTrace && traceSpec && traceInfo ? (
                          <div className="flex flex-col items-center gap-0.5">
                            <span
                              title={traceInfo.label}
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: traceSpec.strokeColor }}
                            />
                            <span className="text-[9px] text-muted-foreground">
                              {traceInfo.label}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/30">—</span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

function SectionHeader({
  upper,
  lower,
  count,
}: {
  upper: LayerValue;
  lower: LayerValue;
  count: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <LayerBadge layer={getLayerInfo(lower)} />
        <span className="text-muted-foreground">→</span>
        <LayerBadge layer={getLayerInfo(upper)} />
      </div>
      <Badge variant="secondary" className="text-xs">
        {count} link{count !== 1 ? "s" : ""}
      </Badge>
    </div>
  );
}

function ElementDot({ elementType }: { elementType: ElementTypeValue }) {
  const spec = getElementVisual(elementType);

  if (spec) {
    return (
      <span
        className="inline-block size-2.5 rounded-sm border shrink-0"
        style={{
          borderColor: spec.strokeColor,
          backgroundColor: spec.fillColor,
        }}
      />
    );
  }

  return <span className="inline-block size-2.5 rounded-sm bg-muted" />;
}
