export type UpdateMeDTOProps = {
  name: string;
};

export class UpdateMeDTO {
  public readonly name: string;

  private constructor(props: UpdateMeDTOProps) {
    this.name = props.name;
  }

  static create(data: { name: string }): UpdateMeDTO {
    const name = UpdateMeDTO.validateName(data.name);
    return new UpdateMeDTO({ name });
  }

  private static validateName(name: string): string {
    const trimmed = name.trim();

    if (!trimmed) {
      throw new Error("Name is required.");
    }

    if (trimmed.length < 2) {
      throw new Error("Name must be at least 2 characters.");
    }

    if (trimmed.length > 100) {
      throw new Error("Name must be at most 100 characters.");
    }

    return trimmed;
  }
}
