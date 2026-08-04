export type RemoveClassRelationshipDTOProps = {
  id: string;
};

export class RemoveClassRelationshipDTO {
  public readonly id: string;

  private constructor(props: RemoveClassRelationshipDTOProps) {
    this.id = props.id;
  }

  static create(
    props: RemoveClassRelationshipDTOProps,
  ): RemoveClassRelationshipDTO {
    return new RemoveClassRelationshipDTO({
      id: RemoveClassRelationshipDTO.validateRequiredString(
        props.id,
        "Relationship ID",
      ),
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
}
