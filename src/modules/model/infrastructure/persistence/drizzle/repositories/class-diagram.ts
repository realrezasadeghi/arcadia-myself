import { eq } from "drizzle-orm";
import type {
  ClassDiagramData,
  IClassDiagramRepository,
} from "@/modules/model/application/ports/class-diagram";
import {
  ClassAssociation,
  type ClassAssociationType,
} from "@/modules/model/domain/entities/class-association";
import { ClassAttribute } from "@/modules/model/domain/entities/class-attribute";
import { ClassOperation } from "@/modules/model/domain/entities/class-operation";
import { db } from "../client";
import {
  classAssociations,
  classAttributes,
  classOperations,
  elements,
} from "../schemas";

type AttributeRow = typeof classAttributes.$inferSelect;
type OperationRow = typeof classOperations.$inferSelect;
type AssociationRow = typeof classAssociations.$inferSelect;

function toAttributeEntity(row: AttributeRow): ClassAttribute {
  return ClassAttribute.reconstitute({
    id: row.id,
    classElementId: row.classElementId,
    name: row.name,
    type: row.type,
    visibility: row.visibility as
      | "public"
      | "private"
      | "protected"
      | "package",
    isStatic: row.isStatic === "true",
    isReadOnly: row.isReadOnly === "true",
    isOptional: row.isOptional === "true",
    defaultValue: row.defaultValue,
    description: row.description,
    multiplicityLower: row.multiplicityLower,
    multiplicityUpper: row.multiplicityUpper,
    order: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}

function toOperationEntity(row: OperationRow): ClassOperation {
  return ClassOperation.reconstitute({
    id: row.id,
    classElementId: row.classElementId,
    name: row.name,
    returnType: row.returnType,
    visibility: row.visibility as
      | "public"
      | "private"
      | "protected"
      | "package",
    isStatic: row.isStatic === "true",
    isAbstract: row.isAbstract === "true",
    parameters: (
      (row.parameters as Array<{
        name: string;
        type: string;
        direction: string;
        description?: string;
      }>) ?? []
    ).map((p) => ({
      ...p,
      direction: p.direction as "in" | "out" | "inout" | "return",
    })),
    description: row.description,
    order: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}

function toAssociationEntity(row: AssociationRow): ClassAssociation {
  return ClassAssociation.reconstitute({
    id: row.id,
    modelId: row.modelId,
    type: row.type as ClassAssociationType,
    sourceClassId: row.sourceClassId,
    targetClassId: row.targetClassId,
    sourceMultiplicityLower: row.sourceMultiplicityLower,
    sourceMultiplicityUpper: row.sourceMultiplicityUpper,
    targetMultiplicityLower: row.targetMultiplicityLower,
    targetMultiplicityUpper: row.targetMultiplicityUpper,
    sourceRole: row.sourceRole,
    targetRole: row.targetRole,
    name: row.name,
    description: row.description,
    isNavigable: row.isNavigable === "true",
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}

export class DrizzleClassDiagramRepository implements IClassDiagramRepository {
  // ─── Attributes ─────────────────────────────────────────────────────────────

  async saveAttribute(attr: ClassAttribute): Promise<ClassAttribute> {
    const data = attr.toJSON();
    await db.insert(classAttributes).values({
      id: data.id,
      classElementId: data.classElementId,
      name: data.name,
      type: data.type,
      visibility: data.visibility,
      isStatic: String(data.isStatic),
      isReadOnly: String(data.isReadOnly),
      isOptional: String(data.isOptional),
      defaultValue: data.defaultValue,
      description: data.description,
      multiplicityLower: data.multiplicityLower,
      multiplicityUpper: data.multiplicityUpper,
      sortOrder: data.order,
    });
    return attr;
  }

  async updateAttribute(attr: ClassAttribute): Promise<ClassAttribute> {
    const data = attr.toJSON();
    await db
      .update(classAttributes)
      .set({
        name: data.name,
        type: data.type,
        visibility: data.visibility,
        isStatic: String(data.isStatic),
        isReadOnly: String(data.isReadOnly),
        isOptional: String(data.isOptional),
        defaultValue: data.defaultValue,
        description: data.description,
        multiplicityLower: data.multiplicityLower,
        multiplicityUpper: data.multiplicityUpper,
        sortOrder: data.order,
        updatedAt: new Date(),
      })
      .where(eq(classAttributes.id, data.id));
    return attr;
  }

  async removeAttribute(id: string): Promise<void> {
    await db.delete(classAttributes).where(eq(classAttributes.id, id));
  }

  async getAttributeById(id: string): Promise<ClassAttribute | null> {
    const row = await db.query.classAttributes.findFirst({
      where: eq(classAttributes.id, id),
    });
    return row ? toAttributeEntity(row) : null;
  }

  async getAttributesByClassElementId(
    elementId: string,
  ): Promise<ClassAttribute[]> {
    const rows = await db
      .select()
      .from(classAttributes)
      .where(eq(classAttributes.classElementId, elementId));
    return rows.map(toAttributeEntity).sort((a, b) => a.order - b.order);
  }

  // ─── Operations ─────────────────────────────────────────────────────────────

  async saveOperation(op: ClassOperation): Promise<ClassOperation> {
    const data = op.toJSON();
    await db.insert(classOperations).values({
      id: data.id,
      classElementId: data.classElementId,
      name: data.name,
      returnType: data.returnType,
      visibility: data.visibility,
      isStatic: String(data.isStatic),
      isAbstract: String(data.isAbstract),
      parameters: data.parameters,
      description: data.description,
      sortOrder: data.order,
    });
    return op;
  }

  async updateOperation(op: ClassOperation): Promise<ClassOperation> {
    const data = op.toJSON();
    await db
      .update(classOperations)
      .set({
        name: data.name,
        returnType: data.returnType,
        visibility: data.visibility,
        isStatic: String(data.isStatic),
        isAbstract: String(data.isAbstract),
        parameters: data.parameters,
        description: data.description,
        sortOrder: data.order,
        updatedAt: new Date(),
      })
      .where(eq(classOperations.id, data.id));
    return op;
  }

  async removeOperation(id: string): Promise<void> {
    await db.delete(classOperations).where(eq(classOperations.id, id));
  }

  async getOperationById(id: string): Promise<ClassOperation | null> {
    const row = await db.query.classOperations.findFirst({
      where: eq(classOperations.id, id),
    });
    return row ? toOperationEntity(row) : null;
  }

  async getOperationsByClassElementId(
    elementId: string,
  ): Promise<ClassOperation[]> {
    const rows = await db
      .select()
      .from(classOperations)
      .where(eq(classOperations.classElementId, elementId));
    return rows.map(toOperationEntity).sort((a, b) => a.order - b.order);
  }

  // ─── Associations ───────────────────────────────────────────────────────────

  async saveAssociation(assoc: ClassAssociation): Promise<ClassAssociation> {
    const data = assoc.toJSON();
    await db.insert(classAssociations).values({
      id: data.id,
      modelId: data.modelId,
      type: data.type,
      sourceClassId: data.sourceClassId,
      targetClassId: data.targetClassId,
      sourceMultiplicityLower: data.sourceMultiplicityLower,
      sourceMultiplicityUpper: data.sourceMultiplicityUpper,
      targetMultiplicityLower: data.targetMultiplicityLower,
      targetMultiplicityUpper: data.targetMultiplicityUpper,
      sourceRole: data.sourceRole,
      targetRole: data.targetRole,
      name: data.name,
      description: data.description,
      isNavigable: String(data.isNavigable),
    });
    return assoc;
  }

  async updateAssociation(assoc: ClassAssociation): Promise<ClassAssociation> {
    const data = assoc.toJSON();
    await db
      .update(classAssociations)
      .set({
        name: data.name,
        description: data.description,
        sourceMultiplicityLower: data.sourceMultiplicityLower,
        sourceMultiplicityUpper: data.sourceMultiplicityUpper,
        targetMultiplicityLower: data.targetMultiplicityLower,
        targetMultiplicityUpper: data.targetMultiplicityUpper,
        sourceRole: data.sourceRole,
        targetRole: data.targetRole,
        isNavigable: String(data.isNavigable),
        updatedAt: new Date(),
      })
      .where(eq(classAssociations.id, data.id));
    return assoc;
  }

  async removeAssociation(id: string): Promise<void> {
    await db.delete(classAssociations).where(eq(classAssociations.id, id));
  }

  async getAssociationById(id: string): Promise<ClassAssociation | null> {
    const row = await db.query.classAssociations.findFirst({
      where: eq(classAssociations.id, id),
    });
    return row ? toAssociationEntity(row) : null;
  }

  async getAssociationsByModelId(modelId: string): Promise<ClassAssociation[]> {
    const rows = await db
      .select()
      .from(classAssociations)
      .where(eq(classAssociations.modelId, modelId));
    return rows.map(toAssociationEntity);
  }

  async getAssociationsByClassId(classId: string): Promise<ClassAssociation[]> {
    const rows = await db
      .select()
      .from(classAssociations)
      .where(eq(classAssociations.sourceClassId, classId));
    const targetRows = await db
      .select()
      .from(classAssociations)
      .where(eq(classAssociations.targetClassId, classId));

    const all = [...rows, ...targetRows];
    const unique = new Map(all.map((r) => [r.id, r]));
    return Array.from(unique.values()).map(toAssociationEntity);
  }

  // ─── Aggregated ─────────────────────────────────────────────────────────────

  async getClassDiagramData(modelId: string): Promise<ClassDiagramData> {
    // Get all information-type elements in this model
    const INFORMATION_TYPES = [
      "Class",
      "Interface",
      "DataType",
      "Enumeration",
      "PrimitiveType",
      "Collection",
      "ExchangeItem",
    ];

    const classElements = await db
      .select()
      .from(elements)
      .where(eq(elements.modelId, modelId));

    const infoElements = classElements.filter((el) =>
      INFORMATION_TYPES.includes(el.type),
    );

    // Fetch attributes and operations for each element
    const elementsWithDetails = await Promise.all(
      infoElements.map(async (el) => {
        const [attrs, ops] = await Promise.all([
          this.getAttributesByClassElementId(el.id),
          this.getOperationsByClassElementId(el.id),
        ]);
        return {
          id: el.id,
          name: el.name,
          type: el.type,
          description: el.description,
          attributes: attrs,
          operations: ops,
        };
      }),
    );

    // Fetch all associations for this model
    const associations = await this.getAssociationsByModelId(modelId);

    return {
      classElements: elementsWithDetails,
      associations,
    };
  }
}
