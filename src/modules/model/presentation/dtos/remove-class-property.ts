export type RemoveClassPropertyDTOProps = {
  id: string;
};

export class RemoveClassPropertyDTO {
  public readonly id: string;

  private constructor(props: RemoveClassPropertyDTOProps) {
    this.id = props.id;
  }

  static create(props: RemoveClassPropertyDTOProps): RemoveClassPropertyDTO {
    return new RemoveClassPropertyDTO({
      id: RemoveClassPropertyDTO.validateRequiredString(props.id, "Property ID"),
    });
  }

  private static validateRequiredString(value: string, fieldName: string): string {
    if (!value) throw new Error(`${fieldName} is required`);
    const trimmed = value.trim();
    if (!trimmed) throw new Error(`${fieldName} cannot be empty`);
    return trimmed;
  }
}