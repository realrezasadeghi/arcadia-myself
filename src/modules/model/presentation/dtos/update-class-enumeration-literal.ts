export type UpdateClassEnumerationLiteralDTOProps = {
  id: string;
  name?: string;
  value?: string;
  ordering?: number;
};

export class UpdateClassEnumerationLiteralDTO {
  public readonly id: string;
  public readonly name?: string;
  public readonly value?: string;
  public readonly ordering?: number;

  private constructor(props: UpdateClassEnumerationLiteralDTOProps) {
    this.id = props.id;
    this.name = props.name;
    this.value = props.value;
    this.ordering = props.ordering;
  }

  static create(props: UpdateClassEnumerationLiteralDTOProps): UpdateClassEnumerationLiteralDTO {
    return new UpdateClassEnumerationLiteralDTO({
      id: UpdateClassEnumerationLiteralDTO.validateRequiredString(props.id, "Enumeration Literal ID"),
      name: props.name ? UpdateClassEnumerationLiteralDTO.validateName(props.name) : undefined,
      value: props.value,
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
    if (!trimmed) throw new Error("Enumeration literal name cannot be empty");
    if (trimmed.length > 255) throw new Error("Name cannot exceed 255 characters");
    return trimmed;
  }
}