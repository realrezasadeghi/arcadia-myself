"use client";

import type { Diagram } from "../types/diagram";
import type { Element } from "../types/element";
import type { Relationship } from "../types/relationship";
import { ArchitectureCanvasInner } from "./architecture-canvas-inner";
import { ClassCanvasInner } from "./class-canvas-inner";

export type DiagramHostProps = {
  diagram: Diagram;
  elements: Element[];
  relationships: Relationship[];
};

export function DiagramHost({
  diagram,
  elements,
  relationships,
}: DiagramHostProps) {
  if (diagram.type === "CDB") {
    return (
      <ClassCanvasInner
        diagram={diagram}
        elements={elements}
        relationships={relationships}
      />
    );
  }

  return (
    <ArchitectureCanvasInner
      diagram={diagram}
      elements={elements}
      relationships={relationships}
    />
  );
}
