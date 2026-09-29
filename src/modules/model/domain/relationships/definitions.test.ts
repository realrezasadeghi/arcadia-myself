import { describe, expect, it } from "vitest";
import {
  ALL_RELATIONSHIP_VALUES,
  CONNECTION_VALUES,
  getRelationshipDefinition,
  RELATIONSHIP_DEFINITIONS,
  relationshipDefinitionsOfKind,
  TRACE_VALUES,
} from "./definitions";

describe("relationship registry", () => {
  it("splits connection and trace values without overlap", () => {
    const connection = new Set<string>(CONNECTION_VALUES);
    const trace = new Set<string>(TRACE_VALUES);

    for (const value of trace) {
      expect(connection.has(value)).toBe(false);
    }
    expect(connection.size + trace.size).toBe(ALL_RELATIONSHIP_VALUES.length);
    expect([...connection, ...trace].sort()).toEqual(
      [...ALL_RELATIONSHIP_VALUES].sort(),
    );
  });

  it("keeps kind consistent with the value it belongs to", () => {
    for (const value of CONNECTION_VALUES) {
      expect(RELATIONSHIP_DEFINITIONS[value].kind).toBe("connection");
    }
    for (const value of TRACE_VALUES) {
      expect(RELATIONSHIP_DEFINITIONS[value].kind).toBe("trace");
    }
  });

  it("describes every relationship with EN and FA names and phrases", () => {
    for (const value of ALL_RELATIONSHIP_VALUES) {
      const definition = RELATIONSHIP_DEFINITIONS[value];
      for (const field of [
        "label",
        "labelFa",
        "noun",
        "nounFa",
        "forward",
        "forwardFa",
        "reverse",
        "reverseFa",
      ] as const) {
        expect(
          definition[field].length,
          `${value}.${field} should not be empty`,
        ).toBeGreaterThan(0);
      }
      expect(definition.label.toLowerCase()).toContain(
        definition.noun.toLowerCase(),
      );
    }
  });

  it("has no legacy Owned link", () => {
    expect(ALL_RELATIONSHIP_VALUES).not.toContain("Owned");
    expect(TRACE_VALUES).toEqual(["Realization", "Refinement"]);
  });

  it("reads realization as source realizes target", () => {
    const realization = getRelationshipDefinition("Realization");
    expect(realization?.forward).toBe("realizes");
    expect(realization?.reverse).toBe("is realized by");
    expect(realization?.kind).toBe("trace");
  });

  it("groups definitions by kind", () => {
    expect(relationshipDefinitionsOfKind("trace").map((d) => d.value)).toEqual([
      "Realization",
      "Refinement",
    ]);
    expect(relationshipDefinitionsOfKind("connection")).toHaveLength(
      CONNECTION_VALUES.length,
    );
  });

  it("returns null for unknown values", () => {
    expect(getRelationshipDefinition("Owned")).toBeNull();
    expect(getRelationshipDefinition("nonsense")).toBeNull();
    expect(getRelationshipDefinition("Allocation")?.kind).toBe("connection");
  });
});
