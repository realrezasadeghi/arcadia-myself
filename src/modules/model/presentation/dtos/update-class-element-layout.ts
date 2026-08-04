export type UpdateClassElementLayoutDTOProps = {
  id: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

export class UpdateClassElementLayoutDTO {
  public readonly id: string;
  public readonly x?: number;
  public readonly y?: number;
  public readonly width?: number;
  public readonly height?: number;

  private constructor(props: UpdateClassElementLayoutDTOProps) {
    this.id = props.id;
    this.x = props.x;
    this.y = props.y;
    this.width = props.width;
    this.height = props.height;
  }

  static create(
    props: UpdateClassElementLayoutDTOProps,
  ): UpdateClassElementLayoutDTO {
    return new UpdateClassElementLayoutDTO({
      id: UpdateClassElementLayoutDTO.validateRequiredString(
        props.id,
        "Layout ID",
      ),
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height,
    });
  }

  private static validateRequiredString(
    value: string,
    fieldName: string,
  ): string {
    if (!value) throw new Error(`${fieldName} is required`);
    const trimmed = value.trim();
    if (!trimmed) throw new Error(`${fieldName} cannot be empty`);
    return trimmed;
  }
}
