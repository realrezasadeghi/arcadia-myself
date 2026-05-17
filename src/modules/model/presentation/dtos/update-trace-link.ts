export type UpdateTraceLinkDTOProps = {
  id: string;
  description?: string;
};

export class UpdateTraceLinkDTO {
  public readonly id: string;
  public readonly description?: string;

  private constructor(props: UpdateTraceLinkDTOProps) {
    this.id = props.id;
    this.description = props.description;
  }

  static create(props: {
    id: string;
    description?: string;
  }): UpdateTraceLinkDTO {
    return new UpdateTraceLinkDTO({
      id: UpdateTraceLinkDTO.validateId(props.id),
      description: UpdateTraceLinkDTO.validateDescription(props.description),
    });
  }

  private static validateId(id: string): string {
    if (!id) {
      throw new Error("Trace link id is required");
    }
    const trimmed = id.trim();
    if (!trimmed) {
      throw new Error("Trace link ID cannot be empty");
    }
    if (trimmed.length > 255) {
      throw new Error("Trace link ID cannot exceed 255 characters");
    }
    return trimmed;
  }

  private static validateDescription(description?: string): string | undefined {
    if (description === undefined || description === null) return undefined;
    const trimmed = description.trim();
    if (trimmed.length === 0) return undefined;
    if (trimmed.length > 500) {
      throw new Error("Trace link description cannot exceed 500 characters");
    }
    return trimmed;
  }
}
