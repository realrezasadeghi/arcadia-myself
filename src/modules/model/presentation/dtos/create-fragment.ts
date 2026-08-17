export type CreateFragmentDTOProps = {
  scenarioId: string;
  name: string;
  operator: string;
  guard?: string;
  rowIndex: number;
  columnIndex: number;
  spanColumns?: number;
};

export class CreateFragmentDTO {
  public readonly scenarioId: string;
  public readonly name: string;
  public readonly operator: string;
  public readonly guard?: string;
  public readonly rowIndex: number;
  public readonly columnIndex: number;
  public readonly spanColumns?: number;

  private constructor(props: CreateFragmentDTOProps) {
    this.scenarioId = props.scenarioId;
    this.name = props.name;
    this.operator = props.operator;
    this.guard = props.guard;
    this.rowIndex = props.rowIndex;
    this.columnIndex = props.columnIndex;
    this.spanColumns = props.spanColumns;
  }

  static create(props: {
    scenarioId: string;
    name: string;
    operator: string;
    guard?: string;
    rowIndex: number;
    columnIndex: number;
    spanColumns?: number;
  }): CreateFragmentDTO {
    return new CreateFragmentDTO({
      scenarioId: CreateFragmentDTO.validateScenarioId(props.scenarioId),
      name: CreateFragmentDTO.validateName(props.name),
      operator: CreateFragmentDTO.validateOperator(props.operator),
      guard: props.guard,
      rowIndex: props.rowIndex,
      columnIndex: props.columnIndex,
      spanColumns: props.spanColumns,
    });
  }

  private static validateScenarioId(scenarioId: string): string {
    if (!scenarioId) throw new Error("Scenario id is required");
    return scenarioId.trim();
  }

  private static validateName(name: string): string {
    if (!name) throw new Error("Fragment name is required");
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Fragment name cannot be empty");
    if (trimmed.length > 100)
      throw new Error("Fragment name cannot exceed 100 characters");
    return trimmed;
  }

  private static validateOperator(operator: string): string {
    const validOperators = [
      "alt",
      "opt",
      "loop",
      "break",
      "par",
      "critical",
      "assert",
      "neg",
      "ignore",
      "consider",
      "strict",
      "seq",
    ];
    if (!validOperators.includes(operator)) {
      throw new Error(
        `Fragment operator must be one of: ${validOperators.join(", ")}`,
      );
    }
    return operator;
  }
}
