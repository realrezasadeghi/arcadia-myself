import { ValueObject } from "@/modules/shared/domain/value-object";

export type ConfigurationItemKindValue =
  | "System"
  | "Subsystem"
  | "Hardware"
  | "Software";

interface ConfigurationItemKindProps {
  value: ConfigurationItemKindValue;
}

const ALL_KINDS: ConfigurationItemKindValue[] = [
  "System",
  "Subsystem",
  "Hardware",
  "Software",
];

export class ConfigurationItemKind extends ValueObject<ConfigurationItemKindProps> {
  static readonly SYSTEM = new ConfigurationItemKind({ value: "System" });
  static readonly SUBSYSTEM = new ConfigurationItemKind({ value: "Subsystem" });
  static readonly HARDWARE = new ConfigurationItemKind({ value: "Hardware" });
  static readonly SOFTWARE = new ConfigurationItemKind({ value: "Software" });

  private static readonly ALL: ConfigurationItemKind[] = [
    ConfigurationItemKind.SYSTEM,
    ConfigurationItemKind.SUBSYSTEM,
    ConfigurationItemKind.HARDWARE,
    ConfigurationItemKind.SOFTWARE,
  ];

  protected validate(props: ConfigurationItemKindProps): void {
    if (!ALL_KINDS.includes(props.value)) {
      throw new Error(`Invalid ConfigurationItem kind: ${props.value}`);
    }
  }

  static from(value: string): ConfigurationItemKind {
    const found = ConfigurationItemKind.ALL.find((k) => k.value === value);
    if (!found) throw new Error(`Invalid ConfigurationItem kind: ${value}`);
    return found;
  }

  static all(): ConfigurationItemKind[] {
    return [...ConfigurationItemKind.ALL];
  }

  get value(): ConfigurationItemKindValue {
    return this.props.value;
  }
  get label(): string {
    return this.props.value;
  }

  toString(): string {
    return this.props.value;
  }
}