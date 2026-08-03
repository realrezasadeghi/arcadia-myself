export type CreateClassEnumerationLiteralDTOProps = {
  classElementId: string;
  modelId: string;
  layer: string;
  name: string;
  value?: string;
  ordering?: number;
};

export class CreateClassEnumerationLiteralDTO {
  public readonly classElementId: string;
  public readonly modelId: string;
  public readonly layer: string;
  public readonly name: string;
  public readonly value: string;
  public readonly ordering: number;

  private constructor(props: CreateClassEnumerationLiteralDTOProps) {
    this.classElementId = props.classElementId;
    this.modelId = props.modelId;
    this.layer = props.layer;
    this.name = props.name;
    this.value = props.value ?? "";
    this.ordering = props.ordering ?? 0;
  }

  static create(props: CreateClassEnumerationLiteralDTOProps): CreateClassEnumerationLiteralDTO {
    return new CreateClassEnumerationLiteralDTO({
      classElementId: CreateClassEnumerationLiteralDTO.validateRequiredString(props.classElementId, "Class Element ID"),
      modelId: CreateClassEnumerationLiteralDTO.validateRequiredString(props.modelId, "Model ID"),
      layer: CreateClassEnumerationLiteralDTO.validateLayer(props.layer),
      name: CreateClassEnumerationLiteralDTO.validateName(props.name),
      value: props.value,
      ordering: props.ordering,
    });
  }

  private static validateRequiredString(value: string, fieldName: string): string {
    if (!value) throw new Error(`${fieldName} is required`);
    const trimmed = value.trim();
    if (!trimmed) throw new Error(`${fieldName} cannot be empty`);
    return trimmed;
  }

  private static validateLayer(layer: string): string {
    const validLayers = ["OA", "SA", "LA", "PA", "EPBS"];
    if (!validLayers.includes(layer)) {
      throw new Error(`Layer must be one of: ${validLayers.join(", ")}`);
    }
    return layer;
  }

  private static validateName(name: string): string {
    if (!name) throw new Error("Enumeration literal name is required");
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Enumeration literal name cannot be empty");
    if (trimmed.length > 255) throw new Error("Name cannot exceed 255 characters");
    return trimmed;
  }
}
