export type CreateClassOperationDTOProps = {
  classElementId: string;
  modelId: string;
  layer: string;
  name: string;
  returnTypeClassElementId?: string | null;
  returnTypeLiteral?: string;
  isStatic?: boolean;
  isAbstract?: boolean;
  visibility?: "public" | "private" | "protected" | "package";
  ordering?: number;
};

export class CreateClassOperationDTO {
  public readonly classElementId: string;
  public readonly modelId: string;
  public readonly layer: string;
  public readonly name: string;
  public readonly returnTypeClassElementId: string | null;
  public readonly returnTypeLiteral: string;
  public readonly isStatic: boolean;
  public readonly isAbstract: boolean;
  public readonly visibility: "public" | "private" | "protected" | "package";
  public readonly ordering: number;

  private constructor(props: CreateClassOperationDTOProps) {
    this.classElementId = props.classElementId;
    this.modelId = props.modelId;
    this.layer = props.layer;
    this.name = props.name;
    this.returnTypeClassElementId = props.returnTypeClassElementId ?? null;
    this.returnTypeLiteral = props.returnTypeLiteral ?? "";
    this.isStatic = props.isStatic ?? false;
    this.isAbstract = props.isAbstract ?? false;
    this.visibility = props.visibility ?? "public";
    this.ordering = props.ordering ?? 0;
  }

  static create(props: CreateClassOperationDTOProps): CreateClassOperationDTO {
    return new CreateClassOperationDTO({
      classElementId: CreateClassOperationDTO.validateRequiredString(props.classElementId, "Class Element ID"),
      modelId: CreateClassOperationDTO.validateRequiredString(props.modelId, "Model ID"),
      layer: CreateClassOperationDTO.validateLayer(props.layer),
      name: CreateClassOperationDTO.validateName(props.name),
      returnTypeClassElementId: props.returnTypeClassElementId,
      returnTypeLiteral: props.returnTypeLiteral,
      isStatic: props.isStatic,
      isAbstract: props.isAbstract,
      visibility: CreateClassOperationDTO.validateVisibility(props.visibility),
      ordering: props.ordering,
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

  private static validateName(name: string): string {
    if (!name) throw new Error("Operation name is required");
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Operation name cannot be empty");
    if (trimmed.length > 255) throw new Error("Name cannot exceed 255 characters");
    return trimmed;
  }

  private static validateVisibility(
    visibility?: string
  ): "public" | "private" | "protected" | "package" {
    const valid = ["public", "private", "protected", "package"];
    if (visibility && !valid.includes(visibility)) {
      throw new Error(`Visibility must be one of: ${valid.join(", ")}`);
    }
    return (visibility ?? "public") as any;
  }
}
