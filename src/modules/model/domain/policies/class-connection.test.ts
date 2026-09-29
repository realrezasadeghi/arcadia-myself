import { describe, expect, it } from "vitest";
import { ClassElementType } from "../value-objects/class-element-type";
import { ClassRelationshipType } from "../value-objects/class-relationship-type";
import { ClassConnectionPolicy } from "./class-connection";

type ElementTypeValue = Parameters<typeof ClassElementType.from>[0];
type RelationshipValue = Parameters<typeof ClassRelationshipType.from>[0];

const isAllowed = (
  source: ElementTypeValue,
  target: ElementTypeValue,
  relationship: RelationshipValue,
) =>
  ClassConnectionPolicy.isAllowed(
    ClassElementType.from(source),
    ClassElementType.from(target),
    ClassRelationshipType.from(relationship),
  );

const allowedTypes = (source: ElementTypeValue, target: ElementTypeValue) =>
  ClassConnectionPolicy.getAllowedRelationshipTypes(source, target).map(
    (t) => t.value,
  );

describe("ClassConnectionPolicy.assertAllowed", () => {
  it("accepts generalization between classifiers", () => {
    expect(() =>
      ClassConnectionPolicy.assertAllowed(
        ClassElementType.CLASS,
        ClassElementType.CLASS,
        ClassRelationshipType.GENERALIZATION,
      ),
    ).not.toThrow();
    expect(isAllowed("INTERFACE", "INTERFACE", "GENERALIZATION")).toBe(true);
    expect(isAllowed("ENUM", "DATA_TYPE", "GENERALIZATION")).toBe(true);
  });

  it("rejects a pair that no rule matches with a readable message", () => {
    expect(() =>
      ClassConnectionPolicy.assertAllowed(
        ClassElementType.PRIMITIVE,
        ClassElementType.INTERFACE,
        ClassRelationshipType.GENERALIZATION,
      ),
    ).toThrow(
      'Connection from "Primitive" to "Interface" via "Generalization" is not allowed.',
    );
  });

  it("only realizes interfaces", () => {
    expect(isAllowed("CLASS", "INTERFACE", "REALIZATION")).toBe(true);
    expect(isAllowed("ENUM", "INTERFACE", "REALIZATION")).toBe(true);
    expect(isAllowed("DATA_TYPE", "INTERFACE", "REALIZATION")).toBe(true);
    expect(isAllowed("INTERFACE", "CLASS", "REALIZATION")).toBe(false);
    expect(isAllowed("CLASS", "ENUM", "REALIZATION")).toBe(false);
    expect(isAllowed("PRIMITIVE", "INTERFACE", "REALIZATION")).toBe(false);
  });

  it("keeps association and dependency free between any classifier", () => {
    expect(isAllowed("CLASS", "CLASS", "ASSOCIATION")).toBe(true);
    expect(isAllowed("PRIMITIVE", "PRIMITIVE", "ASSOCIATION")).toBe(true);
    expect(isAllowed("INTERFACE", "DATA_TYPE", "DEPENDENCY")).toBe(true);
    expect(isAllowed("PRIMITIVE", "CLASS", "DEPENDENCY")).toBe(true);
  });

  it("never offers generalization or realization to primitives", () => {
    expect(isAllowed("PRIMITIVE", "CLASS", "GENERALIZATION")).toBe(false);
    expect(isAllowed("CLASS", "PRIMITIVE", "GENERALIZATION")).toBe(false);
    expect(isAllowed("CLASS", "PRIMITIVE", "REALIZATION")).toBe(false);
  });
});

describe("ClassConnectionPolicy.getAllowedRelationshipTypes", () => {
  it("returns every relationship type offered between two classes", () => {
    expect(allowedTypes("CLASS", "CLASS")).toEqual([
      "GENERALIZATION",
      "ASSOCIATION",
      "DEPENDENCY",
    ]);
    expect(allowedTypes("CLASS", "INTERFACE")).toEqual([
      "GENERALIZATION",
      "REALIZATION",
      "ASSOCIATION",
      "DEPENDENCY",
    ]);
    expect(allowedTypes("INTERFACE", "CLASS")).toEqual([
      "GENERALIZATION",
      "ASSOCIATION",
      "DEPENDENCY",
    ]);
    expect(allowedTypes("PRIMITIVE", "PRIMITIVE")).toEqual([
      "ASSOCIATION",
      "DEPENDENCY",
    ]);
    expect(allowedTypes("CLASS", "ENUM")).toEqual([
      "GENERALIZATION",
      "ASSOCIATION",
      "DEPENDENCY",
    ]);
  });

  it("accepts value objects as well as raw strings", () => {
    expect(
      ClassConnectionPolicy.getAllowedRelationshipTypes(
        ClassElementType.CLASS,
        ClassElementType.INTERFACE,
      ).map((t) => t.value),
    ).toEqual(allowedTypes("CLASS", "INTERFACE"));
  });

  it("returns value objects, never raw strings", () => {
    const types = ClassConnectionPolicy.getAllowedRelationshipTypes(
      "CLASS",
      "INTERFACE",
    );
    expect(types).toHaveLength(4);
    for (const type of types) {
      expect(type).toBeInstanceOf(ClassRelationshipType);
    }
  });

  it("offers at least one relationship type for every declared type pair rule", () => {
    for (const relationship of ClassRelationshipType.all()) {
      const pair = ClassElementType.all()
        .flatMap((source) =>
          ClassElementType.all().map((target) => [source, target] as const),
        )
        .find(([source, target]) =>
          ClassConnectionPolicy.isAllowed(source, target, relationship),
        );

      expect(pair, `no allowed pair for ${relationship.value}`).toBeDefined();
    }
  });
});
