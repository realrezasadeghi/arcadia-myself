import { notFound } from "next/navigation";
import { getDiagramById } from "../../presentation/server-actions/get-diagram-by-id";
import { getElementsByModelId } from "../../presentation/server-actions/get-elements-by-model-id";
import { getRelationshipsByModelId } from "../../presentation/server-actions/get-relationships-by-model-id";
import { getClassDiagramById } from "../../presentation/server-actions/get-class-diagram-by-id";
import { getClassElementsByModelId } from "../../presentation/server-actions/get-class-elements-by-model-id";
import { getClassRelationshipsByModelId } from "../../presentation/server-actions/get-class-relationships-by-model-id";
import { getClassPropertiesByElementId } from "../../presentation/server-actions/get-class-properties-by-element-id";
import { getClassOperationsByElementId } from "../../presentation/server-actions/get-class-operations-by-element-id";
import { getClassEnumerationLiteralsByElementId } from "../../presentation/server-actions/get-class-enumeration-literals-by-element-id";
import { DiagramCanvasInner } from "./diagram-canvas-inner";

export type DiagramCanvasProps = {
  params: Promise<{ id: string; diagramId: string }>;
};
export async function DiagramCanvas({ params }: DiagramCanvasProps) {
  const { diagramId } = await params;

  if (!diagramId) {
    notFound();
  }

  // Try architecture diagram first, then class diagram
  let diagramResult = await getDiagramById(diagramId);
  let isClassDiagram = false;
  let diagramData: any = null;

  if (diagramResult.data) {
    diagramData = diagramResult.data;
    isClassDiagram = diagramResult.data.type === "CDB";
  } else {
    // Not found in architecture diagrams — try class diagrams
    const classDiagramResult = await getClassDiagramById(diagramId);
    if (!classDiagramResult.data) {
      notFound();
    }
    diagramData = {
      id: classDiagramResult.data!.id,
      modelId: classDiagramResult.data!.modelId,
      type: "CDB",
      name: classDiagramResult.data!.name,
      description: classDiagramResult.data!.description,
      viewport: classDiagramResult.data!.viewport,
      elementLayouts: classDiagramResult.data!.elementLayouts,
      createdAt: classDiagramResult.data!.createdAt,
      updatedAt: classDiagramResult.data!.updatedAt,
    };
    isClassDiagram = true;
  }

  if (!diagramData.modelId) {
    notFound();
  }

  if (isClassDiagram) {
    // ─── Class Diagram (CDB) ───────────────────────────────────────────
    const [classElements, classRelationships] = await Promise.all([
      getClassElementsByModelId(diagramData.modelId),
      getClassRelationshipsByModelId(diagramData.modelId),
    ]);

    const elements = classElements?.data ?? [];

    // Fetch properties, operations, and literals for each class element
    const elementsWithDetails = await Promise.all(
      elements.map(async (el) => {
        const [properties, operations, enumerationLiterals] = await Promise.all([
          getClassPropertiesByElementId(el.id).then((r) => r.data ?? []),
          getClassOperationsByElementId(el.id).then((r) => r.data ?? []),
          getClassEnumerationLiteralsByElementId(el.id).then((r) => r.data ?? []),
        ]);
        return {
          ...el,
          type: el.elementType,
          description: undefined,
          properties,
          operations,
          enumerationLiterals,
        };
      }),
    );

    const mappedElements = elementsWithDetails.map((el) => ({
      id: el.id,
      name: el.name,
      type: el.type as any,
      modelId: el.modelId,
      updatedAt: el.updatedAt,
      createdAt: el.createdAt,
      description: el.description,
      parentId: el.parentId,
      status: el.status as "DRAFT" | "VALIDATED" | "DEPRECATED",
      // Class-specific fields passed through for class node rendering
      isAbstract: el.isAbstract,
      isStatic: el.isStatic,
      properties: el.properties,
      operations: el.operations,
      enumerationLiterals: el.enumerationLiterals,
    }));

    const relationships = (classRelationships?.data ?? []).map((rel) => ({
      id: rel.id,
      modelId: rel.modelId,
      type: rel.relationshipType as any,
      sourceElementId: rel.sourceElementId,
      targetElementId: rel.targetElementId,
      name: rel.name,
      description: undefined,
      // Class-specific fields
      aggregationKind: rel.aggregationKind,
      sourceMultiplicityLower: rel.sourceMultiplicityLower,
      sourceMultiplicityUpper: rel.sourceMultiplicityUpper,
      targetMultiplicityLower: rel.targetMultiplicityLower,
      targetMultiplicityUpper: rel.targetMultiplicityUpper,
      sourceRole: rel.sourceRole,
      targetRole: rel.targetRole,
      isNavigableSource: rel.isNavigableSource,
      isNavigableTarget: rel.isNavigableTarget,
    }));

    return (
      <DiagramCanvasInner
        diagram={diagramData}
        elements={mappedElements as any}
        relationships={relationships as any}
      />
    );
  }

  // ─── Architecture Diagram (non-CDB) ─────────────────────────────────────
  const [elements, relationships] = await Promise.all([
    getElementsByModelId(diagramData.modelId),
    getRelationshipsByModelId(diagramData.modelId),
  ]);

  const mappedElements = elements?.data?.map((element) => ({
    id: element.id,
    name: element.name,
    type: element.type,
    modelId: element.modelId,
    updatedAt: element.updatedAt,
    createdAt: element.createdAt,
    description: element?.description,
    parentId: element.parentId,
    status: element.properties.status,
  }));

  return (
    <DiagramCanvasInner
      diagram={diagramData}
      elements={mappedElements || []}
      relationships={relationships?.data || []}
    />
  );
}
