import { describe, expect, it } from "vitest";
import { AggregationKind } from "./aggregation-kind";

describe("AggregationKind", () => {
  it("resolves every declared kind", () => {
    expect(AggregationKind.all().map((k) => k.value)).toEqual([
      "NONE",
      "SHARED",
      "COMPOSITE",
    ]);
    expect(AggregationKind.from("COMPOSITE")).toBe(AggregationKind.COMPOSITE);
    expect(AggregationKind.from("NONE")).toBe(AggregationKind.NONE);
  });

  it("hands out a copy of the registry", () => {
    AggregationKind.all().pop();
    expect(AggregationKind.all()).toHaveLength(3);
  });

  it("rejects an unknown kind", () => {
    expect(() => AggregationKind.from("AGGREGATE")).toThrow(
      "Invalid aggregation kind: AGGREGATE",
    );
  });

  it("recognises composite ownership", () => {
    expect(AggregationKind.COMPOSITE.isComposite()).toBe(true);
    expect(AggregationKind.SHARED.isComposite()).toBe(false);
    expect(AggregationKind.NONE.isComposite()).toBe(false);
  });

  it("compares by value", () => {
    expect(AggregationKind.from("SHARED").equals(AggregationKind.SHARED)).toBe(
      true,
    );
    expect(AggregationKind.from("SHARED").equals(AggregationKind.NONE)).toBe(
      false,
    );
    expect(AggregationKind.from("SHARED").equals({} as AggregationKind)).toBe(
      false,
    );
  });

  it("exposes its value", () => {
    expect(AggregationKind.NONE.value).toBe("NONE");
  });
});
