export type RemoveClassElementDTOProps = {
  id: string;
};

export class RemoveClassElementDTO {
  public readonly id: string;

  private constructor(props: RemoveClassElementDTOProps) {
    this.id = props.id;
  }

  static create(props: RemoveClassElementDTOProps): RemoveClassElementDTO {
    return new RemoveClassElementDTO({
      id: RemoveClassElementDTO.validateRequiredString(props.id, "Element ID"),
    });
  }

  private static validateRequiredString(value: string, fieldName: string): string {
    if (!value) throw new Error(`${fieldName} is required`);
    const trimmed = value.trim();
    if (!trimmed) throw new Error(`${fieldName} cannot be empty`);
    return trimmed;
  }
}
