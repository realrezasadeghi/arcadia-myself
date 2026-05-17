import type { ElementTypeValue } from "../../domain/value-objects/element-type";

export type CreateElementDTOProps = {
  modelId: string;
  type: ElementTypeValue;
  name: string;
  description?: string;
};

export class CreateElementDTO {
  public readonly modelId: string;
  public readonly type: ElementTypeValue;
  public readonly name: string;
  public readonly description?: string;

  private constructor(props: CreateElementDTOProps) {
    this.modelId = props.modelId;
    this.type = props.type;
    this.name = props.name;
    this.description = props.description;
  }

  static create(props: {
    modelId: string;
    type: ElementTypeValue;
    name: string;
    description?: string;
  }): CreateElementDTO {
    return new CreateElementDTO({
      modelId: CreateElementDTO.validateModelId(props.modelId),
      type: CreateElementDTO.validateType(props.type),
      name: CreateElementDTO.validateName(props.name),
      description: CreateElementDTO.validateDescription(props.description),
    });
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

  private static validateType(type: ElementTypeValue): ElementTypeValue {
    const validTypes: ElementTypeValue[] = [
      "OperationalActivity",
      "OperationalActor",
      "OperationalCapability",
      "OperationalEntity",
      "OperationalProcess",
      "LogicalActor",
      "LogicalComponent",
      "LogicalFunction",
      "PhysicalActor",
      "PhysicalComponent",
      "PhysicalFunction",
      "PhysicalNode",
      "System",
      "SystemActor",
      "SystemCapability",
      "SystemComponent",
      "SystemFunction",
    ];

    if (!validTypes.includes(type)) {
      throw new Error(`Type must be one of: ${validTypes.join(", ")}`);
    }

    return type;
  }

  private static validateName(name: string): string {
    const trimmed = name?.trim();

    if (!trimmed) {
      throw new Error("Element name cannot be empty");
    }

    if (trimmed.length > 100) {
      throw new Error("Element name cannot exceed 100 characters");
    }

    return trimmed;
  }

  private static validateDescription(description?: string): string | undefined {
    if (description === undefined || description === null) return undefined;

    const trimmed = description.trim();

    if (trimmed.length === 0) return undefined;

    if (trimmed.length > 500) {
      throw new Error("Element description cannot exceed 500 characters");
    }

    return trimmed;
  }
}
