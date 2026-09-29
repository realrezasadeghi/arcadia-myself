import { describe, expect, it } from "vitest";
import {
  AggregationKind,
  type AggregationKindValue,
} from "../value-objects/aggregation-kind";
import { ClassRelationshipType } from "../value-objects/class-relationship-type";
import { Layer } from "../value-objects/layer";
import { ClassRelationship } from "./class-relationship";

type CreateProps = Partial<Parameters<typeof ClassRelationship.create>[0]>;
type ReconstituteProps = Parameters<typeof ClassRelationship.reconstitute>[0];

const createProps = (overrides: CreateProps = {}) => ({
  id: "rel-1",
  modelId: "model-1",
  layer: "LA",
  sourceElementId: "element-1",
  targetElementId: "element-2",
  relationshipType: "ASSOCIATION",
  ...overrides,
});

const reconstitutable = (
  overrides: Partial<ReconstituteProps> = {},
): ReconstituteProps => ({
  id: "rel-1",
  modelId: "model-1",
  layer: "LA",
  sourceElementId: "element-1",
  targetElementId: "element-2",
  name: "owns",
  description: "whole part",
  relationshipType: "ASSOCIATION",
  aggregationKind: "COMPOSITE",
  isDisjoint: true,
  isComplete: true,
  isDerived: false,
  sourceMultiplicityLower: 1,
  sourceMultiplicityUpper: "3",
  targetMultiplicityLower: 0,
  targetMultiplicityUpper: "*",
  sourceRole: "owner",
  targetRole: "line",
  isNavigableSource: true,
  isNavigableTarget: false,
  status: "VALIDATED",
  extensionProperties: { derived: false },
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
  ...overrides,
});

describe("ClassRelationship.create", () => {
  it("builds a draft relationship with defaults", () => {
    const relationship = ClassRelationship.create(createProps());

    expect(relationship.id).toBe("rel-1");
    expect(relationship.modelId).toBe("model-1");
    expect(relationship.layer.value).toBe("LA");
    expect(relationship.sourceElementId).toBe("element-1");
    expect(relationship.targetElementId).toBe("element-2");
    expect(relationship.name).toBe("");
    expect(relationship.description).toBe("");
    expect(relationship.relationshipType.value).toBe("ASSOCIATION");
    expect(relationship.aggregationKind.value).toBe("NONE");
    expect(relationship.isDisjoint).toBe(false);
    expect(relationship.isComplete).toBe(false);
    expect(relationship.isDerived).toBe(false);
    expect(relationship.sourceMultiplicityLower).toBe(1);
    expect(relationship.sourceMultiplicityUpper).toBe("*");
    expect(relationship.targetMultiplicityLower).toBe(1);
    expect(relationship.targetMultiplicityUpper).toBe("*");
    expect(relationship.sourceRole).toBe("");
    expect(relationship.targetRole).toBe("");
    expect(relationship.isNavigableSource).toBe(true);
    expect(relationship.isNavigableTarget).toBe(true);
    expect(relationship.status).toBe("DRAFT");
    expect(relationship.extensionProperties).toEqual({});
    expect(relationship.createdAt).toBeInstanceOf(Date);
  });

  it("applies the provided endpoints metadata", () => {
    const relationship = ClassRelationship.create(
      createProps({
        name: "  owns  ",
        description: "whole part",
        aggregationKind: "COMPOSITE",
        isDisjoint: true,
        isComplete: true,
        isDerived: true,
        sourceMultiplicityLower: 0,
        sourceMultiplicityUpper: "3",
        targetMultiplicityLower: 2,
        targetMultiplicityUpper: "5",
        sourceRole: "owner",
        targetRole: "line",
        isNavigableSource: false,
        isNavigableTarget: false,
        extensionProperties: { note: "x" },
      }),
    );

    expect(relationship.name).toBe("owns");
    expect(relationship.description).toBe("whole part");
    expect(relationship.aggregationKind.value).toBe("COMPOSITE");
    expect(relationship.isDisjoint).toBe(true);
    expect(relationship.isComplete).toBe(true);
    expect(relationship.isDerived).toBe(true);
    expect(relationship.sourceMultiplicityLower).toBe(0);
    expect(relationship.sourceMultiplicityUpper).toBe("3");
    expect(relationship.targetMultiplicityLower).toBe(2);
    expect(relationship.targetMultiplicityUpper).toBe("5");
    expect(relationship.sourceRole).toBe("owner");
    expect(relationship.targetRole).toBe("line");
    expect(relationship.isNavigableSource).toBe(false);
    expect(relationship.isNavigableTarget).toBe(false);
    expect(relationship.extensionProperties).toEqual({ note: "x" });
  });

  it("accepts an already-built Layer instance", () => {
    const relationship = ClassRelationship.create(
      createProps({ layer: Layer.PA }),
    );

    expect(relationship.layer.value).toBe("PA");
  });

  it("rejects missing endpoints and self connections", () => {
    expect(() =>
      ClassRelationship.create(createProps({ sourceElementId: "" })),
    ).toThrow("Source element is required");
    expect(() =>
      ClassRelationship.create(createProps({ targetElementId: "" })),
    ).toThrow("Target element is required");
    expect(() =>
      ClassRelationship.create(createProps({ targetElementId: "element-1" })),
    ).toThrow("A relationship cannot connect an element to itself");
  });

  it("rejects unknown value objects", () => {
    expect(() =>
      ClassRelationship.create(createProps({ layer: "XX" })),
    ).toThrow("Invalid layer value : XX");
    expect(() =>
      ClassRelationship.create(createProps({ relationshipType: "NOPE" })),
    ).toThrow("Invalid class relationship type: NOPE");
    expect(() =>
      ClassRelationship.create(
        createProps({ aggregationKind: "WEIRD" as AggregationKindValue }),
      ),
    ).toThrow("Invalid aggregation kind: WEIRD");
  });
});

