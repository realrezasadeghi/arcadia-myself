import { type Edge, MarkerType } from "@xyflow/react";
import type { EdgeProjection, ProjectionContext } from "../base.projection";

export type AssociationInput = {
  id: string;
  type: string;
  sourceClassId: string;
  targetClassId: string;
  name: string | null;
  sourceMultiplicityLower: number;
  sourceMultiplicityUpper: number | null;
  targetMultiplicityLower: number;
  targetMultiplicityUpper: number | null;
  sourceRole: string | null;
  targetRole: string | null;
  isNavigable: boolean;
};

export type AssociationEdgeData = {
  relationshipId: string;
  relationshipType: string;
  name: string;
  modelId: string;
  description: string;
  sourceMultiplicity: string;
  targetMultiplicity: string;
  sourceRole: string | null;
  targetRole: string | null;
};

/**
 * Maps a class association to a React Flow edge.
 * Supports: Association, Aggregation, Composition, Generalization, Dependency, Realization
 */
export class AssociationEdgeMapper implements EdgeProjection<AssociationInput> {
  map(
    input: AssociationInput,
    context: ProjectionContext,
  ): Edge<AssociationEdgeData> {
    const sourceMultiplicity = formatMultiplicity(
      input.sourceMultiplicityLower,
      input.sourceMultiplicityUpper,
    );
    const targetMultiplicity = formatMultiplicity(
      input.targetMultiplicityLower,
      input.targetMultiplicityUpper,
    );

    const { strokeDasharray, markerEnd } = getEdgeStyle(
      input.type,
      input.isNavigable,
    );

    return {
      id: input.id,
      type: "associationEdge",
      source: input.sourceClassId,
      target: input.targetClassId,
      data: {
        relationshipId: input.id,
        relationshipType: input.type,
        name: input.name ?? "",
        modelId: context.modelId,
        description: "",
        sourceMultiplicity,
        targetMultiplicity,
        sourceRole: input.sourceRole,
        targetRole: input.targetRole,
      },
      style: {
        stroke: "#2874A6",
        strokeWidth: 1.5,
        strokeDasharray,
      },
      markerEnd,
    };
  }
}

function formatMultiplicity(lower: number, upper: number | null): string {
  if (upper === null) {
    return lower === 0 ? "0..*" : `${lower}..*`;
  }
  if (lower === upper) {
    return lower === 1 ? "" : String(lower);
  }
  return `${lower}..${upper}`;
}

type EdgeStyle = {
  strokeDasharray: string;
  markerEnd?: {
    type: MarkerType;
    width: number;
    height: number;
    color: string;
  };
};

function getEdgeStyle(type: string, isNavigable: boolean): EdgeStyle {
  const ARROW_COLOR = "#2874A6";

  switch (type) {
    case "ClassAssociation":
      return {
        strokeDasharray: "0",
        markerEnd: isNavigable
          ? {
              type: MarkerType.ArrowClosed,
              width: 16,
              height: 16,
              color: ARROW_COLOR,
            }
          : undefined,
      };

    case "ClassAggregation":
      return {
        strokeDasharray: "0",
        markerEnd: isNavigable
          ? {
              type: MarkerType.ArrowClosed,
              width: 16,
              height: 16,
              color: ARROW_COLOR,
            }
          : undefined,
      };

    case "ClassComposition":
      return {
        strokeDasharray: "0",
        markerEnd: isNavigable
          ? {
              type: MarkerType.ArrowClosed,
              width: 16,
              height: 16,
              color: ARROW_COLOR,
            }
          : undefined,
      };

    case "ClassGeneralization":
      return {
        strokeDasharray: "0",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: "white",
        },
      };

    case "ClassDependency":
      return {
        strokeDasharray: "5,3",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color: ARROW_COLOR,
        },
      };

    case "ClassRealization":
      return {
        strokeDasharray: "5,3",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color: ARROW_COLOR,
        },
      };

    default:
      return { strokeDasharray: "0" };
  }
}
