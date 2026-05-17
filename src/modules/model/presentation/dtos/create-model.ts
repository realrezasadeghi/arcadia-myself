export type CreateModelDTOProps = {
  name: string;
  layer: string;
  projectId: string;
  description?: string;
};

export class CreateModelDTO {
  public readonly name: string;
  public readonly layer: string;
  public readonly projectId: string;
  public readonly description?: string;

  private constructor(props: CreateModelDTOProps) {
    this.name = props.name;
    this.layer = props.layer;
    this.projectId = props.projectId;
    this.description = props.description;
  }

  static create(props: {
    name: string;
    layer: string;
    projectId: string;
    description?: string;
  }): CreateModelDTO {
    return new CreateModelDTO({
      name: CreateModelDTO.validateName(props.name),
      layer: CreateModelDTO.validateLayer(props.layer),
      projectId: CreateModelDTO.validateProjectId(props.projectId),
      description: CreateModelDTO.validateDescription(props.description),
    });
  }

  private static validateName(name: string): string {
    const trimmed = name.trim();

    if (!trimmed) {
      throw new Error("Model name cannot be empty");
    }

    if (trimmed.length > 100) {
      throw new Error("Model name cannot exceed 100 characters");
    }

    return trimmed;
  }

  private static validateProjectId(projectId: string): string {
    const trimmed = projectId.trim();

    if (!trimmed) {
      throw new Error("Project ID cannot be empty");
    }

    if (trimmed.length > 255) {
      throw new Error("Project ID cannot exceed 255 characters");
    }

    return trimmed;
  }

  private static validateDescription(description?: string): string | undefined {
    if (description === undefined || description === null) return undefined;

    const trimmed = description?.trim();

    if (trimmed.length === 0) return undefined;

    if (trimmed.length > 500) {
      throw new Error("Model description cannot exceed 500 characters");
    }

    return trimmed;
  }

  private static validateLayer(layer: string): string {
    const validLayers: string[] = ["OA", "SA", "LA", "PA"];

    if (!validLayers.includes(layer)) {
      throw new Error(`Layer must be one of: ${validLayers.join(", ")}`);
    }

    return layer;
  }
}
