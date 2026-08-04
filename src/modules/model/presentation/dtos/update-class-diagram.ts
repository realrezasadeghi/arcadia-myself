export type UpdateClassDiagramDTOProps = {
  id: string;
  modelId: string;
  name?: string;
  description?: string;
};

export class UpdateClassDiagramDTO {
  public readonly id: string;
  public readonly name?: string;
  public readonly description?: string;

  private constructor(props: UpdateClassDiagramDTOProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
  }

  static create(props: UpdateClassDiagramDTOProps): UpdateClassDiagramDTO {
    return new UpdateClassDiagramDTO({
      id: UpdateClassDiagramDTO.validateRequiredString(
        props.id,
        "Class Diagram ID",
      ),
      modelId: props.modelId,
      name: props.name
        ? UpdateClassDiagramDTO.validateName(props.name)
        : undefined,
      description: UpdateClassDiagramDTO.validateDescription(props.description),
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

  private static validateName(name: string): string {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Class diagram name cannot be empty");
    if (trimmed.length > 255)
      throw new Error("Name cannot exceed 255 characters");
    return trimmed;
  }

  private static validateDescription(description?: string): string | undefined {
    if (description === undefined || description === null) return undefined;
    const trimmed = description.trim();
    if (trimmed.length === 0) return undefined;
    if (trimmed.length > 500)
      throw new Error("Description cannot exceed 500 characters");
    return trimmed;
  }
}
