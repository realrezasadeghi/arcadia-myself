import type { TraceLinkTypeValue } from "../../domain/value-objects/relationship-type";

export type CreateTraceLinkDTOProps = {
  projectId: string;
  sourceModelId: string;
  targetModelId: string;
  type: TraceLinkTypeValue;
  sourceElementId: string;
  sourceLayer: string;
  targetElementId: string;
  targetLayer: string;
  description?: string;
};

export class CreateTraceLinkDTO {
  public readonly projectId: string;
  public readonly sourceModelId: string;
  public readonly targetModelId: string;
  public readonly type: TraceLinkTypeValue;
  public readonly sourceElementId: string;
  public readonly sourceLayer: string;
  public readonly targetElementId: string;
  public readonly targetLayer: string;
  public readonly description?: string;

  private constructor(props: CreateTraceLinkDTOProps) {
    this.projectId = props.projectId;
    this.sourceModelId = props.sourceModelId;
    this.targetModelId = props.targetModelId;
    this.type = props.type;
    this.sourceElementId = props.sourceElementId;
    this.sourceLayer = props.sourceLayer;
    this.targetElementId = props.targetElementId;
    this.targetLayer = props.targetLayer;
    this.description = props.description;
  }

  static create(props: {
    projectId: string;
    sourceModelId: string;
    targetModelId: string;
    type: TraceLinkTypeValue;
    sourceElementId: string;
    sourceLayer: string;
    targetElementId: string;
    targetLayer: string;
    description?: string;
  }): CreateTraceLinkDTO {
    return new CreateTraceLinkDTO({
      projectId: CreateTraceLinkDTO.validateRequiredString(
        props.projectId,
        "Project ID",
      ),
      sourceModelId: CreateTraceLinkDTO.validateRequiredString(
        props.sourceModelId,
        "Source model ID",
      ),
      targetModelId: CreateTraceLinkDTO.validateRequiredString(
        props.targetModelId,
        "Target model ID",
      ),
      type: CreateTraceLinkDTO.validateTraceLinkType(props.type),
      sourceElementId: CreateTraceLinkDTO.validateRequiredString(
        props.sourceElementId,
        "Source element ID",
      ),
      sourceLayer: CreateTraceLinkDTO.validateLayer(
        props.sourceLayer,
        "Source layer",
      ),
      targetElementId: CreateTraceLinkDTO.validateRequiredString(
        props.targetElementId,
        "Target element ID",
      ),
      targetLayer: CreateTraceLinkDTO.validateLayer(
        props.targetLayer,
        "Target layer",
      ),
      description: CreateTraceLinkDTO.validateDescription(props.description),
    });
  }

  private static validateRequiredString(
    value: string | undefined | null,
    fieldName: string,
  ): string {
    if (value === undefined || value === null) {
      throw new Error(`${fieldName} is required`);
    }
    const trimmed = value.trim();
    if (!trimmed) {
      throw new Error(`${fieldName} cannot be empty`);
    }
    if (trimmed.length > 255) {
      throw new Error(`${fieldName} cannot exceed 255 characters`);
    }
    return trimmed;
  }

  private static validateTraceLinkType(
    type: TraceLinkTypeValue,
  ): TraceLinkTypeValue {
    const validTypes: TraceLinkTypeValue[] = [
      "Realization",
      "Refinement",
      "Involvement",
      "Deployment",
      "Allocation",
    ];
    if (!validTypes.includes(type)) {
      throw new Error(
        `Trace link type must be one of: ${validTypes.join(", ")}`,
      );
    }
    return type;
  }

  private static validateLayer(layer: string, fieldName: string): string {
    if (!layer) {
      throw new Error("Layer is required");
    }

    const trimmed = layer.trim();

    if (!trimmed) {
      throw new Error(`${fieldName} cannot be empty`);
    }

    const validLayers = ["OA", "SA", "LA", "PA"];

    if (!validLayers.includes(trimmed)) {
      throw new Error(`${fieldName} must be one of: ${validLayers.join(", ")}`);
    }

    return trimmed;
  }

  private static validateDescription(description?: string): string | undefined {
    if (description === undefined || description === null) return undefined;
    const trimmed = description.trim();
    if (trimmed.length === 0) return undefined;
    if (trimmed.length > 500) {
      throw new Error("Trace link description cannot exceed 500 characters");
    }
    return trimmed;
  }
}
