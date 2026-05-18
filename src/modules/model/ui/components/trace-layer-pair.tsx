"use client";

import { LayerBadge } from "@/modules/shared/ui/components/common/layer-badge";
import { Badge } from "@/modules/shared/ui/components/ui/badge";
import { useMemo } from "react";
import { useGetElementsByModelId } from "../clients/get-elements-by-model-id";
import { getElementVisual } from "../helpers/element";
import { getLayerInfo } from "../helpers/layer";
import { getTraceLinkTypeInfo, getTraceVisual } from "../helpers/trace-link";
import type { ElementTypeValue } from "../types/element";
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
}

export function TraceLayerPair({
  upper,
  lower,
  models,
  traceLinks,
}: TraceLayerPairProps) {
  const upperModel = models.find((model) => model.layer === upper);
  const lowerModel = models.find((model) => model.layer === lower);

  const { data: upperElements } = useGetElementsByModelId(upperModel?.id ?? "");
  const { data: lowerElements } = useGetElementsByModelId(lowerModel?.id ?? "");

  // Build set of traced pairs: "sourceId|targetId"
  const tracedPairs = useMemo(() => {
    const pairs = new Set<string>();
    for (const trace of traceLinks) {
      const sourceLayer = trace.sourceLayer;
      const targetLayer = trace.targetLayer;
      if (sourceLayer === upper && targetLayer === lower) {
        pairs.add(`${trace.sourceElementId}|${trace.targetElementId}`);
      } else if (sourceLayer === lower && targetLayer === upper) {
        pairs.add(`${trace.targetElementId}|${trace.sourceElementId}`);
      }
    }
    return pairs;
  }, [traceLinks, upper, lower]);

  const upperRows = upperElements ?? [];
  const lowerCols = lowerElements ?? [];

  if (upperRows.length === 0 && lowerCols.length === 0) {
    return (
      <section>
        <SectionHeader upper={upper} lower={lower} count={0} />
        <p className="text-sm text-muted-foreground">
          هیچ المنتی در این دو لایه وجود ندارد.
        </p>
      </section>
    );
  }

  const pairCount = [...tracedPairs].length;

  return (
    <section className="flex flex-col gap-3">
      <SectionHeader upper={upper} lower={lower} count={pairCount} />

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="sticky right-0 z-10 bg-muted/60 border-b border-l border-border px-3 py-2 text-right font-medium min-w-35">
                {getLayerInfo(upper).labelFa} \ {getLayerInfo(lower).labelFa}
              </th>
              {lowerCols.map((element) => (
                <th
                  key={element.id}
                  className="border-b border-l border-border px-2 py-2 font-normal text-muted-foreground min-w-25 max-w-35"
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <ElementDot elementType={element.type} />
                    <span className="truncate max-w-22.5 text-center">
                      {element.name}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {upperRows.map((rowEl, ri) => (
              <tr
                key={rowEl.id}
                className={ri % 2 === 0 ? "bg-background" : "bg-muted/20"}
              >
                <td
                  className="sticky right-0 z-10 border-b border-l border-border px-3 py-2 font-medium"
                  style={{
                    backgroundColor:
                      ri % 2 === 0
                        ? "hsl(var(--background))"
                        : "hsl(var(--muted) / 0.2)",
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <ElementDot elementType={rowEl.type} />
                    <span className="truncate max-w-27.5">{rowEl.name}</span>
                  </div>
                </td>
                {lowerCols.map((colEl) => {
                  const hasTrace = tracedPairs.has(`${rowEl.id}|${colEl.id}`);
                  // Find the trace link to show type
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
                    <td
                      key={colEl.id}
                      className="border-b border-l border-border px-2 py-2 text-center"
                    >
                      {hasTrace && traceSpec && traceInfo ? (
                        <div className="flex flex-col items-center gap-0.5">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: traceSpec.strokeColor }}
                            title={traceInfo?.labelFa}
                          />
                          <span className="text-[9px] text-muted-foreground">
                            {traceInfo?.labelFa}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground/30">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
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
        <LayerBadge layer={getLayerInfo(upper)} />
        <span className="text-muted-foreground">→</span>
        <LayerBadge layer={getLayerInfo(lower)} />
      </div>
      <Badge variant="secondary" className="text-xs">
        {count} پیوند
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
