import type {
  ExchangeKind,
  RelationshipProperties,
} from "../../domain/entities/relationship";

export type UpdateRelationshipDTOProps = {
  id: string;
  modelId: string;
  name?: string;
  description?: string;
  properties?: RelationshipProperties;
};

export class UpdateRelationshipDTO {
  public readonly id: string;
  public readonly modelId: string;
  public readonly name?: string;
  public readonly description?: string;
  public readonly properties?: RelationshipProperties;

  private constructor(props: UpdateRelationshipDTOProps) {
    this.id = props.id;
    this.modelId = props.modelId;
    this.name = props.name;
    this.description = props.description;
    this.properties = props.properties;
  }

  static create(props: {
    id: string;
    modelId: string;
    name?: string;
    description?: string;
    properties?: RelationshipProperties;
  }): UpdateRelationshipDTO {
    return new UpdateRelationshipDTO({
      id: UpdateRelationshipDTO.validateRelationshipId(props.id),
      modelId: UpdateRelationshipDTO.validateModelId(props.modelId),
      name: UpdateRelationshipDTO.validateName(props.name),
      description: UpdateRelationshipDTO.validateDescription(props.description),
      properties: UpdateRelationshipDTO.validateProperties(props.properties),
    });
  }

  private static validateRelationshipId(relationshipId: string): string {
    const trimmed = relationshipId.trim();
    if (!trimmed) {
      throw new Error("Relationship ID cannot be empty");
    }
    if (trimmed.length > 255) {
      throw new Error("Relationship ID cannot exceed 255 characters");
    }
    return trimmed;
  }

  private static validateModelId(modelId: string): string {
    const trimmed = modelId.trim();
    if (!trimmed) {
      throw new Error("Model ID cannot be empty");
    }
    if (trimmed.length > 255) {
      throw new Error("Model ID cannot exceed 255 characters");
    }
    return trimmed;
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

  private static validateProperties(
    properties?: RelationshipProperties,
  ): RelationshipProperties | undefined {
    if (properties === undefined || properties === null) return undefined;

    if (typeof properties !== "object" || Array.isArray(properties)) {
      throw new Error("Properties must be an object");
    }

    // Validate exchangeKind if present
    if (properties.exchangeKind !== undefined) {
      const validKinds: ExchangeKind[] = ["FLOW", "EVENT", "OPERATION"];
      if (!validKinds.includes(properties.exchangeKind)) {
        throw new Error(
          `exchangeKind must be one of: ${validKinds.join(", ")}`,
        );
      }
    }

    // Validate conveyedItems if present
    if (properties.conveyedItems !== undefined) {
      if (!Array.isArray(properties.conveyedItems)) {
        throw new Error("conveyedItems must be an array of strings");
      }
      for (let i = 0; i < properties.conveyedItems.length; i++) {
        const item = properties.conveyedItems[i];
        if (typeof item !== "string") {
          throw new Error(`conveyedItems[${i}] must be a string`);
        }
        const trimmed = item.trim();
        if (trimmed.length === 0) {
          throw new Error(`conveyedItems[${i}] cannot be empty`);
        }
        if (trimmed.length > 255) {
          throw new Error(`conveyedItems[${i}] cannot exceed 255 characters`);
        }
        // Replace with trimmed value
        properties.conveyedItems[i] = trimmed;
      }
    }

    // Validate protocol if present
    if (properties.protocol !== undefined) {
      if (typeof properties.protocol !== "string") {
        throw new Error("protocol must be a string");
      }
      const trimmed = properties.protocol.trim();
      if (trimmed.length === 0) return undefined; // treat empty as removal? but we keep as empty? better to keep undefined? spec says optional, empty string probably means no value
      if (trimmed.length > 100) {
        throw new Error("protocol cannot exceed 100 characters");
      }
      properties.protocol = trimmed;
    }

    return properties;
  }
}
