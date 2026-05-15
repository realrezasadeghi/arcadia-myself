import { ValueObject } from "@/modules/shared/domain/value-object";
import { Layer } from "./layer";

type OAElementValue =
  | "OperationalEntity"
  | "OperationalActor"
  | "OperationalActivity"
  | "OperationalCapability"
  | "OperationalProcess";

type SAElementValue =
  | "System"
  | "SystemActor"
  | "SystemFunction"
  | "SystemCapability"
  | "SystemComponent";

type LAElementValue = "LogicalComponent" | "LogicalActor" | "LogicalFunction";

type PAElementValue =
  | "PhysicalComponent"
  | "PhysicalNode"
  | "PhysicalFunction"
  | "PhysicalActor";

export type ElementTypeValue =
  | OAElementValue
  | SAElementValue
  | LAElementValue
  | PAElementValue;

interface ElementTypeMeta {
  label: string;
  labelFa: string;
  layer: Layer;
}

const META: Record<ElementTypeValue, ElementTypeMeta> = {
  OperationalEntity: {
    label: "Operational Entity",
    labelFa: "موجودیت عملیاتی",
    layer: Layer.OA,
  },
  OperationalActor: {
    label: "Operational Actor",
    labelFa: "بازیگر عملیاتی",
    layer: Layer.OA,
  },
  OperationalActivity: {
    label: "Operational Activity",
    labelFa: "فعالیت عملیاتی",
    layer: Layer.OA,
  },
  OperationalCapability: {
    label: "Operational Capability",
    labelFa: "قابلیت عملیاتی",
    layer: Layer.OA,
  },
  OperationalProcess: {
    label: "Operational Process",
    labelFa: "فرایند عملیاتی",
    layer: Layer.OA,
  },
  System: { label: "System", labelFa: "سیستم", layer: Layer.SA },
  SystemActor: {
    label: "System Actor",
    labelFa: "بازیگر سیستم",
    layer: Layer.SA,
  },
  SystemFunction: {
    label: "System Function",
    labelFa: "تابع سیستم",
    layer: Layer.SA,
  },
  SystemCapability: {
    label: "System Capability",
    labelFa: "قابلیت سیستم",
    layer: Layer.SA,
  },
  SystemComponent: {
    label: "System Component",
    labelFa: "مؤلفه سیستم",
    layer: Layer.SA,
  },
  LogicalComponent: {
    label: "Logical Component",
    labelFa: "مؤلفه منطقی",
    layer: Layer.LA,
  },
  LogicalActor: {
    label: "Logical Actor",
    labelFa: "بازیگر منطقی",
    layer: Layer.LA,
  },
  LogicalFunction: {
    label: "Logical Function",
    labelFa: "تابع منطقی",
    layer: Layer.LA,
  },
  PhysicalComponent: {
    label: "Physical Component",
    labelFa: "مؤلفه فیزیکی",
    layer: Layer.PA,
  },
  PhysicalNode: {
    label: "Physical Node",
    labelFa: "گره فیزیکی",
    layer: Layer.PA,
  },
  PhysicalFunction: {
    label: "Physical Function",
    labelFa: "تابع فیزیکی",
    layer: Layer.PA,
  },
  PhysicalActor: {
    label: "Physical Actor",
    labelFa: "بازیگر فیزیکی",
    layer: Layer.PA,
  },
};

const LAYER_MAP: Record<ElementTypeValue, Layer> = Object.fromEntries(
  (Object.keys(META) as ElementTypeValue[]).map((k) => [k, META[k].layer]),
) as Record<ElementTypeValue, Layer>;

const ALL_VALUES = Object.keys(META) as ElementTypeValue[];

interface ElementTypeProps {
  value: ElementTypeValue;
}

/**
 * ElementType — Value Object
 *
 * نوع یک المنت در مدل Arcadia را نمایندگی می‌کند.
 * فقط شامل business knowledge است (لایه، دسته‌بندی).
 * اطلاعات بصری (رنگ، شکل) در presentation/config/visual.config.ts قرار دارند.
 */
export class ElementType extends ValueObject<ElementTypeProps> {
  protected validate(props: ElementTypeProps): void {
    if (!ALL_VALUES.includes(props.value))
      throw new Error(`Element type is invalid : ${props.value}`);
  }

  static from(value: string): ElementType {
    if (!ALL_VALUES.includes(value as ElementTypeValue))
      throw new Error(`Element type is invalid : ${value}s`);
    return new ElementType({ value: value as ElementTypeValue });
  }

  static allForLayer(layer: Layer): ElementType[] {
    return ALL_VALUES.filter((v) => LAYER_MAP[v].equals(layer)).map(
      (v) => new ElementType({ value: v }),
    );
  }

  get value(): ElementTypeValue {
    return this.props.value;
  }
  get layer(): Layer {
    return LAYER_MAP[this.props.value];
  }
  get label(): string {
    return META[this.props.value].label;
  }
  get labelFa(): string {
    return META[this.props.value].labelFa;
  }

  isComponent(): boolean {
    return this.props.value.endsWith("Component");
  }

  isFunction(): boolean {
    return (
      this.props.value.endsWith("Function") ||
      this.props.value.endsWith("Activity")
    );
  }

  isActor(): boolean {
    return (
      this.props.value.endsWith("Actor") || this.props.value.endsWith("Entity")
    );
  }

  isCapability(): boolean {
    return this.props.value.endsWith("Capability");
  }

  toString(): string {
    return this.props.value;
  }
}
