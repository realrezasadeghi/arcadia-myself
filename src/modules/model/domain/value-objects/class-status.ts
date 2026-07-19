import { ValueObject } from "@/modules/shared/domain/value-object";

export type ClassStatusValue = "DRAFT" | "VALIDATED" | "DEPRECATED";

interface ClassStatusProps {
  value: ClassStatusValue;
}

const ALL_STATUSES: ClassStatusValue[] = ["DRAFT", "VALIDATED", "DEPRECATED"];

export class ClassStatus extends ValueObject<ClassStatusProps> {
  static readonly DRAFT = new ClassStatus({ value: "DRAFT" });
  static readonly VALIDATED = new ClassStatus({ value: "VALIDATED" });
  static readonly DEPRECATED = new ClassStatus({ value: "DEPRECATED" });

  private static readonly ALL: ClassStatus[] = [
    ClassStatus.DRAFT,
    ClassStatus.VALIDATED,
    ClassStatus.DEPRECATED,
  ];

  protected validate(props: ClassStatusProps): void {
    if (!ALL_STATUSES.includes(props.value)) {
      throw new Error(`Invalid class status: ${props.value}`);
    }
  }

  static from(value: string): ClassStatus {
    const found = ClassStatus.ALL.find((s) => s.value === value);
    if (!found) throw new Error(`Invalid class status: ${value}`);
    return found;
  }

  get value(): ClassStatusValue {
    return this.props.value;
  }
  toString(): string {
    return this.props.value;
  }
}