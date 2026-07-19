export type UpdateClassElementDTOProps = {
  id: string;
  modelId: string;
  name?: string;
  elementType?: "CLASS" | "INTERFACE" | "ENUM" | "DATA_TYPE" | "PRIMITIVE";
  isAbstract?: boolean;
  isStatic?: boolean;
  parentId?: string | null;
  ordering?: number;
  extensionProperties?: Record<string, unknown>;
};

export class UpdateClassElementDTO {
  public readonly id: string;
  public readonly name?: string;
  public readonly elementType?: "CLASS" | "INTERFACE" | "ENUM" | "DATA_TYPE" | "PRIMITIVE";
  public readonly isAbstract?: boolean;
  public readonly isStatic?: boolean;
  public readonly parentId?: string | null;
  public readonly ordering?: number;
  public readonly extensionProperties?: Record<string, unknown>;

  private constructor(props: UpdateClassElementDTOProps) {
    this.id = props.id;
    this.name = props.name;
    this.elementType = props.elementType;
    this.isAbstract = props.isAbstract;
    this.isStatic = props.isStatic;
    this.parentId = props.parentId;
    this.ordering = props.ordering;
    this.extensionProperties = props.extensionProperties;
  }

  static create(props: UpdateClassElementDTOProps): UpdateClassElementDTO {
    return new UpdateClassElementDTO({
      id: UpdateClassElementDTO.validateRequiredString(props.id, "Element ID"),
      modelId: props.modelId,
      name: props.name ? UpdateClassElementDTO.validateName(props.name) : undefined,
      elementType: props.elementType ? UpdateClassElementDTO.validateElementType(props.elementType) : undefined,
      isAbstract: props.isAbstract,
      isStatic: props.isStatic,
      parentId: props.parentId,
      ordering: props.ordering,
      extensionProperties: props.extensionProperties,
    });
  }

  private static validateRequiredString(value: string, fieldName: string): string {
    if (!value) throw new Error(`${fieldName} is required`);
    const trimmed = value.trim();
    if (!trimmed) throw new Error(`${fieldName} cannot be empty`);
    return trimmed;
  }

  private static validateName(name: string): string {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Element name cannot be empty");
    if (trimmed.length > 255) throw new Error("Name cannot exceed 255 characters");
    return trimmed;
  }

  private static validateElementType(
    type: string
  ): "CLASS" | "INTERFACE" | "ENUM" | "DATA_TYPE" | "PRIMITIVE" {
    const validTypes: ("CLASS" | "INTERFACE" | "ENUM" | "DATA_TYPE" | "PRIMITIVE")[] = [
      "CLASS",
      "INTERFACE",
      "ENUM",
      "DATA_TYPE",
      "PRIMITIVE",
    ];
    if (!validTypes.includes(type as any)) {
      throw new Error(`Element type must be one of: ${validTypes.join(", ")}`);
    }
    return type as "CLASS" | "INTERFACE" | "ENUM" | "DATA_TYPE" | "PRIMITIVE";
  }
}