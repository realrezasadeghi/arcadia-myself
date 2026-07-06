import { ValueObject } from "@/modules/shared/domain/value-object";

export type LifelineTypeValue =
  | "actor"
  | "entity"
  | "component"
  | "function"
  | "boundary"
  | "control"
  | "database"
  | "gate";

interface LifelineTypeMeta {
  label: string;
  labelFa: string;
  description: string;
  icon: string;
  defaultSelector: string;
}

const META: Record<LifelineTypeValue, LifelineTypeMeta> = {
  actor: {
    label: "Actor",
    labelFa: "بازیگر",
    description: "بازیگر خارجی که با سیستم تعامل دارد",
    icon: "actor",
    defaultSelector: "actor",
  },
  entity: {
    label: "Entity",
    labelFa: "موجودیت",
    description: "موجودیت Obrigational/Operational/Logical/Physical",
    icon: "entity",
    defaultSelector: "entity",
  },
  component: {
    label: "Component",
    labelFa: "مؤلفه",
    description: "مؤلفه سیستمی/منطقی/فیزیکی",
    icon: "component",
    defaultSelector: "component",
  },
  function: {
    label: "Function",
    labelFa: "تابع",
    description: "تابع/فعالیت در هر لایه",
    icon: "function",
    defaultSelector: "function",
  },
  boundary: {
    label: "Boundary",
    labelFa: "مرز",
    description: "مؤلفه مرزی (رابط کاربری، API، رابط سخت‌افزاری)",
    icon: "boundary",
    defaultSelector: "boundary",
  },
  control: {
    label: "Control",
    labelFa: "کنترل",
    description: "مؤلفه کنترلی (مدیریت جریان، orchestration)",
    icon: "control",
    defaultSelector: "control",
  },
  database: {
    label: "Database",
    labelFa: "پایگاه داده",
    description: "ذخیره‌سازی داده (Entity، Data Store)",
    icon: "database",
    defaultSelector: "database",
  },
  gate: {
    label: "Gate",
    labelFa: "دروازه",
    description: "نقطه اتصال به فرگمنت بیرونی (entry/exit point)",
    icon: "gate",
    defaultSelector: "gate",
  },
};

const ALL_VALUES = Object.keys(META) as LifelineTypeValue[];

interface LifelineTypeProps {
  value: LifelineTypeValue;
}

export class LifelineType extends ValueObject<LifelineTypeProps> {
  protected validate(props: LifelineTypeProps): void {
    if (!ALL_VALUES.includes(props.value))
      throw new Error(`LifelineType is invalid: ${props.value}`);
  }

  static from(value: string): LifelineType {
    if (!ALL_VALUES.includes(value as LifelineTypeValue))
      throw new Error(`LifelineType is invalid: ${value}`);
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

  get icon(): string {
    return META[this.props.value].icon;
  }

  get defaultSelector(): string {
    return META[this.props.value].defaultSelector;
  }

  toString(): string {
    return this.props.value;
  }
}