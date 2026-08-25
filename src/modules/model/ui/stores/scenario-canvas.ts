import type { Node } from "@xyflow/react";

export type LifelineNodeData = {
  name: string;
  representedElementType: string;
  columnIndex: number;
  scenarioId: string;
  lifelineId: string;
  canopyHeight: number;
  createdByExecutionOrder?: number;
  destroyedByExecutionOrder?: number;
};

export type FragmentOperandData = {
  id: string;
  position: number;
  guard: string;
};

export type FragmentNodeData = {
  name: string;
  operator: string;
  guard: string;
  fragmentId: string;
  scenarioId: string;
  rowIndex: number;
  columnIndex: number;
  spanColumns: number;
  operands: FragmentOperandData[];
  onPositionCommit?: (
    fragmentId: string,
    rowIndex: number,
    columnIndex: number,
    spanColumns: number,
  ) => void;
  onOperandsCommit?: (
    fragmentId: string,
    operands: { position: number; guard: string }[],
  ) => void;
};

export type EnvironmentNodeData = {
  width: number;
  height: number;
  label: string;
};

export type MessageEdgeData = {
  name: string;
  kind: string;
  executionOrder: number;
  messageId: string;
  scenarioId: string;
  numberLabel?: string;
  onMoveToOrder?: (messageId: string, newOrder: number) => void;
};

export type ScenarioCanvasNode =
  | Node<LifelineNodeData>
  | Node<FragmentNodeData>
  | Node<EnvironmentNodeData>;
