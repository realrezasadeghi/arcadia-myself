import { validateRequiredName } from "../../domain/policies/naming";

export type UpdateScenarioDTOProps = {
  id: string;
  name: string;
  description?: string;
};

export class UpdateScenarioDTO {
  public readonly id: string;
  public readonly name: string;
  public readonly description?: string;

  private constructor(props: UpdateScenarioDTOProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
  }

  static create(props: {
    id: string;
    name: string;
    description?: string;
  }): UpdateScenarioDTO {
    return new UpdateScenarioDTO({
      id: UpdateScenarioDTO.validateId(props.id),
      name: UpdateScenarioDTO.validateName(props.name),
      description: UpdateScenarioDTO.validateDescription(props.description),
    });
  }

  private static validateId(id: string): string {
    if (!id) {
      throw new Error("Scenario id is required");
    }
    const trimmed = id.trim();
    if (!trimmed) {
      throw new Error("Scenario ID cannot be empty");
    }
    if (trimmed.length > 255) {
      throw new Error("Scenario ID cannot exceed 255 characters");
    }
    return trimmed;
  }

  private static validateName(name: string): string {
    return validateRequiredName(name, {
      label: "Scenario name",
      maxLength: 100,
    });
  }

  private static validateDescription(description?: string): string | undefined {
    if (description === undefined || description === null) return undefined;

    const trimmed = description.trim();
    if (trimmed.length === 0) return undefined;

    if (trimmed.length > 500) {
      throw new Error("Scenario description cannot exceed 500 characters");
    }

    return trimmed;
  }
}
