export type UpdateClassOperationDTOProps = {
  id: string;
  name?: string;
  returnTypeClassElementId?: string | null;
  returnTypeLiteral?: string;
  isStatic?: boolean;
  isAbstract?: boolean;
  visibility?: "public" | "private" | "protected" | "package";
  ordering?: number;
};

export class UpdateClassOperationDTO {
  public readonly id: string;
  public readonly name?: string;
  public readonly returnTypeClassElementId?: string | null;
  public readonly returnTypeLiteral?: string;
  public readonly isStatic?: boolean;
  public readonly isAbstract?: boolean;
  public readonly visibility?: "public" | "private" | "protected" | "package";
  public readonly ordering?: number;

  private constructor(props: UpdateClassOperationDTOProps) {
    this.id = props.id;
    this.name = props.name;
    this.returnTypeClassElementId = props.returnTypeClassElementId;
    this.returnTypeLiteral = props.returnTypeLiteral;
    this.isStatic = props.isStatic;
    this.isAbstract = props.isAbstract;
    this.visibility = props.visibility;
    this.ordering = props.ordering;
  }

  static create(props: UpdateClassOperationDTOProps): UpdateClassOperationDTO {
    return new UpdateClassOperationDTO({
      id: UpdateClassOperationDTO.validateRequiredString(
        props.id,
        "Operation ID",
      ),
      name: props.name
        ? UpdateClassOperationDTO.validateName(props.name)
        : undefined,
      returnTypeClassElementId: props.returnTypeClassElementId,
      returnTypeLiteral: props.returnTypeLiteral,
      isStatic: props.isStatic,
      isAbstract: props.isAbstract,
      visibility: props.visibility
        ? UpdateClassOperationDTO.validateVisibility(props.visibility)
        : undefined,
      ordering: props.ordering,
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

  private static validateName(name: string): string {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Operation name cannot be empty");
    if (trimmed.length > 255)
      throw new Error("Name cannot exceed 255 characters");
    return trimmed;
  }

  private static validateVisibility(
    visibility: string,
  ): "public" | "private" | "protected" | "package" {
    const valid = ["public", "private", "protected", "package"];
    if (!valid.includes(visibility)) {
      throw new Error(`Visibility must be one of: ${valid.join(", ")}`);
    }
    return visibility as any;
  }
}
