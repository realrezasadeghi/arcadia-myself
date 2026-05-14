export type UpdateProjectDTOProps = {
  id: number;
  name?: string;
  description?: string;
};

export class UpdateProjectDTO {
  public readonly id: number;
  public readonly name?: string;
  public readonly description?: string;

  private constructor(props: UpdateProjectDTOProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
  }

  static create(props: {
    id: number;
    name?: string;
    description?: string;
  }): UpdateProjectDTO {
    return new UpdateProjectDTO({
      id: UpdateProjectDTO.validateProjectId(props.id),
      name: UpdateProjectDTO.validateName(props.name),
      description: UpdateProjectDTO.validateDescription(props.description),
    });
  }

  private static validateProjectId(projectId: unknown): number {
    if (
      typeof projectId === "number" &&
      Number.isFinite(projectId) &&
      projectId > 0
    ) {
      return projectId;
    }

    if (
      typeof projectId === "string" &&
      projectId.trim() !== "" &&
      !Number.isNaN(Number(projectId))
    ) {
      const num = Number(projectId);
      if (num > 0) return num;
    }

    throw new Error("Project id is't valid");
  }

  private static validateName(name?: string): string | undefined {
    if (name === undefined || name === null) return undefined;

    const trimmed = name.trim();
    if (trimmed.length === 0) return undefined;

    if (trimmed.length > 100) {
      throw new Error("New project name can't more than 100 chars.");
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
