export type CreateClassRelationshipDTOProps = {
  modelId: string;
  layer: string;
  sourceElementId: string;
  targetElementId: string;
  name?: string;
  relationshipType: "ASSOCIATION" | "AGGREGATION" | "COMPOSITION" | "GENERALIZATION" | "REALIZATION" | "DEPENDENCY";
  isAggregate?: boolean;
  isComposite?: boolean;
  sourceMultiplicityLower?: number;
  sourceMultiplicityUpper?: string;
  targetMultiplicityLower?: number;
  targetMultiplicityUpper?: string;
  sourceRole?: string;
  targetRole?: string;
  isNavigableSource?: boolean;
  isNavigableTarget?: boolean;
  extensionProperties?: Record<string, unknown>;
};

export class CreateClassRelationshipDTO {
  public readonly modelId: string;
  public readonly layer: string;
  public readonly sourceElementId: string;
  public readonly targetElementId: string;
  public readonly name: string;
  public readonly relationshipType: "ASSOCIATION" | "AGGREGATION" | "COMPOSITION" | "GENERALIZATION" | "REALIZATION" | "DEPENDENCY";
  public readonly isAggregate: boolean;
  public readonly isComposite: boolean;
  public readonly sourceMultiplicityLower: number;
  public readonly sourceMultiplicityUpper: string;
  public readonly targetMultiplicityLower: number;
  public readonly targetMultiplicityUpper: string;
  public readonly sourceRole: string;
  public readonly targetRole: string;
  public readonly isNavigableSource: boolean;
  public readonly isNavigableTarget: boolean;
  public readonly extensionProperties: Record<string, unknown>;

  private constructor(props: CreateClassRelationshipDTOProps) {
    this.modelId = props.modelId;
    this.layer = props.layer;
    this.sourceElementId = props.sourceElementId;
    this.targetElementId = props.targetElementId;
    this.name = props.name ?? "";
    this.relationshipType = props.relationshipType;
    this.isAggregate = props.isAggregate ?? false;
    this.isComposite = props.isComposite ?? false;
    this.sourceMultiplicityLower = props.sourceMultiplicityLower ?? 1;
    this.sourceMultiplicityUpper = props.sourceMultiplicityUpper ?? "1";
    this.targetMultiplicityLower = props.targetMultiplicityLower ?? 1;
    this.targetMultiplicityUpper = props.targetMultiplicityUpper ?? "1";
    this.sourceRole = props.sourceRole ?? "";
    this.targetRole = props.targetRole ?? "";
    this.isNavigableSource = props.isNavigableSource ?? true;
    this.isNavigableTarget = props.isNavigableTarget ?? true;
    this.extensionProperties = props.extensionProperties ?? {};
  }

  static create(props: CreateClassRelationshipDTOProps): CreateClassRelationshipDTO {
    return new CreateClassRelationshipDTO({
      modelId: CreateClassRelationshipDTO.validateRequiredString(props.modelId, "Model ID"),
      layer: CreateClassRelationshipDTO.validateLayer(props.layer),
      sourceElementId: CreateClassRelationshipDTO.validateRequiredString(props.sourceElementId, "Source Element ID"),
      targetElementId: CreateClassRelationshipDTO.validateRequiredString(props.targetElementId, "Target Element ID"),
      name: props.name,
      relationshipType: CreateClassRelationshipDTO.validateRelationshipType(props.relationshipType),
      isAggregate: props.isAggregate,
      isComposite: props.isComposite,
      sourceMultiplicityLower: props.sourceMultiplicityLower,
      sourceMultiplicityUpper: props.sourceMultiplicityUpper,
      targetMultiplicityLower: props.targetMultiplicityLower,
      targetMultiplicityUpper: props.targetMultiplicityUpper,
      sourceRole: props.sourceRole,
      targetRole: props.targetRole,
      isNavigableSource: props.isNavigableSource,
      isNavigableTarget: props.isNavigableTarget,
      extensionProperties: props.extensionProperties,
    });
  }

  private static validateRequiredString(value: string, fieldName: string): string {
    if (!value) throw new Error(`${fieldName} is required`);
    const trimmed = value.trim();
    if (!trimmed) throw new Error(`${fieldName} cannot be empty`);
    return trimmed;
  }

  private static validateLayer(layer: string): string {
    const validLayers = ["OA", "SA", "LA", "PA", "EPBS"];
    if (!validLayers.includes(layer)) {
      throw new Error(`Layer must be one of: ${validLayers.join(", ")}`);
    }
    return layer;
  }

  private static validateRelationshipType(
    type: string
  ): "ASSOCIATION" | "AGGREGATION" | "COMPOSITION" | "GENERALIZATION" | "REALIZATION" | "DEPENDENCY" {
    const validTypes = [
      "ASSOCIATION",
      "AGGREGATION",
      "COMPOSITION",
      "GENERALIZATION",
      "REALIZATION",
      "DEPENDENCY",
    ];
    if (!validTypes.includes(type)) {
      throw new Error(`Relationship type must be one of: ${validTypes.join(", ")}`);
    }
    return type as any;
  }
}