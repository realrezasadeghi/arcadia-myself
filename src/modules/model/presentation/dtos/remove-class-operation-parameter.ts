export type RemoveClassOperationParameterDTOProps = {
  id: string;
};

export class RemoveClassOperationParameterDTO {
  public readonly id: string;

  private constructor(props: RemoveClassOperationParameterDTOProps) {
    this.id = props.id;
  }

  static create(props: RemoveClassOperationParameterDTOProps): RemoveClassOperationParameterDTO {
    return new RemoveClassOperationParameterDTO({
      id: RemoveClassOperationParameterDTO.validateRequiredString(props.id, "Parameter ID"),
    });
  }

  private static validateRequiredString(value: string, fieldName: string): string {
    if (!value) throw new Error(`${fieldName} is required`);
    const trimmed = value.trim();
    if (!trimmed) throw new Error(`${fieldName} cannot be empty`);
    return trimmed;
  }
}