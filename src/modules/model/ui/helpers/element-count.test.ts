import { describe, expect, it } from "vitest";
import {
  countClassElementsByType,
  countElementsByType,
  getElementTypeCount,
} from "./element-count";

describe("countElementsByType", () => {
  it("returns an empty map for an empty model", () => {
    expect(countElementsByType([])).toEqual({});
  });

  it("counts every element of the same type", () => {
    const counts = countElementsByType([
      { type: "SystemFunction" },
      { type: "SystemActor" },
      { type: "SystemFunction" },
      { type: "SystemFunction" },
      { type: "SystemCapability" },
    ]);

    expect(counts).toEqual({
      SystemFunction: 3,
      SystemActor: 1,
      SystemCapability: 1,
    });
  });

  it("keeps DEPRECATED elements in the count", () => {
    const counts = countElementsByType([
      { type: "LogicalComponent" },
      { type: "LogicalComponent" },
    ]);

    expect(counts.LogicalComponent).toBe(2);
  });
});

describe("countClassElementsByType", () => {
  it("keys class elements by elementType", () => {
    const counts = countClassElementsByType([
      { elementType: "CLASS" },
      { elementType: "INTERFACE" },
      { elementType: "CLASS" },
    ]);

    expect(counts).toEqual({ CLASS: 2, INTERFACE: 1 });
  });

  it("does not read the architecture type field", () => {
    const counts = countClassElementsByType([
      { elementType: "ENUM" },
      { elementType: "PACKAGE" },
    ]);

    expect(counts).toEqual({ ENUM: 1, PACKAGE: 1 });
    expect(counts.SystemFunction).toBeUndefined();
  });
});

describe("getElementTypeCount", () => {
  it("returns the count for a known type", () => {
    expect(getElementTypeCount({ SystemFunction: 12 }, "SystemFunction")).toBe(
      12,
    );
  });

  it("returns 0 for a type the model does not contain", () => {
    expect(getElementTypeCount({ SystemFunction: 12 }, "SystemActor")).toBe(0);
  });

  it("returns 0 when counts are missing", () => {
    expect(getElementTypeCount(undefined, "SystemFunction")).toBe(0);
  });
});
