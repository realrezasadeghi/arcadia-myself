import { ValueObject } from "@/modules/shared/domain/value-object";

export type MessageSortValue =
  | "sync"
  | "async"
  | "reply"
  | "create"
  | "destroy"
  | "found"
  | "lost";

interface MessageSortMeta {
  label: string;
  labelFa: string;
  arrowHead: "filled" | "open" | "none";
  lineStyle: "solid" | "dashed" | "dotted";
  isReturn: boolean;
  isCreateDestroy: boolean;
  isFoundLost: boolean;
}

const META: Record<MessageSortValue, MessageSortMeta> = {
  sync: {
    label: "Synchronous Call",
    labelFa: "فراخوانی همگام",
    arrowHead: "filled",
    lineStyle: "solid",
    isReturn: false,
    isCreateDestroy: false,
    isFoundLost: false,
  },
  async: {
    label: "Asynchronous Call",
    labelFa: "فراخوانی ناهمگام",
    arrowHead: "open",
    lineStyle: "solid",
    isReturn: false,
    isCreateDestroy: false,
    isFoundLost: false,
  },
  reply: {
    label: "Reply/Return",
    labelFa: "پاسخ/بازگشت",
    arrowHead: "open",
    lineStyle: "dashed",
    isReturn: true,
    isCreateDestroy: false,
    isFoundLost: false,
  },
  create: {
    label: "Create",
    labelFa: "ساختن",
    arrowHead: "filled",
    lineStyle: "dashed",
    isReturn: false,
    isCreateDestroy: true,
    isFoundLost: false,
  },
  destroy: {
    label: "Destroy",
    labelFa: "تخریب",
    arrowHead: "filled",
    lineStyle: "solid",
    isReturn: false,
    isCreateDestroy: true,
    isFoundLost: false,
  },
  found: {
    label: "Found Message",
    labelFa: "پیام یافت شده",
    arrowHead: "open",
    lineStyle: "dotted",
    isReturn: false,
    isCreateDestroy: false,
    isFoundLost: true,
  },
  lost: {
    label: "Lost Message",
    labelFa: "پیام گمشده",
    arrowHead: "open",
    lineStyle: "dotted",
    isReturn: false,
    isCreateDestroy: false,
    isFoundLost: true,
  },
};

const ALL_VALUES = Object.keys(META) as MessageSortValue[];

interface MessageSortProps {
  value: MessageSortValue;
}

export class MessageSort extends ValueObject<MessageSortProps> {
  protected validate(props: MessageSortProps): void {
    if (!ALL_VALUES.includes(props.value))
      throw new Error(`MessageSort is invalid: ${props.value}`);
  }

  static from(value: string): MessageSort {
    if (!ALL_VALUES.includes(value as MessageSortValue))
      throw new Error(`MessageSort is invalid: ${value}`);
    return new MessageSort({ value: value as MessageSortValue });
  }

  static all(): MessageSort[] {
    return ALL_VALUES.map((v) => new MessageSort({ value: v }));
  }

  get value(): MessageSortValue {
    return this.props.value;
  }

  get label(): string {
    return META[this.props.value].label;
  }

  get labelFa(): string {
    return META[this.props.value].labelFa;
  }

  get arrowHead(): "filled" | "open" | "none" {
    return META[this.props.value].arrowHead;
  }

  get lineStyle(): "solid" | "dashed" | "dotted" {
    return META[this.props.value].lineStyle;
  }

  isReturn(): boolean {
    return META[this.props.value].isReturn;
  }

  isCreateDestroy(): boolean {
    return META[this.props.value].isCreateDestroy;
  }

  isFoundLost(): boolean {
    return META[this.props.value].isFoundLost;
  }

  toString(): string {
    return this.props.value;
  }
}