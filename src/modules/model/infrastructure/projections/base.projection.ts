import type { Edge, Node } from "@xyflow/react";

export interface ProjectionContext {
  modelId: string;
  elementPositions: Map<
    string,
    { x: number; y: number; width: number; height: number }
  >;
}

export interface NodeProjection<TInput> {
  map(input: TInput, context: ProjectionContext): Node;
}

export interface EdgeProjection<TInput> {
  map(input: TInput, context: ProjectionContext): Edge;
}

export interface DiagramProjection<TData> {
  project(
    data: TData,
    context: ProjectionContext,
  ): {
    nodes: Node[];
    edges: Edge[];
  };
}
