import { DomainError } from "@/modules/shared/domain/error";
import { ValueObject } from "@/modules/shared/domain/value-object";

interface UsernameProps {
  value: string;
}

export class Username extends ValueObject<UsernameProps> {
  private constructor(props: UsernameProps) {
    super(props);
  }

  protected validate(props: UsernameProps): void {
    const trimmed = props.value?.trim() ?? "";

    if (!trimmed) {
      throw new DomainError("Username is required");
    }

    if (trimmed.length < 3 || trimmed.length > 30) {
      throw new DomainError("Username must be between 3 and 30 characters");
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      throw new DomainError(
        "Username can only contain letters, numbers, and underscores",
      );
    }
  }

  static create(value: string): Username {
    return new Username({ value });
  }

  get value() {
    return this.props.value;
  }

  equals(other: Username): boolean {
    return this.props.value === other.props.value;
  }

  toString(): string {
    return this.props.value.toString();
  }
}