describe("ClassRelationship.reconstitute", () => {
  it("restores every persisted field", () => {
    const relationship = ClassRelationship.reconstitute(reconstitutable());

    expect(relationship.id).toBe("rel-1");
    expect(relationship.modelId).toBe("model-1");
    expect(relationship.layer.value).toBe("LA");
    expect(relationship.sourceElementId).toBe("element-1");
    expect(relationship.targetElementId).toBe("element-2");
    expect(relationship.name).toBe("owns");
    expect(relationship.description).toBe("whole part");
    expect(relationship.relationshipType.value).toBe("ASSOCIATION");
    expect(relationship.aggregationKind.value).toBe("COMPOSITE");
    expect(relationship.isDisjoint).toBe(true);
    expect(relationship.isComplete).toBe(true);
    expect(relationship.isDerived).toBe(false);
    expect(relationship.sourceMultiplicityUpper).toBe("3");
    expect(relationship.targetMultiplicityLower).toBe(0);
    expect(relationship.sourceRole).toBe("owner");
    expect(relationship.targetRole).toBe("line");
    expect(relationship.isNavigableTarget).toBe(false);
    expect(relationship.status).toBe("VALIDATED");
    expect(relationship.extensionProperties).toEqual({ derived: false });
    expect(relationship.createdAt.toISOString()).toBe(
      "2026-01-01T00:00:00.000Z",
    );
    expect(relationship.updatedAt.toISOString()).toBe(
      "2026-01-02T00:00:00.000Z",
    );
  });

  it("round-trips through toJSON", () => {
    const json = ClassRelationship.reconstitute(reconstitutable()).toJSON();
    const restored = ClassRelationship.reconstitute(json);

    expect(restored.toJSON()).toEqual(json);
  });
});

describe("ClassRelationship.rename", () => {
  it("stores the new name", () => {
    const relationship = ClassRelationship.create(createProps());

    const events = relationship.rename("contains");

    expect(events).toHaveLength(1);
    expect(events[0].eventName).toBe("ClassRelationshipRenamed");
    expect(relationship.name).toBe("contains");
  });
});

describe("ClassRelationship.setDescription", () => {
  it("emits an event only when the text actually changes", () => {
    const relationship = ClassRelationship.create(createProps());

    expect(relationship.setDescription("first")).toHaveLength(1);
    expect(relationship.description).toBe("first");
    expect(relationship.setDescription("first")).toEqual([]);
  });
});

describe("ClassRelationship.setRelationshipType", () => {
  it("replaces the relationship type", () => {
    const relationship = ClassRelationship.create(createProps());

    const events = relationship.setRelationshipType(
      ClassRelationshipType.GENERALIZATION,
    );

    expect(events).toHaveLength(1);
    expect(relationship.relationshipType.value).toBe("GENERALIZATION");
    expect(events[0].eventName).toBe("ClassRelationshipTypeChanged");
  });
});

describe("ClassRelationship.setAggregationKind", () => {
  it("replaces the aggregation kind", () => {
    const relationship = ClassRelationship.create(createProps());

    relationship.setAggregationKind(AggregationKind.SHARED);

    expect(relationship.aggregationKind.value).toBe("SHARED");
    expect(relationship.aggregationKind.isShared()).toBe(true);
  });
});

describe("ClassRelationship.setGeneralizationConstraints", () => {
  it("stores disjoint and complete together", () => {
    const relationship = ClassRelationship.create(createProps());

    const events = relationship.setGeneralizationConstraints(true, true);

    expect(events).toHaveLength(1);
    expect(relationship.isDisjoint).toBe(true);
    expect(relationship.isComplete).toBe(true);

    relationship.setGeneralizationConstraints(false, false);
    expect(relationship.isDisjoint).toBe(false);
    expect(relationship.isComplete).toBe(false);
  });
});

