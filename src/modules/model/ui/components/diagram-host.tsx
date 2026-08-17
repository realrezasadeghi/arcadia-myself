"use client";

import type { Diagram } from "../types/diagram";
import type { Element } from "../types/element";
import type { Relationship } from "../types/relationship";
import { ArchitectureCanvasInner } from "./architecture-canvas-inner";
import { ClassCanvasInner } from "./class-canvas-inner";
import { ScenarioCanvasInner } from "./scenario-canvas-inner";

export type DiagramHostProps = {
  diagram: Diagram;
  elements: Element[];
  relationships: Relationship[];
};

const SCENARIO_TYPES = new Set(["OIS", "SS", "LS", "PS"]);

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

  if (SCENARIO_TYPES.has(diagram.type)) {
    return (
      <ScenarioCanvasInner
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
