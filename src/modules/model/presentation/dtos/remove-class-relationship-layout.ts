export type RemoveClassRelationshipLayoutDTOProps = {
  id: string;
};

export class RemoveClassRelationshipLayoutDTO {
  public readonly id: string;

  private constructor(props: RemoveClassRelationshipLayoutDTOProps) {
    this.id = props.id;
  }

  static create(props: RemoveClassRelationshipLayoutDTOProps): RemoveClassRelationshipLayoutDTO {
    return new RemoveClassRelationshipLayoutDTO({
      id: RemoveClassRelationshipLayoutDTO.validateRequiredString(props.id, "Relationship Layout ID"),
    });
  }

  private static validateRequiredString(value: string, fieldName: string): string {
    if (!value) throw new Error(`${fieldName} is required`);
    const trimmed = value.trim();
    if (!trimmed) throw new Error(`${fieldName} cannot be empty`);
    return trimmed;
  }
}