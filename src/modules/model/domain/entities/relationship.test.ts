import { describe, expect, it } from "vitest";
import { Relationship } from "./relationship";

type CreateProps = Partial<Parameters<typeof Relationship.create>[0]>;
type ReconstituteProps = Parameters<typeof Relationship.reconstitute>[0];

const createProps = (overrides: CreateProps = {}) => ({
  id: "rel-1",
  modelId: "model-1",
  type: "ComponentExchange",
  sourceElementId: "element-1",
  targetElementId: "element-2",
  ...overrides,
});

const reconstitutable = (
  overrides: Partial<ReconstituteProps> = {},
): ReconstituteProps => ({
  id: "rel-1",
  modelId: "model-1",
  type: "ComponentExchange",
  sourceElementId: "element-1",
  targetElementId: "element-2",
  name: "bus link",
  description: "connects the bus",
  properties: { exchangeKind: "FLOW", conveyedItems: ["item-1"] },
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
  ...overrides,
});

describe("Relationship.create", () => {
  it("builds a relationship with empty defaults", () => {
    const relationship = Relationship.create(createProps());

    expect(relationship.id).toBe("rel-1");
    expect(relationship.modelId).toBe("model-1");
    expect(relationship.type.value).toBe("ComponentExchange");
    expect(relationship.sourceElementId).toBe("element-1");
    expect(relationship.targetElementId).toBe("element-2");
    expect(relationship.name).toBe("");
    expect(relationship.description).toBe("");
    expect(relationship.properties).toEqual({});
    expect(relationship.createdAt).toBeInstanceOf(Date);
    expect(relationship.updatedAt).toBeInstanceOf(Date);
  });

  it("keeps the given name, description and properties", () => {
    const relationship = Relationship.create(
      createProps({
        name: "power bus",
        description: "carries power",
        properties: { protocol: "CAN" },
      }),
    );

    expect(relationship.name).toBe("power bus");
    expect(relationship.description).toBe("carries power");
    expect(relationship.properties).toEqual({ protocol: "CAN" });
  });

  it("rejects an unregistered relationship type", () => {
    expect(() =>
      Relationship.create(createProps({ type: "BelongsTo" })),
    ).toThrow("RelationshipType is invalid : BelongsTo");
  });

  it("refuses a trace type", () => {
    expect(() =>
      Relationship.create(createProps({ type: "Realization" })),
    ).toThrow("RelationshipType is invalid : Realization");
  });
});

describe("Relationship.reconstitute", () => {
  it("restores every persisted field", () => {
    const relationship = Relationship.reconstitute(reconstitutable());

    expect(relationship.type.value).toBe("ComponentExchange");
    expect(relationship.name).toBe("bus link");
    expect(relationship.description).toBe("connects the bus");
    expect(relationship.properties.exchangeKind).toBe("FLOW");
    expect(relationship.createdAt.toISOString()).toBe(
      "2026-01-01T00:00:00.000Z",
    );
    expect(relationship.updatedAt.toISOString()).toBe(
      "2026-01-02T00:00:00.000Z",
    );
  });

  it("refuses an unregistered relationship type", () => {
    expect(() =>
      Relationship.reconstitute(reconstitutable({ type: "BelongsTo" })),
    ).toThrow("RelationshipType is invalid : BelongsTo");
  });
});

describe("Relationship mutators", () => {
  it("renames and bumps updatedAt", () => {
    const relationship = Relationship.reconstitute(reconstitutable());

    relationship.rename("renamed");

    expect(relationship.name).toBe("renamed");
    expect(relationship.updatedAt.getTime()).toBeGreaterThan(
      new Date("2026-01-02T00:00:00.000Z").getTime(),
    );
  });

  it("rejects an empty rename", () => {
    const relationship = Relationship.reconstitute(reconstitutable());

    expect(() => relationship.rename("   ")).toThrow(
      "Relationship name can't empty",
    );
    expect(() => relationship.rename(undefined)).toThrow(
      "Relationship name can't empty",
    );
    expect(relationship.name).toBe("bus link");
  });

  it("merges property updates without dropping the others", () => {
    const relationship = Relationship.reconstitute(reconstitutable());

    relationship.updateProperties({ protocol: "CAN", exchangedItems: [] });

    expect(relationship.properties).toEqual({
      exchangeKind: "FLOW",
      conveyedItems: ["item-1"],
      protocol: "CAN",
      exchangedItems: [],
    });
    expect(relationship.updatedAt.getTime()).toBeGreaterThan(
      new Date("2026-01-02T00:00:00.000Z").getTime(),
    );
  });

  it("replaces the description", () => {
    const relationship = Relationship.reconstitute(reconstitutable());

    relationship.updateDescription("rewired");

    expect(relationship.description).toBe("rewired");
    expect(relationship.updatedAt.getTime()).toBeGreaterThan(
      new Date("2026-01-02T00:00:00.000Z").getTime(),
    );
  });
});

describe("Relationship.involves", () => {
  it("knows which elements it connects", () => {
    const relationship = Relationship.reconstitute(reconstitutable());

    expect(relationship.involves("element-1")).toBe(true);
    expect(relationship.involves("element-2")).toBe(true);
    expect(relationship.involves("element-3")).toBe(false);
  });
});

describe("Relationship.toJSON", () => {
  it("serialises the type, dates and properties", () => {
    const json = Relationship.reconstitute(reconstitutable()).toJSON();

    expect(json).toEqual({
      id: "rel-1",
      modelId: "model-1",
      type: "ComponentExchange",
      sourceElementId: "element-1",
      targetElementId: "element-2",
      name: "bus link",
      description: "connects the bus",
      properties: { exchangeKind: "FLOW", conveyedItems: ["item-1"] },
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
    });
  });

  it("compares relationships by id", () => {
    const relationship = Relationship.reconstitute(reconstitutable());

    expect(
      relationship.equals(Relationship.reconstitute(reconstitutable())),
    ).toBe(true);
    expect(
      relationship.equals(
        Relationship.reconstitute(reconstitutable({ id: "other" })),
      ),
    ).toBe(false);
  });
});
