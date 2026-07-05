import type { Edge, Node } from "@xyflow/react";
import type { ClassDiagramData } from "../../application/ports/class-diagram";
import type { DiagramProjection, ProjectionContext } from "./base.projection";
import { AssociationEdgeMapper } from "./edge-mappers/association-edge.mapper";
import { ClassNodeMapper } from "./node-mappers/class-node.mapper";

/**
 * Projects class diagram semantic data into React Flow nodes and edges.
 *
 * Usage:
 *   const projection = new ClassDiagramProjection();
 *   const { nodes, edges } = projection.project(diagramData, context);
 */
export class ClassDiagramProjection
  implements DiagramProjection<ClassDiagramData>
{
  private readonly nodeMapper = new ClassNodeMapper();
  private readonly edgeMapper = new AssociationEdgeMapper();

  project(
    data: ClassDiagramData,
    context: ProjectionContext,
  ): { nodes: Node[]; edges: Edge[] } {
    const nodes = data.classElements.map((el) =>
      this.nodeMapper.map(el, context),
    );

    const edges = data.associations.map((assoc) =>
      this.edgeMapper.map(assoc.toJSON(), context),
    );

    return { nodes, edges };
  }
}
