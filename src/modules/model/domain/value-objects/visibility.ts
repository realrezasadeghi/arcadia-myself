import { ValueObject } from "@/modules/shared/domain/value-object";

export type VisibilityValue = "public" | "private" | "protected" | "package";

interface VisibilityProps {
  value: VisibilityValue;
}

const SYMBOLS: Record<VisibilityValue, string> = {
  public: "+",
  private: "-",
  protected: "#",
  package: "~",
};

const LABELS: Record<VisibilityValue, string> = {
  public: "Public",
  private: "Private",
  protected: "Protected",
  package: "Package",
};

const LABELS_FA: Record<VisibilityValue, string> = {
  public: "عمومی",
  private: "خصوصی",
  protected: "محافظت‌شده",
  package: "بسته‌ای",
};

/**
 * Visibility — Value Object
 *
 * UML visibility for class attributes and operations.
 */
export class Visibility extends ValueObject<VisibilityProps> {
  static readonly PUBLIC = new Visibility({ value: "public" });
  static readonly PRIVATE = new Visibility({ value: "private" });
  static readonly PROTECTED = new Visibility({ value: "protected" });
  static readonly PACKAGE = new Visibility({ value: "package" });

  private static readonly ALL = [
    Visibility.PUBLIC,
    Visibility.PRIVATE,
    Visibility.PROTECTED,
    Visibility.PACKAGE,
  ];

  protected validate(props: VisibilityProps): void {
    if (!SYMBOLS[props.value]) {
      throw new Error(`Invalid visibility: ${props.value}`);
    }
  }

  static from(value: string): Visibility {
    const found = Visibility.ALL.find((v) => v.value === value);
    if (!found) throw new Error(`Invalid visibility: ${value}`);
    return found;
  }

  static all(): Visibility[] {
    return [...Visibility.ALL];
  }

  get value(): VisibilityValue {
    return this.props.value;
  }

  get symbol(): string {
    return SYMBOLS[this.props.value];
  }

  get label(): string {
    return LABELS[this.props.value];
  }

  get labelFa(): string {
    return LABELS_FA[this.props.value];
  }

  /** Returns display string like "+ name: Type" */
  formatPrefix(): string {
    return `${this.symbol} `;
  }

  toString(): string {
    return this.props.value;
  }
}
