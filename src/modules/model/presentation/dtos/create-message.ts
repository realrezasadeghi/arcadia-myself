export type CreateMessageDTOProps = {
  scenarioId: string;
  name: string;
  kind: string;
  sourceLifelineId: string;
  targetLifelineId: string;
  executionOrder: number;
  exchangedItemId?: string;
};

export class CreateMessageDTO {
  public readonly scenarioId: string;
  public readonly name: string;
  public readonly kind: string;
  public readonly sourceLifelineId: string;
  public readonly targetLifelineId: string;
  public readonly executionOrder: number;
  public readonly exchangedItemId?: string;

  private constructor(props: CreateMessageDTOProps) {
    this.scenarioId = props.scenarioId;
    this.name = props.name;
    this.kind = props.kind;
    this.sourceLifelineId = props.sourceLifelineId;
    this.targetLifelineId = props.targetLifelineId;
    this.executionOrder = props.executionOrder;
    this.exchangedItemId = props.exchangedItemId;
  }

  static create(props: {
    scenarioId: string;
    name: string;
    kind: string;
    sourceLifelineId: string;
    targetLifelineId: string;
    executionOrder: number;
    exchangedItemId?: string;
  }): CreateMessageDTO {
    return new CreateMessageDTO({
      scenarioId: CreateMessageDTO.validateScenarioId(props.scenarioId),
      name: CreateMessageDTO.validateName(props.name),
      kind: CreateMessageDTO.validateKind(props.kind),
      sourceLifelineId: CreateMessageDTO.validateLifelineId(
        props.sourceLifelineId,
        "Source",
      ),
      targetLifelineId: CreateMessageDTO.validateLifelineId(
        props.targetLifelineId,
        "Target",
      ),
      executionOrder: props.executionOrder,
      exchangedItemId: props.exchangedItemId,
    });
  }

  private static validateScenarioId(scenarioId: string): string {
    if (!scenarioId) throw new Error("Scenario id is required");
    return scenarioId.trim();
  }

  private static validateName(name: string): string {
    if (!name) throw new Error("Message name is required");
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Message name cannot be empty");
    if (trimmed.length > 255)
      throw new Error("Message name cannot exceed 255 characters");
    return trimmed;
  }

  private static validateKind(kind: string): string {
    const validKinds = [
      "CALL",
      "CREATE",
      "DELETE",
      "RETURN",
      "REPLY",
      "FOUND",
      "LOST",
    ];
    if (!validKinds.includes(kind)) {
      throw new Error(`Message kind must be one of: ${validKinds.join(", ")}`);
    }
    return kind;
  }

  private static validateLifelineId(lifelineId: string, label: string): string {
    if (!lifelineId) throw new Error(`${label} lifeline id is required`);
    return lifelineId.trim();
  }

  get isSelfMessage(): boolean {
    return this.sourceLifelineId === this.targetLifelineId;
  }
}
