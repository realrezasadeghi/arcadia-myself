export type UpdateClassOperationParameterDTOProps = {
  id: string;
  name?: string;
  typeClassElementId?: string | null;
  typeLiteral?: string;
  multiplicityLower?: number;
  multiplicityUpper?: string;
  defaultValue?: string;
  direction?: "IN" | "OUT" | "INOUT";
  isOrdered?: boolean;
  isUnique?: boolean;
  ordering?: number;
};

export class UpdateClassOperationParameterDTO {
  public readonly id: string;
  public readonly name?: string;
  public readonly typeClassElementId?: string | null;
  public readonly typeLiteral?: string;
  public readonly multiplicityLower?: number;
  public readonly multiplicityUpper?: string;
  public readonly defaultValue?: string;
  public readonly direction?: "IN" | "OUT" | "INOUT";
  public readonly isOrdered?: boolean;
  public readonly isUnique?: boolean;
  public readonly ordering?: number;

  private constructor(props: UpdateClassOperationParameterDTOProps) {
    this.id = props.id;
    this.name = props.name;
    this.typeClassElementId = props.typeClassElementId;
    this.typeLiteral = props.typeLiteral;
    this.multiplicityLower = props.multiplicityLower;
    this.multiplicityUpper = props.multiplicityUpper;
    this.defaultValue = props.defaultValue;
    this.direction = props.direction;
    this.isOrdered = props.isOrdered;
    this.isUnique = props.isUnique;
    this.ordering = props.ordering;
  }

  static create(
    props: UpdateClassOperationParameterDTOProps,
  ): UpdateClassOperationParameterDTO {
    return new UpdateClassOperationParameterDTO({
      id: UpdateClassOperationParameterDTO.validateRequiredString(
        props.id,
        "Parameter ID",
      ),
      name: props.name
        ? UpdateClassOperationParameterDTO.validateName(props.name)
        : undefined,
      typeClassElementId: props.typeClassElementId,
      typeLiteral: props.typeLiteral,
      multiplicityLower:
        props.multiplicityLower !== undefined
          ? UpdateClassOperationParameterDTO.validateMultiplicityLower(
              props.multiplicityLower,
            )
          : undefined,
      multiplicityUpper: props.multiplicityUpper,
      defaultValue: props.defaultValue,
      direction: props.direction
        ? UpdateClassOperationParameterDTO.validateDirection(props.direction)
        : undefined,
      isOrdered: props.isOrdered,
      isUnique: props.isUnique,
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
    if (!trimmed) throw new Error("Parameter name cannot be empty");
    if (trimmed.length > 255)
      throw new Error("Name cannot exceed 255 characters");
    return trimmed;
  }

  private static validateMultiplicityLower(lower: number): number {
    if (lower < 0) throw new Error("Multiplicity lower must be >= 0");
    return lower;
  }

  private static validateDirection(direction: string): "IN" | "OUT" | "INOUT" {
    const valid = ["IN", "OUT", "INOUT"];
    if (!valid.includes(direction)) {
      throw new Error(`Direction must be one of: ${valid.join(", ")}`);
    }
    return direction as any;
  }
}
