import { ValueObject } from "@/modules/shared/domain/value-object";

export type MessageTypeValue =
  | "CALL"
  | "CREATE"
  | "DELETE"
  | "RETURN"
  | "REPLY"
  | "FOUND"
  | "LOST";

interface MessageTypeProps {
  value: MessageTypeValue;
}

interface MessageTypeMeta {
  label: string;
  labelFa: string;
  description: string;
}

const META: Record<MessageTypeValue, MessageTypeMeta> = {
  CALL: {
    label: "Synchronous Call",
    labelFa: "فراخوانی همزمان",
    description: "A synchronous message call between lifelines",
  },
  CREATE: {
    label: "Create",
    labelFa: "ایجاد",
    description: "Message that creates a lifeline",
  },
  DELETE: {
    label: "Delete",
    labelFa: "حذف",
    description: "Message that destroys a lifeline",
  },
  RETURN: {
    label: "Return",
    labelFa: "بازگشت",
    description: "Return message from a call",
  },
  REPLY: {
    label: "Reply",
    labelFa: "پاسخ",
    description: "Reply to a previous message",
  },
  FOUND: {
    label: "Found",
    labelFa: "یافته‌شده",
    description: "Message to an unknown target lifeline",
  },
  LOST: {
    label: "Lost",
    labelFa: "گمشده",
    description: "Message from an unknown source lifeline",
  },
};

const ALL_VALUES = Object.keys(META) as MessageTypeValue[];

export class MessageType extends ValueObject<MessageTypeProps> {
  protected validate(props: MessageTypeProps): void {
    if (!ALL_VALUES.includes(props.value))
      throw new Error(`Invalid message type: ${props.value}`);
  }

  static from(value: string): MessageType {
    if (!ALL_VALUES.includes(value as MessageTypeValue))
      throw new Error(`Invalid message type: ${value}`);
    return new MessageType({ value: value as MessageTypeValue });
  }

  static all(): MessageType[] {
    return ALL_VALUES.map((v) => new MessageType({ value: v }));
  }

  get value(): MessageTypeValue {
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

  isReturn(): boolean {
    return this.props.value === "RETURN" || this.props.value === "REPLY";
  }

  toString(): string {
    return this.props.value;
  }
}
