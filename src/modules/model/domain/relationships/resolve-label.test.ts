import { describe, expect, it } from "vitest";
import { resolveRelationshipLabel } from "./resolve-label";

describe("resolveRelationshipLabel", () => {
  it("reads forward in the stored direction", () => {
    expect(
      resolveRelationshipLabel({
        sourceName: "SystemFunction",
        targetName: "OperationalActivity",
        value: "Realization",
      }),
    ).toBe("SystemFunction realizes OperationalActivity");
  });

  it("reads reverse when the pair is stated from the other end", () => {
    expect(
      resolveRelationshipLabel({
        sourceName: "OperationalActivity",
        targetName: "SystemFunction",
        value: "Realization",
        reversed: true,
      }),
    ).toBe("OperationalActivity is realized by SystemFunction");
  });

  it("uses the same phrase for symmetric exchanges", () => {
    expect(
      resolveRelationshipLabel({
        sourceName: "A",
        targetName: "B",
        value: "OperationalExchange",
      }),
    ).toBe("A exchanges with B");
    expect(
      resolveRelationshipLabel({
        sourceName: "B",
        targetName: "A",
        value: "OperationalExchange",
      }),
    ).toBe("B exchanges with A");
  });

  it("keeps composition directional", () => {
    expect(
      resolveRelationshipLabel({
        sourceName: "Body",
        targetName: "Door",
        value: "Composition",
      }),
    ).toBe("Body is composed of Door");
    expect(
      resolveRelationshipLabel({
        sourceName: "Door",
        targetName: "Body",
        value: "Composition",
        reversed: true,
      }),
    ).toBe("Door is part of Body");
  });

  it("falls back to an arrow for unknown values", () => {
    expect(
      resolveRelationshipLabel({
        sourceName: "A",
        targetName: "B",
        value: "Owned",
      }),
    ).toBe("A → B");
  });
});
