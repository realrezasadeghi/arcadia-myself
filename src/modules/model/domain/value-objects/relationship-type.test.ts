import { describe, expect, it } from "vitest";
import { CONNECTION_VALUES, TRACE_VALUES } from "../relationships/definitions";
import { RelationshipType } from "./relationship-type";

describe("RelationshipType", () => {
  it("accepts every connection value", () => {
    expect(RelationshipType.all().map((t) => t.value)).toEqual(
      CONNECTION_VALUES,
    );
  });

  it("rejects a trace type", () => {
    for (const traceValue of TRACE_VALUES) {
      expect(() => RelationshipType.from(traceValue)).toThrow(
        `RelationshipType is invalid : ${traceValue}`,
      );
    }
  });

  it("rejects an unknown value", () => {
    expect(() => RelationshipType.from("BelongsTo")).toThrow(
      "RelationshipType is invalid : BelongsTo",
    );
  });

  it("reads its label from the relationship definitions", () => {
    const allocation = RelationshipType.from("Allocation");

    expect(allocation.label).toBe("Allocation");
    expect(allocation.labelFa).toBe("تخصیص");
    expect(allocation.value).toBe("Allocation");
    expect(allocation.toString()).toBe("Allocation");
  });

  it("hands out independent instances that still compare by value", () => {
    const first = RelationshipType.from("Composition");
    const second = RelationshipType.from("Composition");

    expect(first).not.toBe(second);
    expect(first.equals(second)).toBe(true);
    expect(first.equals(RelationshipType.from("Generalization"))).toBe(false);
  });
});
