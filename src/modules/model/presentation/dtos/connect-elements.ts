import type { RelationshipTypeValue } from "../../domain/value-objects/relationship-type";

export type ConnectElementsDTOProps = {
  modelId: string;
  sourceElementId: string;
  targetElementId: string;
  relationshipType: RelationshipTypeValue;
  name?: string;
  description?: string;
};

export class ConnectElementsDTO {
  public readonly modelId: string;
  public readonly sourceElementId: string;
  public readonly targetElementId: string;
  public readonly relationshipType: RelationshipTypeValue;
  public readonly name?: string;
  public readonly description?: string;

  private constructor(props: ConnectElementsDTOProps) {
    this.modelId = props.modelId;
    this.sourceElementId = props.sourceElementId;
    this.targetElementId = props.targetElementId;
    this.relationshipType = props.relationshipType;
    this.name = props.name;
    this.description = props.description;
  }

  static create(props: {
    modelId: string;
    sourceElementId: string;
    targetElementId: string;
    relationshipType: RelationshipTypeValue;
    name?: string;
    description?: string;
  }): ConnectElementsDTO {
    return new ConnectElementsDTO({
      modelId: ConnectElementsDTO.validateModelId(props.modelId),
      sourceElementId: ConnectElementsDTO.validateSourceElementId(
        props.sourceElementId,
      ),
      targetElementId: ConnectElementsDTO.validateTargetElementId(
        props.targetElementId,
      ),
      relationshipType: ConnectElementsDTO.validateRelationshipType(
        props.relationshipType,
      ),
      name: ConnectElementsDTO.validateName(props.name),
      description: ConnectElementsDTO.validateDescription(props.description),
    });
  }

  private static validateModelId(modelId: string): string {
    if (!modelId) {
      throw new Error("Model is is required");
    }

    const trimmed = modelId.trim();

    if (!trimmed) {
      throw new Error("Model ID cannot be empty");
    }

    if (trimmed.length > 255) {
      throw new Error("Model ID cannot exceed 255 characters");
    }

    return trimmed;
  }

  private static validateSourceElementId(sourceElementId: string): string {
    if (!sourceElementId) {
      throw new Error("Source element id is is required");
    }

    const trimmed = sourceElementId.trim();

    if (!trimmed) {
      throw new Error("Source element ID cannot be empty");
    }

    if (trimmed.length > 255) {
      throw new Error("Source element ID cannot exceed 255 characters");
    }

    return trimmed;
  }

  private static validateTargetElementId(targetElementId: string): string {
    if (!targetElementId) {
      throw new Error("Target element id is is required");
    }

    const trimmed = targetElementId.trim();

    if (!trimmed) {
      throw new Error("Target element ID cannot be empty");
    }

    if (trimmed.length > 255) {
      throw new Error("Target element ID cannot exceed 255 characters");
    }

    return trimmed;
  }

  private static validateRelationshipType(
    type: RelationshipTypeValue,
  ): RelationshipTypeValue {
    if (!type) {
      throw new Error("Relationship type is required.");
    }

    const validTypes: RelationshipTypeValue[] = [
      "OperationalExchange",
      "InvolvementLink",
      "FunctionalExchange",
      "SystemExchange",
      "LogicalExchange",
      "ComponentExchange",
      "ProvidedInterface",
      "RequiredInterface",
      "PhysicalExchange",
      "PhysicalLink",
      "DeploymentLink",
      "Composition",
    ];

    if (!validTypes.includes(type)) {
      throw new Error(
        `Relationship type must be one of: ${validTypes.join(", ")}`,
      );
    }

    return type;
  }

  private static validateName(name?: string): string | undefined {
    if (name === undefined || name === null) return undefined;

    const trimmed = name.trim();

    if (trimmed.length === 0) return undefined;

    if (trimmed.length > 100) {
      throw new Error("Relationship name cannot exceed 100 characters");
    }

    return trimmed;
  }

  private static validateDescription(description?: string): string | undefined {
    if (description === undefined || description === null) return undefined;

    const trimmed = description.trim();

    if (trimmed.length === 0) return undefined;

    if (trimmed.length > 500) {
      throw new Error("Relationship description cannot exceed 500 characters");
    }

    return trimmed;
  }
}
