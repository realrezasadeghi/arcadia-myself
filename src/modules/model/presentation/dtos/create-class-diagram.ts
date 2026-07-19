export type CreateClassDiagramDTOProps = {
  modelId: string;
  layer: string;
  name: string;
  description?: string;
};

export class CreateClassDiagramDTO {
  public readonly modelId: string;
  public readonly layer: string;
  public readonly name: string;
  public readonly description?: string;

  private constructor(props: CreateClassDiagramDTOProps) {
    this.modelId = props.modelId;
    this.layer = props.layer;
    this.name = props.name;
    this.description = props.description;
  }

  static create(props: CreateClassDiagramDTOProps): CreateClassDiagramDTO {
    return new CreateClassDiagramDTO({
      modelId: CreateClassDiagramDTO.validateModelId(props.modelId),
      layer: CreateClassDiagramDTO.validateLayer(props.layer),
      name: CreateClassDiagramDTO.validateName(props.name),
      description: CreateClassDiagramDTO.validateDescription(props.description),
    });
  }

  private static validateModelId(modelId: string): string {
    if (!modelId) throw new Error("Model ID is required");
    const trimmed = modelId.trim();
    if (!trimmed) throw new Error("Model ID cannot be empty");
    return trimmed;
  }

  private static validateLayer(layer: string): string {
    if (!layer) throw new Error("Layer is required");
    const validLayers = ["OA", "SA", "LA", "PA", "EPBS"];
    if (!validLayers.includes(layer)) {
      throw new Error(`Layer must be one of: ${validLayers.join(", ")}`);
    }
    return layer;
  }

  private static validateName(name: string): string {
    if (!name) throw new Error("Class diagram name is required");
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Class diagram name cannot be empty");
    if (trimmed.length > 255) throw new Error("Name cannot exceed 255 characters");
    return trimmed;
  }

  private static validateDescription(description?: string): string | undefined {
    if (description === undefined || description === null) return undefined;
    const trimmed = description.trim();
    if (trimmed.length === 0) return undefined;
    if (trimmed.length > 500) throw new Error("Description cannot exceed 500 characters");
    return trimmed;
  }
}