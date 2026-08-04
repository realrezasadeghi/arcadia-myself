export type CreateClassOperationParameterDTOProps = {
  classOperationId: string;
  modelId: string;
  layer: string;
  name: string;
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

export class CreateClassOperationParameterDTO {
  public readonly classOperationId: string;
  public readonly modelId: string;
  public readonly layer: string;
  public readonly name: string;
  public readonly typeClassElementId: string | null;
  public readonly typeLiteral: string;
  public readonly multiplicityLower: number;
  public readonly multiplicityUpper: string;
  public readonly defaultValue: string;
  public readonly direction: "IN" | "OUT" | "INOUT";
  public readonly isOrdered: boolean;
  public readonly isUnique: boolean;
  public readonly ordering: number;

  private constructor(props: CreateClassOperationParameterDTOProps) {
    this.classOperationId = props.classOperationId;
    this.modelId = props.modelId;
    this.layer = props.layer;
    this.name = props.name;
    this.typeClassElementId = props.typeClassElementId ?? null;
    this.typeLiteral = props.typeLiteral ?? "";
    this.multiplicityLower = props.multiplicityLower ?? 1;
    this.multiplicityUpper = props.multiplicityUpper ?? "1";
    this.defaultValue = props.defaultValue ?? "";
    this.direction = props.direction ?? "IN";
    this.isOrdered = props.isOrdered ?? false;
    this.isUnique = props.isUnique ?? false;
    this.ordering = props.ordering ?? 0;
  }

  static create(
    props: CreateClassOperationParameterDTOProps,
  ): CreateClassOperationParameterDTO {
    return new CreateClassOperationParameterDTO({
      classOperationId: CreateClassOperationParameterDTO.validateRequiredString(
        props.classOperationId,
        "Class Operation ID",
      ),
      modelId: CreateClassOperationParameterDTO.validateRequiredString(
        props.modelId,
        "Model ID",
      ),
      layer: CreateClassOperationParameterDTO.validateLayer(props.layer),
      name: CreateClassOperationParameterDTO.validateName(props.name),
      typeClassElementId: props.typeClassElementId,
      typeLiteral: props.typeLiteral,
      multiplicityLower:
        CreateClassOperationParameterDTO.validateMultiplicityLower(
          props.multiplicityLower,
        ),
      multiplicityUpper: props.multiplicityUpper ?? "1",
      defaultValue: props.defaultValue,
      direction: CreateClassOperationParameterDTO.validateDirection(
        props.direction,
      ),
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

  private static validateLayer(layer: string): string {
    const validLayers = ["OA", "SA", "LA", "PA", "EPBS"];
    if (!validLayers.includes(layer)) {
      throw new Error(`Layer must be one of: ${validLayers.join(", ")}`);
    }
    return layer;
  }

  private static validateName(name: string): string {
    if (!name) throw new Error("Parameter name is required");
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Parameter name cannot be empty");
    if (trimmed.length > 255)
      throw new Error("Name cannot exceed 255 characters");
    return trimmed;
  }

  private static validateMultiplicityLower(lower?: number): number {
    const value = lower ?? 1;
    if (value < 0) throw new Error("Multiplicity lower must be >= 0");
    return value;
  }

  private static validateDirection(direction?: string): "IN" | "OUT" | "INOUT" {
    const valid = ["IN", "OUT", "INOUT"];
    if (direction && !valid.includes(direction)) {
      throw new Error(`Direction must be one of: ${valid.join(", ")}`);
    }
    return (direction ?? "IN") as any;
  }
}
