export type UpdateClassRelationshipDTOProps = {
  id: string;
  modelId: string;
  name?: string;
  relationshipType?: "ASSOCIATION" | "GENERALIZATION" | "REALIZATION" | "DEPENDENCY";
  aggregationKind?: "NONE" | "SHARED" | "COMPOSITE";
  isDisjoint?: boolean;
  isComplete?: boolean;
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

export class UpdateClassRelationshipDTO {
  public readonly id: string;
  public readonly modelId: string;
  public readonly name?: string;
  public readonly relationshipType?: "ASSOCIATION" | "GENERALIZATION" | "REALIZATION" | "DEPENDENCY";
  public readonly aggregationKind?: "NONE" | "SHARED" | "COMPOSITE";
  public readonly isDisjoint?: boolean;
  public readonly isComplete?: boolean;
  public readonly sourceMultiplicityLower?: number;
  public readonly sourceMultiplicityUpper?: string;
  public readonly targetMultiplicityLower?: number;
  public readonly targetMultiplicityUpper?: string;
  public readonly sourceRole?: string;
  public readonly targetRole?: string;
  public readonly isNavigableSource?: boolean;
  public readonly isNavigableTarget?: boolean;
  public readonly extensionProperties?: Record<string, unknown>;

  private constructor(props: UpdateClassRelationshipDTOProps) {
    this.id = props.id;
    this.modelId = props.modelId;
    this.name = props.name;
    this.relationshipType = props.relationshipType;
    this.aggregationKind = props.aggregationKind;
    this.isDisjoint = props.isDisjoint;
    this.isComplete = props.isComplete;
    this.sourceMultiplicityLower = props.sourceMultiplicityLower;
    this.sourceMultiplicityUpper = props.sourceMultiplicityUpper;
    this.targetMultiplicityLower = props.targetMultiplicityLower;
    this.targetMultiplicityUpper = props.targetMultiplicityUpper;
    this.sourceRole = props.sourceRole;
    this.targetRole = props.targetRole;
    this.isNavigableSource = props.isNavigableSource;
    this.isNavigableTarget = props.isNavigableTarget;
    this.extensionProperties = props.extensionProperties;
  }

  static create(props: UpdateClassRelationshipDTOProps): UpdateClassRelationshipDTO {
    return new UpdateClassRelationshipDTO({
      id: UpdateClassRelationshipDTO.validateRequiredString(props.id, "Relationship ID"),
      modelId: UpdateClassRelationshipDTO.validateRequiredString(props.modelId, "Model ID"),
      name: props.name,
      relationshipType: props.relationshipType ? UpdateClassRelationshipDTO.validateRelationshipType(props.relationshipType) : undefined,
      aggregationKind: props.aggregationKind ? UpdateClassRelationshipDTO.validateAggregationKind(props.aggregationKind) : undefined,
      isDisjoint: props.isDisjoint,
      isComplete: props.isComplete,
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

  private static validateRelationshipType(
    type: string
  ): "ASSOCIATION" | "GENERALIZATION" | "REALIZATION" | "DEPENDENCY" {
    const validTypes = [
      "ASSOCIATION",
      "GENERALIZATION",
      "REALIZATION",
      "DEPENDENCY",
    ];
    if (!validTypes.includes(type)) {
      throw new Error(`Relationship type must be one of: ${validTypes.join(", ")}`);
    }
    return type as any;
  }

  private static validateAggregationKind(
    kind: string
  ): "NONE" | "SHARED" | "COMPOSITE" {
    const valid = ["NONE", "SHARED", "COMPOSITE"];
    if (!valid.includes(kind)) {
      throw new Error(`Aggregation kind must be one of: ${valid.join(", ")}`);
    }
    return kind as any;
  }
}