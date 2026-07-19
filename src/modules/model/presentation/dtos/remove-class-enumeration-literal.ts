export type RemoveClassEnumerationLiteralDTOProps = {
  id: string;
};

export class RemoveClassEnumerationLiteralDTO {
  public readonly id: string;

  private constructor(props: RemoveClassEnumerationLiteralDTOProps) {
    this.id = props.id;
  }

  static create(props: RemoveClassEnumerationLiteralDTOProps): RemoveClassEnumerationLiteralDTO {
    return new RemoveClassEnumerationLiteralDTO({
      id: RemoveClassEnumerationLiteralDTO.validateRequiredString(props.id, "Enumeration Literal ID"),
    });
  }

  private static validateRequiredString(value: string, fieldName: string): string {
    if (!value) throw new Error(`${fieldName} is required`);
    const trimmed = value.trim();
    if (!trimmed) throw new Error(`${fieldName} cannot be empty`);
    return trimmed;
  }
}