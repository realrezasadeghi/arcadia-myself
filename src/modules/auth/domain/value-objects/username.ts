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
      throw new DomainError("نام کاربری الزامی است");
    }

    if (trimmed.length < 3 || trimmed.length > 30) {
      throw new DomainError("نام کاربری باید بین ۳ تا ۳۰ کاراکتر باشد");
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      throw new DomainError(
        "نام کاربری فقط می‌تواند شامل حروف انگلیسی، اعداد و زیرخط باشد",
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
