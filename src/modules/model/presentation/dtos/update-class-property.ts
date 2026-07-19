export type UpdateClassPropertyDTOProps = {
  id: string;
  name?: string;
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

export class UpdateClassPropertyDTO {
  public readonly id: string;
  public readonly name?: string;
  public readonly typeClassElementId?: string | null;
  public readonly typeLiteral?: string;
  public readonly isStatic?: boolean;
  public readonly isReadOnly?: boolean;
  public readonly visibility?: "public" | "private" | "protected" | "package";
  public readonly multiplicityLower?: number;
  public readonly multiplicityUpper?: string;
  public readonly collectionKind?: "NONE" | "SET" | "BAG" | "SEQUENCE" | "ORDERED_SET";
  public readonly defaultValue?: string;
  public readonly ordering?: number;

  private constructor(props: UpdateClassPropertyDTOProps) {
    this.id = props.id;
    this.name = props.name;
    this.typeClassElementId = props.typeClassElementId;
    this.typeLiteral = props.typeLiteral;
    this.isStatic = props.isStatic;
    this.isReadOnly = props.isReadOnly;
    this.visibility = props.visibility;
    this.multiplicityLower = props.multiplicityLower;
    this.multiplicityUpper = props.multiplicityUpper;
    this.collectionKind = props.collectionKind;
    this.defaultValue = props.defaultValue;
    this.ordering = props.ordering;
  }

  static create(props: UpdateClassPropertyDTOProps): UpdateClassPropertyDTO {
    return new UpdateClassPropertyDTO({
      id: UpdateClassPropertyDTO.validateRequiredString(props.id, "Property ID"),
      name: props.name ? UpdateClassPropertyDTO.validateName(props.name) : undefined,
      typeClassElementId: props.typeClassElementId,
      typeLiteral: props.typeLiteral,
      isStatic: props.isStatic,
      isReadOnly: props.isReadOnly,
      visibility: props.visibility ? UpdateClassPropertyDTO.validateVisibility(props.visibility) : undefined,
      multiplicityLower: props.multiplicityLower !== undefined ? UpdateClassPropertyDTO.validateMultiplicityLower(props.multiplicityLower) : undefined,
      multiplicityUpper: props.multiplicityUpper,
      collectionKind: props.collectionKind ? UpdateClassPropertyDTO.validateCollectionKind(props.collectionKind) : undefined,
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

  private static validateName(name: string): string {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Property name cannot be empty");
    if (trimmed.length > 255) throw new Error("Name cannot exceed 255 characters");
    return trimmed;
  }

  private static validateVisibility(
    visibility: string
  ): "public" | "private" | "protected" | "package" {
    const valid = ["public", "private", "protected", "package"];
    if (!valid.includes(visibility)) {
      throw new Error(`Visibility must be one of: ${valid.join(", ")}`);
    }
    return visibility as any;
  }

  private static validateMultiplicityLower(lower: number): number {
    if (lower < 0) throw new Error("Multiplicity lower must be >= 0");
    return lower;
  }

  private static validateCollectionKind(
    kind: string
  ): "NONE" | "SET" | "BAG" | "SEQUENCE" | "ORDERED_SET" {
    const valid = ["NONE", "SET", "BAG", "SEQUENCE", "ORDERED_SET"];
    if (!valid.includes(kind)) {
      throw new Error(`Collection kind must be one of: ${valid.join(", ")}`);
    }
    return kind as any;
  }
}