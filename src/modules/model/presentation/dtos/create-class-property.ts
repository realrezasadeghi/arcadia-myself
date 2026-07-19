export type CreateClassPropertyDTOProps = {
  classElementId: string;
  modelId: string;
  layer: string;
  name: string;
  typeClassElementId?: string | null;
  typeLiteral?: string;
  isStatic?: boolean;
  isReadOnly?: boolean;
  visibility?: "public" | "private" | "protected" | "package";
  multiplicityLower?: number;
  multiplicityUpper?: string;
  collectionKind?: "NONE" | "SET" | "BAG" | "SEQUENCE" | "ORDERED_SET";
  defaultValue?: string;
  ordering?: number;
};

export class CreateClassPropertyDTO {
  public readonly classElementId: string;
  public readonly modelId: string;
  public readonly layer: string;
  public readonly name: string;
  public readonly typeClassElementId: string | null;
  public readonly typeLiteral: string;
  public readonly isStatic: boolean;
  public readonly isReadOnly: boolean;
  public readonly visibility: "public" | "private" | "protected" | "package";
  public readonly multiplicityLower: number;
  public readonly multiplicityUpper: string;
  public readonly collectionKind: "NONE" | "SET" | "BAG" | "SEQUENCE" | "ORDERED_SET";
  public readonly defaultValue: string;
  public readonly ordering: number;

  private constructor(props: CreateClassPropertyDTOProps) {
    this.classElementId = props.classElementId;
    this.modelId = props.modelId;
    this.layer = props.layer;
    this.name = props.name;
    this.typeClassElementId = props.typeClassElementId ?? null;
    this.typeLiteral = props.typeLiteral ?? "";
    this.isStatic = props.isStatic ?? false;
    this.isReadOnly = props.isReadOnly ?? false;
    this.visibility = props.visibility ?? "public";
    this.multiplicityLower = props.multiplicityLower ?? 1;
    this.multiplicityUpper = props.multiplicityUpper ?? "1";
    this.collectionKind = props.collectionKind ?? "NONE";
    this.defaultValue = props.defaultValue ?? "";
    this.ordering = props.ordering ?? 0;
  }

  static create(props: CreateClassPropertyDTOProps): CreateClassPropertyDTO {
    return new CreateClassPropertyDTO({
      classElementId: CreateClassPropertyDTO.validateRequiredString(props.classElementId, "Class Element ID"),
      modelId: CreateClassPropertyDTO.validateRequiredString(props.modelId, "Model ID"),
      layer: CreateClassPropertyDTO.validateLayer(props.layer),
      name: CreateClassPropertyDTO.validateName(props.name),
      typeClassElementId: props.typeClassElementId,
      typeLiteral: props.typeLiteral,
      isStatic: props.isStatic,
      isReadOnly: props.isReadOnly,
      visibility: CreateClassPropertyDTO.validateVisibility(props.visibility),
      multiplicityLower: CreateClassPropertyDTO.validateMultiplicityLower(props.multiplicityLower),
      multiplicityUpper: props.multiplicityUpper ?? "1",
      collectionKind: CreateClassPropertyDTO.validateCollectionKind(props.collectionKind),
      defaultValue: props.defaultValue,
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
    if (!name) throw new Error("Property name is required");
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Property name cannot be empty");
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

  private static validateMultiplicityLower(lower?: number): number {
    const value = lower ?? 1;
    if (value < 0) throw new Error("Multiplicity lower must be >= 0");
    return value;
  }

  private static validateCollectionKind(
    kind?: string
  ): "NONE" | "SET" | "BAG" | "SEQUENCE" | "ORDERED_SET" {
    const valid = ["NONE", "SET", "BAG", "SEQUENCE", "ORDERED_SET"];
    if (kind && !valid.includes(kind)) {
      throw new Error(`Collection kind must be one of: ${valid.join(", ")}`);
    }
    return (kind ?? "NONE") as any;
  }
}