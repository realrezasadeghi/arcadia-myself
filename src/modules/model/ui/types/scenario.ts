import type { Node, Edge } from "@xyflow/react";
import type { ScenarioDiagram } from "@/modules/model/domain/entities/scenario-diagram";
import type { ScenarioLifeline } from "@/modules/model/domain/entities/scenario-lifeline";
import type { ScenarioMessage } from "@/modules/model/domain/entities/scenario-message";
import type { ScenarioFragment } from "@/modules/model/domain/entities/scenario-fragment";
import type { MessageSort } from "@/modules/model/domain/value-objects/message-sort";
import type { FragmentType } from "@/modules/model/domain/value-objects/fragment-type";
import type { LifelineType } from "@/modules/model/domain/value-objects/lifeline-type";

export type ScenarioNodeType = "lifeline" | "fragment";

export type LifelineNodeData = {
  id: string;
  type: "lifeline";
  position: { x: number; y: number };
  width: number;
  height: number;
  lifeline: ScenarioLifeline;
  elementName: string;
  elementType: string;
  selector?: string;
  decomposed: boolean;
  [key: string]: unknown;
};

export type FragmentNodeData = {
  id: string;
  type: "fragment";
  position: { x: number; y: number };
  width: number;
  height: number;
  fragment: ScenarioFragment;
  operator: string;
  guard?: string;
  isCombined: boolean;
  [key: string]: unknown;
};

export type ScenarioEdgeType = "message" | "reply" | "create" | "destroy" | "found" | "lost";

export type ScenarioEdgeData = {
  message: ScenarioMessage;
  sort: MessageSort;
  label: string;
  signature?: string;
  sequenceOrder: number;
  [key: string]: unknown;
};

export type ScenarioCanvasNode = Node<LifelineNodeData> | Node<FragmentNodeData>;
export type ScenarioCanvasEdge = Edge<ScenarioEdgeData>;

export function getMessageEdgeType(sort: MessageSort): ScenarioEdgeType {
  if (sort.isReturn()) return "reply";
  if (sort.isCreateDestroy()) {
    return sort.value === "create" ? "create" : "destroy";
  }
  if (sort.isFoundLost()) {
    return sort.value === "found" ? "found" : "lost";
  }
  return sort.value === "async" ? "message" : "message";
}

export function getLifelineColor(type: LifelineType): string {
  const colors: Record<string, string> = {
    actor: "#1E8449",
    entity: "#2E86C1",
    component: "#1A5276",
    function: "#D4AC0D",
    boundary: "#7D3C98",
    control: "#6C3483",
    database: "#2C3E50",
    gate: "#7F8C8D",
  };
  return colors[type.value] || "#94A3B8";
}

export function getFragmentColor(type: FragmentType): string {
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
  return colors[type.value] || "#94A3B8";
}

export function getFragmentLabel(type: FragmentType): string {
  return type.operator.toUpperCase();
}