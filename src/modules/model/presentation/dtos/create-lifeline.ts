export type CreateLifelineDTOProps = {
  scenarioId: string;
  name: string;
  representedElementType: string;
  representedElementId?: string;
  representedElementExternalId?: string;
  columnIndex: number;
};

export class CreateLifelineDTO {
  public readonly scenarioId: string;
  public readonly name: string;
  public readonly representedElementType: string;
  public readonly representedElementId?: string;
  public readonly representedElementExternalId?: string;
  public readonly columnIndex: number;

  private constructor(props: CreateLifelineDTOProps) {
    this.scenarioId = props.scenarioId;
    this.name = props.name;
    this.representedElementType = props.representedElementType;
    this.representedElementId = props.representedElementId;
    this.representedElementExternalId = props.representedElementExternalId;
    this.columnIndex = props.columnIndex;
  }

  static create(props: {
    scenarioId: string;
    name: string;
    representedElementType: string;
    representedElementId?: string;
    representedElementExternalId?: string;
    columnIndex: number;
  }): CreateLifelineDTO {
    return new CreateLifelineDTO({
      scenarioId: CreateLifelineDTO.validateScenarioId(props.scenarioId),
      name: CreateLifelineDTO.validateName(props.name),
      representedElementType: CreateLifelineDTO.validateElementType(
        props.representedElementType,
      ),
      representedElementId: props.representedElementId,
      representedElementExternalId: props.representedElementExternalId,
      columnIndex: CreateLifelineDTO.validateColumnIndex(props.columnIndex),
    });
  }

  private static validateScenarioId(scenarioId: string): string {
    if (!scenarioId) throw new Error("Scenario id is required");
    return scenarioId.trim();
  }

  private static validateName(name: string): string {
    if (!name) throw new Error("Lifeline name is required");
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Lifeline name cannot be empty");
    if (trimmed.length > 100)
      throw new Error("Lifeline name cannot exceed 100 characters");
    return trimmed;
  }

  private static validateElementType(elementType: string): string {
    const validTypes = [
      "ACTOR",
      "FUNCTION",
      "COMPONENT",
      "CLASS_ELEMENT",
      "EXTERNAL",
    ];
    if (!validTypes.includes(elementType)) {
      throw new Error(`Element type must be one of: ${validTypes.join(", ")}`);
    }
    return elementType;
  }

  private static validateColumnIndex(columnIndex: number): number {
    if (columnIndex < 0) throw new Error("Column index must be non-negative");
    return columnIndex;
  }
}
