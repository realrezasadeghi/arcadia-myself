import { ValueObject } from "@/modules/shared/domain/value-object";

export type LifelineTypeValue =
  | "ACTOR"
  | "FUNCTION"
  | "COMPONENT"
  | "CLASS_ELEMENT"
  | "EXTERNAL";

interface LifelineTypeProps {
  value: LifelineTypeValue;
}

interface LifelineTypeMeta {
  label: string;
  labelFa: string;
  description: string;
}

const META: Record<LifelineTypeValue, LifelineTypeMeta> = {
  ACTOR: {
    label: "Actor",
    labelFa: "بازیگر",
    description: "An actor participating in the scenario",
  },
  FUNCTION: {
    label: "Function",
    labelFa: "عملکرد",
    description: "A function or activity in the scenario",
  },
  COMPONENT: {
    label: "Component",
    labelFa: "مؤلفه",
    description: "A component participating in the scenario",
  },
  CLASS_ELEMENT: {
    label: "Class Element",
    labelFa: "عنصر کلاس",
    description: "A class element from a class diagram",
  },
  EXTERNAL: {
    label: "External",
    labelFa: "خارجی",
    description: "An external element not modeled in the system",
  },
};

const ALL_VALUES = Object.keys(META) as LifelineTypeValue[];

export class LifelineType extends ValueObject<LifelineTypeProps> {
  protected validate(props: LifelineTypeProps): void {
    if (!ALL_VALUES.includes(props.value))
      throw new Error(`Invalid lifeline type: ${props.value}`);
  }

  static from(value: string): LifelineType {
    if (!ALL_VALUES.includes(value as LifelineTypeValue))
      throw new Error(`Invalid lifeline type: ${value}`);
    return new LifelineType({ value: value as LifelineTypeValue });
  }

  static all(): LifelineType[] {
    return ALL_VALUES.map((v) => new LifelineType({ value: v }));
  }

  get value(): LifelineTypeValue {
    return this.props.value;
  }

  get label(): string {
    return META[this.props.value].label;
  }

  get labelFa(): string {
    return META[this.props.value].labelFa;
  }

  get description(): string {
    return META[this.props.value].description;
  }

  toString(): string {
    return this.props.value;
  }
}
