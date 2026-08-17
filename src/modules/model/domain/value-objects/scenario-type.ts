import { ValueObject } from "@/modules/shared/domain/value-object";
import { Layer, type LayerValue } from "./layer";

export type ScenarioTypeValue = "OIS" | "SS" | "LS" | "PS";

interface ScenarioTypeProps {
  value: ScenarioTypeValue;
}

interface ScenarioTypeMeta {
  label: string;
  labelFa: string;
  layer: LayerValue;
  description: string;
}

const META: Record<ScenarioTypeValue, ScenarioTypeMeta> = {
  OIS: {
    label: "Operational Interaction Scenario",
    labelFa: "سناریو تعامل عملیاتی",
    layer: "OA",
    description:
      "Modeling interactions between operational actors and activities",
  },
  SS: {
    label: "System Scenario",
    labelFa: "سناریو سیستم",
    layer: "SA",
    description: "Modeling system-level behavioral scenarios",
  },
  LS: {
    label: "Logical Scenario",
    labelFa: "سناریو منطقی",
    layer: "LA",
    description: "Modeling logical component interactions",
  },
  PS: {
    label: "Physical Scenario",
    labelFa: "سناریو فیزیکی",
    layer: "PA",
    description: "Modeling physical implementation scenarios",
  },
};

const ALL_VALUES = Object.keys(META) as ScenarioTypeValue[];

export class ScenarioType extends ValueObject<ScenarioTypeProps> {
  protected validate(props: ScenarioTypeProps): void {
    if (!ALL_VALUES.includes(props.value))
      throw new Error(`Invalid scenario type: ${props.value}`);
  }

  static from(value: string): ScenarioType {
    if (!ALL_VALUES.includes(value as ScenarioTypeValue))
      throw new Error(`Invalid scenario type: ${value}`);
    return new ScenarioType({ value: value as ScenarioTypeValue });
  }

  static all(): ScenarioType[] {
    return ALL_VALUES.map((v) => new ScenarioType({ value: v }));
  }

  get value(): ScenarioTypeValue {
    return this.props.value;
  }

  get label(): string {
    return META[this.props.value].label;
  }

  get labelFa(): string {
    return META[this.props.value].labelFa;
  }

  get layer(): Layer {
    return Layer.from(META[this.props.value].layer);
  }

  get description(): string {
    return META[this.props.value].description;
  }

  toString(): string {
    return this.props.value;
  }
}
