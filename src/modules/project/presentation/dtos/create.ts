export type CreateProjectDTOProps = {
  name: string;
  description?: string;
};

export class CreateProjectDTO {
  public readonly name: string;
  public readonly description?: string;

  private constructor(props: CreateProjectDTOProps) {
    this.name = props.name;
    this.description = props.description;
  }

  static create(props: Record<string, unknown>): CreateProjectDTO {
    const rawName = typeof props.name === "string" ? props.name : "";
    const rawDescription =
      typeof props.description === "string" ? props.description : undefined;

    return new CreateProjectDTO({
      name: CreateProjectDTO.validateName(rawName),
      description: CreateProjectDTO.validateDescription(rawDescription),
    });
  }

  private static validateName(name: string): string {
    const trimmed = name.trim();

    if (!trimmed) {
      throw new Error("Project name can't empty");
    }

    if (trimmed.length > 100) {
      throw new Error("Project name can't more than 100 chars.");
    }

    return trimmed;
  }

  private static validateDescription(description?: string): string | undefined {
    if (description === undefined || description === null) return undefined;

    const trimmed = description.trim();

    if (trimmed.length === 0) return undefined;

    if (trimmed.length > 500) {
      throw new Error("New description can't more than 500 chars.");
    }

    return trimmed;
  }
}
