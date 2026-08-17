type ScenarioType = "OIS" | "SS" | "LS" | "PS";

export type CreateScenarioDTOProps = {
  modelId: string;
  name: string;
  description?: string;
  scenarioType: ScenarioType;
};

export class CreateScenarioDTO {
  public readonly modelId: string;
  public readonly name: string;
  public readonly description?: string;
  public readonly scenarioType: ScenarioType;

  private constructor(props: CreateScenarioDTOProps) {
    this.modelId = props.modelId;
    this.name = props.name;
    this.description = props.description;
    this.scenarioType = props.scenarioType;
  }

  static create(props: {
    modelId: string;
    name: string;
    description?: string;
    scenarioType: ScenarioType;
  }): CreateScenarioDTO {
    return new CreateScenarioDTO({
      modelId: CreateScenarioDTO.validateModelId(props.modelId),
      name: CreateScenarioDTO.validateName(props.name),
      description: CreateScenarioDTO.validateDescription(props.description),
      scenarioType: CreateScenarioDTO.validateType(props.scenarioType),
    });
  }

  private static validateType(type: string): ScenarioType {
    const validTypes: ScenarioType[] = ["OIS", "SS", "LS", "PS"];
    if (!validTypes.includes(type as ScenarioType)) {
      throw new Error(`Scenario type must be one of: ${validTypes.join(", ")}`);
    }
    return type as ScenarioType;
  }

  private static validateName(name: string): string {
    if (!name) throw new Error("Scenario name is required");
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Scenario name cannot be empty");
    if (trimmed.length > 100)
      throw new Error("Scenario name cannot exceed 100 characters");
    return trimmed;
  }

  private static validateModelId(modelId: string): string {
    if (!modelId) throw new Error("Model id is required");
    const trimmed = modelId.trim();
    if (!trimmed) throw new Error("Model ID cannot be empty");
    return trimmed;
  }

  private static validateDescription(description?: string): string | undefined {
    if (description === undefined || description === null) return undefined;
    const trimmed = description.trim();
    if (trimmed.length === 0) return undefined;
    if (trimmed.length > 500)
      throw new Error("Scenario description cannot exceed 500 characters");
    return trimmed;
  }
}
