"use client";

import { useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/modules/shared/ui/components/ui/table";
import { Badge } from "@/modules/shared/ui/components/ui/badge";

interface TraceMatrixElement {
  id: string;
  name: string;
  layer: string;
}

interface TraceMatrixLink {
  sourceElementId: string;
  targetElementId: string;
  type: "Realization" | "Allocation" | "Deployment";
}

interface TraceMatrixProps {
  sourceLayer: string;
  targetLayer: string;
  sourceElements: TraceMatrixElement[];
  targetElements: TraceMatrixElement[];
  traceLinks: TraceMatrixLink[];
}

const TRACE_COLORS: Record<string, string> = {
  Realization: "bg-blue-100 text-blue-800",
  Allocation: "bg-green-100 text-green-800",
  Deployment: "bg-purple-100 text-purple-800",
};

export function TraceMatrix({
  sourceLayer,
  targetLayer,
  sourceElements,
  targetElements,
  traceLinks,
}: TraceMatrixProps) {
  const traceMap = useMemo(() => {
    const map = new Map<string, TraceMatrixLink>();
    traceLinks.forEach(link => {
      const key = `${link.sourceElementId}-${link.targetElementId}`;
      map.set(key, link);
    });
    return map;
  }, [traceLinks]);

  if (sourceElements.length === 0 || targetElements.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        هیچ عنصری برای نمایش نیست
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold">
          {sourceLayer} ↔ {targetLayer}
        </h3>
        <p className="text-sm text-muted-foreground">
          {sourceElements.length} عنصر در {sourceLayer} ، {targetElements.length} عنصر در {targetLayer}
        </p>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHead>
            <TableRow className="bg-muted">
              <TableCell className="font-semibold min-w-[200px]">{sourceLayer}</TableCell>
              {targetElements.map(elem => (
                <TableCell
                  key={elem.id}
                  className="text-center font-semibold min-w-[100px] text-xs"
                  title={elem.name}
                >
                  {elem.name.length > 12 ? elem.name.slice(0, 12) + "..." : elem.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sourceElements.map(srcElem => (
              <TableRow key={srcElem.id}>
                <TableCell className="font-medium max-w-[200px] truncate">
                  {srcElem.name}
                </TableCell>
                {targetElements.map(tgtElem => {
                  const link = traceMap.get(`${srcElem.id}-${tgtElem.id}`);
                  return (
                    <TableCell key={`${srcElem.id}-${tgtElem.id}`} className="text-center">
                      {link && (
                        <Badge variant="outline" className={TRACE_COLORS[link.type]}>
                          ✓
                        </Badge>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
