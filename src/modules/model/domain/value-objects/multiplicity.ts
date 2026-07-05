import { ValueObject } from "@/modules/shared/domain/value-object";

interface MultiplicityProps {
  lower: number;
  upper: number | null;
}

/**
 * Multiplicity — Value Object
 *
 * UML multiplicity for class attributes and associations.
 * upper: null means unbounded (*).
 */
export class Multiplicity extends ValueObject<MultiplicityProps> {
  static readonly ONE = new Multiplicity({ lower: 1, upper: 1 });
  static readonly OPTIONAL = new Multiplicity({ lower: 0, upper: 1 });
  static readonly MANY = new Multiplicity({ lower: 0, upper: null });

  protected validate(props: MultiplicityProps): void {
    if (props.lower < 0) {
      throw new Error("Multiplicity lower bound cannot be negative");
    }
    if (props.upper !== null && props.upper < props.lower) {
      throw new Error(
        `Multiplicity upper bound (${props.upper}) cannot be less than lower bound (${props.lower})`,
      );
    }
  }

  static from(lower: number, upper: number | null = 1): Multiplicity {
    return new Multiplicity({ lower, upper });
  }

  static parse(value: string): Multiplicity {
    const trimmed = value.trim();
    if (trimmed === "*" || trimmed === "0..*") {
      return Multiplicity.MANY;
    }
    if (trimmed === "1") {
      return Multiplicity.ONE;
    }
    if (trimmed === "0..1") {
      return Multiplicity.OPTIONAL;
    }
    const rangeMatch = trimmed.match(/^(\d+)\.\.(\d+|\*)$/);
    if (rangeMatch) {
      const lower = Number.parseInt(rangeMatch[1], 10);
      const upper =
        rangeMatch[2] === "*" ? null : Number.parseInt(rangeMatch[2], 10);
      return new Multiplicity({ lower, upper });
    }
    const single = Number.parseInt(trimmed, 10);
    if (!Number.isNaN(single)) {
      return new Multiplicity({ lower: single, upper: single });
    }
    throw new Error(`Invalid multiplicity: ${value}`);
  }

  get lower(): number {
    return this.props.lower;
  }

  get upper(): number | null {
    return this.props.upper;
  }

  get isOptional(): boolean {
    return this.props.lower === 0;
  }

  get isUnbounded(): boolean {
    return this.props.upper === null;
  }

  get isSingle(): boolean {
    return this.props.lower === 1 && this.props.upper === 1;
  }

  /** Returns display string like "1", "0..1", "0..*", "2..5" */
  toString(): string {
    if (this.props.upper === null) {
      return this.props.lower === 0 ? "0..*" : `${this.props.lower}..*`;
    }
    if (this.props.lower === this.props.upper) {
      return String(this.props.lower);
    }
    return `${this.props.lower}..${this.props.upper}`;
  }
}
