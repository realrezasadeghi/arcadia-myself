export type UpdateClassRelationshipLayoutDTOProps = {
  id: string;
  labelX?: number | null;
  labelY?: number | null;
  waypoints?: Array<{ x: number; y: number }>;
};

export class UpdateClassRelationshipLayoutDTO {
  public readonly id: string;
  public readonly labelX?: number | null;
  public readonly labelY?: number | null;
  public readonly waypoints?: Array<{ x: number; y: number }>;

  private constructor(props: UpdateClassRelationshipLayoutDTOProps) {
    this.id = props.id;
    this.labelX = props.labelX;
    this.labelY = props.labelY;
    this.waypoints = props.waypoints;
  }

  static create(props: UpdateClassRelationshipLayoutDTOProps): UpdateClassRelationshipLayoutDTO {
    return new UpdateClassRelationshipLayoutDTO({
      id: UpdateClassRelationshipLayoutDTO.validateRequiredString(props.id, "Layout ID"),
      labelX: props.labelX,
      labelY: props.labelY,
      waypoints: props.waypoints,
    });
  }

  private static validateRequiredString(value: string, fieldName: string): string {
    if (!value) throw new Error(`${fieldName} is required`);
    const trimmed = value.trim();
    if (!trimmed) throw new Error(`${fieldName} cannot be empty`);
    return trimmed;
  }
}