import type { Node } from "@xyflow/react";
import type { NodeProjection, ProjectionContext } from "../base.projection";

export type ClassElementInput = {
  id: string;
  name: string;
  type: string;
  description: string | null;
  attributes: ReadonlyArray<{
    id: string;
    name: string;
    type: string;
    visibility: string;
    isStatic: boolean;
    multiplicityLower: number;
    multiplicityUpper: number | null;
    displayString: string;
  }>;
  operations: ReadonlyArray<{
    id: string;
    name: string;
    returnType: string;
    visibility: string;
    isStatic: boolean;
    isAbstract: boolean;
    parameters: ReadonlyArray<{
      name: string;
      type: string;
      direction: string;
    }>;
    displayString: string;
  }>;
};

export type ClassNodeData = {
  elementId: string;
  name: string;
  elementType: string;
  modelId: string;
  stereotype: string;
  attributes: string[];
  operations: string[];
  isAbstract: boolean;
};

/**
 * Maps a class-like element to a React Flow node.
 * Renders as a 3-section UML class box:
 * ┌──────────────────┐
 * │ <<stereotype>>   │
 * │ ClassName         │
 * ├──────────────────┤
 * │ + attr: Type      │
 * ├──────────────────┤
 * │ + method(): void  │
 * └──────────────────┘
 */
export class ClassNodeMapper implements NodeProjection<ClassElementInput> {
  map(
    input: ClassElementInput,
    context: ProjectionContext,
  ): Node<ClassNodeData> {
    const pos = context.elementPositions.get(input.id);
    const position = pos ? { x: pos.x, y: pos.y } : { x: 0, y: 0 };
    const width = pos?.width ?? 220;

    const stereotype = getStereotype(input.type);
    const isAbstract = input.operations.some((op) => op.isAbstract);

    return {
      id: input.id,
      type: "classNode",
      position,
      data: {
        elementId: input.id,
        name: input.name,
        elementType: input.type,
        modelId: context.modelId,
        stereotype,
        attributes: input.attributes.map((a) => a.displayString),
        operations: input.operations.map((o) => o.displayString),
        isAbstract,
      },
      style: { width },
    };
  }
}

function getStereotype(type: string): string {
  switch (type) {
    case "Interface":
      return "interface";
    case "DataType":
      return "dataType";
    case "Enumeration":
      return "enumeration";
    case "PrimitiveType":
      return "primitiveType";
    case "Collection":
      return "collection";
    case "ExchangeItem":
      return "exchangeItem";
    default:
      return "class";
  }
}
