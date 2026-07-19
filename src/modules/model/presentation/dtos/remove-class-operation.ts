export type RemoveClassOperationDTOProps = {
  id: string;
};

export class RemoveClassOperationDTO {
  public readonly id: string;

  private constructor(props: RemoveClassOperationDTOProps) {
    this.id = props.id;
  }

  static create(props: RemoveClassOperationDTOProps): RemoveClassOperationDTO {
    return new RemoveClassOperationDTO({
      id: RemoveClassOperationDTO.validateRequiredString(props.id, "Operation ID"),
    });
  }

  private static validateRequiredString(value: string, fieldName: string): string {
    if (!value) throw new Error(`${fieldName} is required`);
    const trimmed = value.trim();
    if (!trimmed) throw new Error(`${fieldName} cannot be empty`);
    return trimmed;
  }
}