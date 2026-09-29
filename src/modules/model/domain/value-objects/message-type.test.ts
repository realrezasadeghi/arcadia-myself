import { describe, expect, it } from "vitest";
import { MessageType } from "./message-type";

describe("MessageType", () => {
  it("resolves every declared message type", () => {
    expect(MessageType.all().map((m) => m.value)).toEqual([
      "CALL",
      "CREATE",
      "DELETE",
      "RETURN",
      "REPLY",
      "FOUND",
      "LOST",
    ]);
    expect(MessageType.from("CALL").value).toBe("CALL");
  });

  it("rejects an unknown message type", () => {
    expect(() => MessageType.from("ASYNC")).toThrow(
      "Invalid message type: ASYNC",
    );
  });

  it("exposes bilingual labels and a description", () => {
    const call = MessageType.from("CALL");

    expect(call.label).toBe("Synchronous Call");
    expect(call.labelFa).toBe("فراخوانی همزمان");
    expect(call.description).toBe(
      "A synchronous message call between lifelines",
    );
    expect(call.toString()).toBe("CALL");
  });

  it("knows which messages are returns", () => {
    expect(MessageType.from("RETURN").isReturn()).toBe(true);
    expect(MessageType.from("REPLY").isReturn()).toBe(true);
    expect(MessageType.from("CALL").isReturn()).toBe(false);
    expect(MessageType.from("CREATE").isReturn()).toBe(false);
  });

  it("compares by value", () => {
    expect(MessageType.from("LOST").equals(MessageType.from("LOST"))).toBe(
      true,
    );
    expect(MessageType.from("LOST").equals(MessageType.from("FOUND"))).toBe(
      false,
    );
  });
});
