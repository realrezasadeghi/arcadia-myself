export type UpdateModelDTOProps = {
  modelId: string;
  name?: string;
  description?: string;
};

export class UpdateModelDTO {
  public readonly modelId: string;
  public readonly name?: string;
  public readonly description?: string;

  private constructor(props: UpdateModelDTOProps) {
    this.modelId = props.modelId;
    this.name = props.name;
    this.description = props.description;
  }

  static create(props: {
    modelId: string;
    name?: string;
    description?: string;
  }): UpdateModelDTO {
    return new UpdateModelDTO({
      modelId: UpdateModelDTO.validateModelId(props.modelId),
      name: UpdateModelDTO.validateName(props.name),
      description: UpdateModelDTO.validateDescription(props.description),
    });
  }

  private static validateModelId(modelId: string): string {
    if (!modelId) {
      throw new Error("Model id is required");
    }
    const trimmed = modelId.trim();
    if (!trimmed) {
      throw new Error("Model ID cannot be empty");
    }
    if (trimmed.length > 255) {
      throw new Error("Model ID cannot exceed 255 characters");
    }
    return trimmed;
  }

  private static validateName(name?: string): string | undefined {
    if (name === undefined || name === null) return undefined;

    const trimmed = name.trim();
    if (trimmed.length === 0) return undefined; // treat empty string as "no update"

    if (trimmed.length > 100) {
      throw new Error("Model name cannot exceed 100 characters");
    }

    return trimmed;
  }

  private static validateDescription(description?: string): string | undefined {
    if (description === undefined || description === null) return undefined;

    const trimmed = description.trim();
    if (trimmed.length === 0) return undefined;

    if (trimmed.length > 500) {
      throw new Error("Model description cannot exceed 500 characters");
    }

    return trimmed;
  }
}
