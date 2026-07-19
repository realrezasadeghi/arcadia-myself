export type UpdateClassRelationshipDTOProps = {
  id: string;
  modelId: string;
  name?: string;
  relationshipType?: "ASSOCIATION" | "AGGREGATION" | "COMPOSITION" | "GENERALIZATION" | "REALIZATION" | "DEPENDENCY";
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

export class UpdateClassRelationshipDTO {
  public readonly id: string;
  public readonly modelId: string;
  public readonly name?: string;
  public readonly relationshipType?: "ASSOCIATION" | "AGGREGATION" | "COMPOSITION" | "GENERALIZATION" | "REALIZATION" | "DEPENDENCY";
  public readonly isAggregate?: boolean;
  public readonly isComposite?: boolean;
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
    this.isAggregate = props.isAggregate;
    this.isComposite = props.isComposite;
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