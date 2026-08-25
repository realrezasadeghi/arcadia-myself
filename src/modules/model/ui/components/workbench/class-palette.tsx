"use client";

import { useMemo } from "react";
import { Separator } from "@/modules/shared/ui/components/ui/separator";
import type { DiagramPalette } from "../../helpers/diagram";
import type { ClassElementTypeValue } from "../../types/class-diagram";
import { ClassElementShapeList } from "../class-element-shape-list";
import { ClassRelationshipList } from "../class-relationship-list";

export type ClassPaletteProps = {
  palette: DiagramPalette;
};

export function ClassPalette({ palette }: ClassPaletteProps) {
  const hasRelationships = palette.relationshipTypes.length > 0;

  return (
    <>
      <div className="px-3 pt-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Elements
        </p>
      </div>

      <ClassElementShapeList
        types={palette.elementTypes as ClassElementTypeValue[]}
      />

      {hasRelationships && (
        <>
          <Separator className="my-1" />
          <ClassRelationshipList />
        </>
      )}

      <div className="px-3 py-2 text-center">
        <p className="text-[10px] text-muted-foreground">
          Drag nodes onto the canvas. Connect by dragging between handles.
        </p>
      </div>
    </>
  );
}