describe("ClassRelationship.setDerived", () => {
  it("stores the derived flag", () => {
    const relationship = ClassRelationship.create(createProps());

    relationship.setDerived(true);

    expect(relationship.isDerived).toBe(true);
  });
});

describe("ClassRelationship.setSourceMultiplicity", () => {
  it("stores a non-negative lower bound", () => {
    const relationship = ClassRelationship.create(createProps());

    const events = relationship.setSourceMultiplicity(0, "4");

    expect(events).toHaveLength(1);
    expect(relationship.sourceMultiplicityLower).toBe(0);
    expect(relationship.sourceMultiplicityUpper).toBe("4");
  });

  it("rejects a negative lower bound", () => {
    const relationship = ClassRelationship.create(createProps());

    expect(() => relationship.setSourceMultiplicity(-1, "*")).toThrow(
      "Source multiplicity lower must be >= 0",
    );
    expect(relationship.sourceMultiplicityLower).toBe(1);
  });
});

describe("ClassRelationship.setTargetMultiplicity", () => {
  it("stores a non-negative lower bound", () => {
    const relationship = ClassRelationship.create(createProps());

    relationship.setTargetMultiplicity(2, "2");

    expect(relationship.targetMultiplicityLower).toBe(2);
    expect(relationship.targetMultiplicityUpper).toBe("2");
  });

  it("rejects a negative lower bound", () => {
    const relationship = ClassRelationship.create(createProps());

    expect(() => relationship.setTargetMultiplicity(-1, "*")).toThrow(
      "Target multiplicity lower must be >= 0",
    );
    expect(relationship.targetMultiplicityLower).toBe(1);
  });
});

describe("ClassRelationship roles and navigability", () => {
  it("stores both roles", () => {
    const relationship = ClassRelationship.create(createProps());

    relationship.setSourceRole("owner");
    relationship.setTargetRole("line");

    expect(relationship.sourceRole).toBe("owner");
    expect(relationship.targetRole).toBe("line");
  });

  it("stores both navigability directions", () => {
    const relationship = ClassRelationship.create(createProps());

    const events = relationship.setNavigability(false, true);

    expect(events).toHaveLength(1);
    expect(relationship.isNavigableSource).toBe(false);
    expect(relationship.isNavigableTarget).toBe(true);
  });
});

describe("ClassRelationship.setExtensionProperty", () => {
  it("merges into the existing extension properties", () => {
    const relationship = ClassRelationship.create(
      createProps({ extensionProperties: { a: 1 } }),
    );

    relationship.setExtensionProperty("b", 2);

    expect(relationship.extensionProperties).toEqual({ a: 1, b: 2 });
  });
});

describe("ClassRelationship.validate", () => {
  it("moves a draft relationship to validated", () => {
    const relationship = ClassRelationship.create(createProps());

    const events = relationship.validate();

    expect(events).toHaveLength(1);
    expect(events[0].eventName).toBe("ClassRelationshipValidated");
    expect(relationship.status).toBe("VALIDATED");
    expect(relationship.validate()).toHaveLength(1);
  });

  it("deprecates once and refuses validation afterwards", () => {
    const relationship = ClassRelationship.create(createProps());

    expect(relationship.deprecate()).toHaveLength(1);
    expect(relationship.status).toBe("DEPRECATED");
    expect(relationship.deprecate()).toEqual([]);
    expect(() => relationship.validate()).toThrow(
      "Cannot validate a deprecated relationship",
    );
  });
});

describe("ClassRelationship.connects", () => {
  it("matches the endpoint pair in either direction", () => {
    const relationship = ClassRelationship.create(createProps());

    expect(relationship.connects("element-1", "element-2")).toBe(true);
    expect(relationship.connects("element-2", "element-1")).toBe(true);
    expect(relationship.connects("element-1", "element-3")).toBe(false);
    expect(relationship.connects("element-3", "element-1")).toBe(false);
  });
});

describe("ClassRelationship.involves", () => {
  it("matches either endpoint", () => {
    const relationship = ClassRelationship.create(createProps());

    expect(relationship.involves("element-1")).toBe(true);
    expect(relationship.involves("element-2")).toBe(true);
    expect(relationship.involves("element-3")).toBe(false);
  });
});

describe("ClassRelationship.equals", () => {
  it("compares on id", () => {
    const relationship = ClassRelationship.create(createProps());
    const sameId = ClassRelationship.create(createProps({ name: "other" }));
    const otherId = ClassRelationship.create(createProps({ id: "rel-2" }));

    expect(relationship.equals(sameId)).toBe(true);
    expect(relationship.equals(otherId)).toBe(false);
  });
});
