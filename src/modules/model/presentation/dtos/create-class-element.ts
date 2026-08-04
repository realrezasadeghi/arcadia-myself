export type CreateClassElementDTOProps = {
  modelId: string;
  layer: string;
  name: string;
  elementType:
    | "CLASS"
    | "INTERFACE"
    | "ENUM"
    | "DATA_TYPE"
    | "PRIMITIVE"
    | "COLLECTION"
    | "UNION"
    | "PACKAGE";
  isAbstract?: boolean;
  isStatic?: boolean;
  parentId?: string | null;
  ordering?: number;
  extensionProperties?: Record<string, unknown>;
};

export class CreateClassElementDTO {
  public readonly modelId: string;
  public readonly layer: string;
  public readonly name: string;
  public readonly elementType:
    | "CLASS"
    | "INTERFACE"
    | "ENUM"
    | "DATA_TYPE"
    | "PRIMITIVE"
    | "COLLECTION"
    | "UNION"
    | "PACKAGE";
  public readonly isAbstract: boolean;
  public readonly isStatic: boolean;
  public readonly parentId: string | null;
  public readonly ordering: number;
  public readonly extensionProperties: Record<string, unknown>;

  private constructor(props: CreateClassElementDTOProps) {
    this.modelId = props.modelId;
    this.layer = props.layer;
    this.name = props.name;
    this.elementType = props.elementType;
    this.isAbstract = props.isAbstract ?? false;
    this.isStatic = props.isStatic ?? false;
    this.parentId = props.parentId ?? null;
    this.ordering = props.ordering ?? 0;
    this.extensionProperties = props.extensionProperties ?? {};
  }

  static create(props: CreateClassElementDTOProps): CreateClassElementDTO {
    return new CreateClassElementDTO({
      modelId: CreateClassElementDTO.validateRequiredString(
        props.modelId,
        "Model ID",
      ),
      layer: CreateClassElementDTO.validateLayer(props.layer),
      name: CreateClassElementDTO.validateName(props.name),
      elementType: CreateClassElementDTO.validateElementType(props.elementType),
      isAbstract: props.isAbstract,
      isStatic: props.isStatic,
      parentId: props.parentId,
      ordering: props.ordering,
      extensionProperties: props.extensionProperties,
    });
  }

  private static validateRequiredString(
    value: string,
    fieldName: string,
  ): string {
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

  private static validateName(name: string): string {
    if (!name) throw new Error("Element name is required");
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Element name cannot be empty");
    if (trimmed.length > 255)
      throw new Error("Name cannot exceed 255 characters");
    return trimmed;
  }

  private static validateElementType(
    type: string,
  ):
    | "CLASS"
    | "INTERFACE"
    | "ENUM"
    | "DATA_TYPE"
    | "PRIMITIVE"
    | "COLLECTION"
    | "UNION"
    | "PACKAGE" {
    const validTypes: (
      | "CLASS"
      | "INTERFACE"
      | "ENUM"
      | "DATA_TYPE"
      | "PRIMITIVE"
      | "COLLECTION"
      | "UNION"
      | "PACKAGE"
    )[] = [
      "CLASS",
      "INTERFACE",
      "ENUM",
      "DATA_TYPE",
      "PRIMITIVE",
      "COLLECTION",
      "UNION",
      "PACKAGE",
    ];
    if (!validTypes.includes(type as any)) {
      throw new Error(`Element type must be one of: ${validTypes.join(", ")}`);
    }
    return type as
      | "CLASS"
      | "INTERFACE"
      | "ENUM"
      | "DATA_TYPE"
      | "PRIMITIVE"
      | "COLLECTION"
      | "UNION"
      | "PACKAGE";
  }
}
