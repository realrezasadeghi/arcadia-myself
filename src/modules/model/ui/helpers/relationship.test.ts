import { describe, expect, it } from "vitest";
import {
  getRelationshipTypeInfo,
  humanizeRelationshipTypeName,
} from "./relationship";

describe("humanizeRelationshipTypeName", () => {
  it("title-cases uppercase registry values", () => {
    expect(humanizeRelationshipTypeName("ASSOCIATION")).toBe("Association");
    expect(humanizeRelationshipTypeName("OPERATIONAL_EXCHANGE")).toBe(
      "Operational Exchange",
    );
  });

  it("splits camel case", () => {
    expect(humanizeRelationshipTypeName("ComponentAssembly")).toBe(
      "Component Assembly",
    );
  });

  it("returns the input when there is nothing to split", () => {
    expect(humanizeRelationshipTypeName("")).toBe("");
  });
});

describe("getRelationshipTypeInfo", () => {
  it("resolves known connection types from the registry", () => {
    const info = getRelationshipTypeInfo("Allocation");
    expect(info.label).toBe("Allocation");
    expect(info.labelFa).not.toBe("Allocation");
  });

  it("falls back to the domain definition when the UI registry misses", () => {
    expect(getRelationshipTypeInfo("ASSOCIATION").label).toBe("Association");
  });

  it("humanises genuinely unknown values instead of echoing them", () => {
    const info = getRelationshipTypeInfo("ComponentAssembly");
    expect(info.label).toBe("Component Assembly");
    expect(info.label).not.toBe("ComponentAssembly");
    expect(info.allowedFor).toEqual([]);
  });
});
