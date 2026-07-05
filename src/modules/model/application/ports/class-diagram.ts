import type {
  ClassAssociation,
  ClassAssociationType,
} from "../../domain/entities/class-association";
import type { ClassAttribute } from "../../domain/entities/class-attribute";
import type { ClassOperation } from "../../domain/entities/class-operation";

export type ClassDiagramData = {
  classElements: Array<{
    id: string;
    name: string;
    type: string;
    description: string | null;
    attributes: ClassAttribute[];
    operations: ClassOperation[];
  }>;
  associations: ClassAssociation[];
};

export interface IClassDiagramRepository {
  // Attributes
  saveAttribute(attr: ClassAttribute): Promise<ClassAttribute>;
  updateAttribute(attr: ClassAttribute): Promise<ClassAttribute>;
  removeAttribute(id: string): Promise<void>;
  getAttributeById(id: string): Promise<ClassAttribute | null>;
  getAttributesByClassElementId(elementId: string): Promise<ClassAttribute[]>;

  // Operations
  saveOperation(op: ClassOperation): Promise<ClassOperation>;
  updateOperation(op: ClassOperation): Promise<ClassOperation>;
  removeOperation(id: string): Promise<void>;
  getOperationById(id: string): Promise<ClassOperation | null>;
  getOperationsByClassElementId(elementId: string): Promise<ClassOperation[]>;

  // Associations
  saveAssociation(assoc: ClassAssociation): Promise<ClassAssociation>;
  updateAssociation(assoc: ClassAssociation): Promise<ClassAssociation>;
  removeAssociation(id: string): Promise<void>;
  getAssociationById(id: string): Promise<ClassAssociation | null>;
  getAssociationsByModelId(modelId: string): Promise<ClassAssociation[]>;
  getAssociationsByClassId(classId: string): Promise<ClassAssociation[]>;

  // Aggregated
  getClassDiagramData(modelId: string): Promise<ClassDiagramData>;
}
