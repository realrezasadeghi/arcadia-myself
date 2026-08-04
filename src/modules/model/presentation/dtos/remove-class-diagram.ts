export type RemoveClassDiagramDTOProps = {
  id: string;
};

export class RemoveClassDiagramDTO {
  public readonly id: string;

  private constructor(props: RemoveClassDiagramDTOProps) {
    this.id = props.id;
  }

  static create(props: RemoveClassDiagramDTOProps): RemoveClassDiagramDTO {
    return new RemoveClassDiagramDTO({
      id: RemoveClassDiagramDTO.validateRequiredString(props.id, "Diagram ID"),
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
