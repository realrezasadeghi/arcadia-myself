export type UpdateDiagramDTOProps = {
  id: string;
  name: string;
  description?: string;
};

export class UpdateDiagramDTO {
  public readonly id: string;
  public readonly name: string;
  public readonly description?: string;

  private constructor(props: UpdateDiagramDTOProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
  }

  static create(props: {
    id: string;
    name?: string;
    description?: string;
  }): UpdateDiagramDTO {
    return new UpdateDiagramDTO({
      id: UpdateDiagramDTO.validateModelId(props.id),
      name: UpdateDiagramDTO.validateName(props.name),
      description: UpdateDiagramDTO.validateDescription(props.description),
    });
  }

  private static validateModelId(id: string): string {
    if (!id) {
      throw new Error("Diagram id is required");
    }
    const trimmed = id.trim();
    if (!trimmed) {
      throw new Error("Diagram ID cannot be empty");
    }
    if (trimmed.length > 255) {
      throw new Error("Diagram ID cannot exceed 255 characters");
    }
    return trimmed;
  }

  private static validateName(name?: string): string {
    if (!name) {
      throw new Error("Diagram name is required");
    }

    const trimmed = name.trim();

    if (!trimmed.length) {
      throw new Error("Diagram name cannot be empty");
    }

    if (trimmed.length > 100) {
      throw new Error("Diagram name cannot exceed 100 characters");
    }

    return trimmed;
  }

  private static validateDescription(description?: string): string | undefined {
    if (description === undefined || description === null) return undefined;

    const trimmed = description.trim();
    if (trimmed.length === 0) return undefined;

    if (trimmed.length > 500) {
      throw new Error("Diagram description cannot exceed 500 characters");
    }

    return trimmed;
  }
}
