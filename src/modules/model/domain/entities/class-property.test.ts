import { describe, expect, it } from "vitest";
import { AggregationKind } from "../value-objects/aggregation-kind";
import { ClassCollectionKind } from "../value-objects/class-collection-kind";
import { ClassVisibility } from "../value-objects/class-visibility";
import { ClassProperty } from "./class-property";

type CreateProps = Partial<Parameters<typeof ClassProperty.create>[0]>;
type ReconstituteProps = Parameters<typeof ClassProperty.reconstitute>[0];

const createProps = (overrides: CreateProps = {}) => ({
  id: "property-1",
  classElementId: "element-1",
  modelId: "model-1",
  layer: "LA",
  name: "status",
  ...overrides,
});

const reconstitutable = (
  overrides: Partial<ReconstituteProps> = {},
): ReconstituteProps => ({
  id: "property-1",
  classElementId: "element-1",
  modelId: "model-1",
  layer: "LA",
  name: "status",
  description: "lifecycle flag",
  typeClassElementId: "element-2",
  typeLiteral: "OrderStatus",
  isStatic: true,
  isReadOnly: true,
  isDerived: true,
  isID: true,
  visibility: ClassVisibility.PROTECTED,
  multiplicityLower: 0,
  multiplicityUpper: "*",
  isOrdered: true,
  isUnique: true,
  collectionKind: ClassCollectionKind.SET,
  aggregationKind: AggregationKind.COMPOSITE,
  defaultValue: "OPEN",
  ordering: 5,
  status: "VALIDATED",
  createdAt: "2020-01-01T00:00:00.000Z",
  updatedAt: "2020-01-02T00:00:00.000Z",
  ...overrides,
});

describe("ClassProperty.create", () => {
  it("builds a draft property with defaults", () => {
    const property = ClassProperty.create(createProps());

    expect(property.id).toBe("property-1");
    expect(property.classElementId).toBe("element-1");
    expect(property.modelId).toBe("model-1");
    expect(property.layer).toBe("LA");
    expect(property.name).toBe("status");
    expect(property.description).toBe("");
    expect(property.typeClassElementId).toBeNull();
    expect(property.typeLiteral).toBe("");
    expect(property.isStatic).toBe(false);
    expect(property.isReadOnly).toBe(false);
    expect(property.isDerived).toBe(false);
    expect(property.isID).toBe(false);
    expect(property.visibility.value).toBe("public");
    expect(property.multiplicityLower).toBe(1);
    expect(property.multiplicityUpper).toBe("1");
    expect(property.isOrdered).toBe(false);
    expect(property.isUnique).toBe(false);
    expect(property.collectionKind.value).toBe("NONE");
    expect(property.aggregationKind.value).toBe("NONE");
    expect(property.defaultValue).toBe("");
    expect(property.ordering).toBe(0);
    expect(property.status).toBe("DRAFT");
    expect(property.createdAt).toBeInstanceOf(Date);
    expect(property.updatedAt).toBeInstanceOf(Date);
  });

  it("trims the name and applies the provided typing", () => {
    const property = ClassProperty.create(
      createProps({
        name: "  status  ",
        description: "lifecycle flag",
        typeClassElementId: "element-2",
        typeLiteral: "OrderStatus",
        isStatic: true,
        isReadOnly: true,
        isDerived: true,
        isID: true,
        visibility: ClassVisibility.PROTECTED,
        multiplicityLower: 0,
        multiplicityUpper: "*",
        isOrdered: true,
        isUnique: true,
        collectionKind: ClassCollectionKind.SET,
        aggregationKind: AggregationKind.COMPOSITE,
        defaultValue: "OPEN",
        ordering: 5,
        status: "DEPRECATED",
      }),
    );

    expect(property.name).toBe("status");
    expect(property.description).toBe("lifecycle flag");
    expect(property.typeLiteral).toBe("OrderStatus");
    expect(property.visibility.value).toBe("protected");
    expect(property.multiplicityLower).toBe(0);
    expect(property.multiplicityUpper).toBe("*");
    expect(property.collectionKind.value).toBe("SET");
    expect(property.aggregationKind.value).toBe("COMPOSITE");
    expect(property.defaultValue).toBe("OPEN");
    expect(property.ordering).toBe(5);
    expect(property.status).toBe("DEPRECATED");
  });

  it("rejects a blank name", () => {
    expect(() => ClassProperty.create(createProps({ name: " " }))).toThrow(
      "Property name is required",
    );
  });
});

describe("ClassProperty.reconstitute", () => {
  it("restores every persisted field", () => {
    const property = ClassProperty.reconstitute(reconstitutable());

    expect(property.id).toBe("property-1");
    expect(property.classElementId).toBe("element-1");
    expect(property.modelId).toBe("model-1");
    expect(property.layer).toBe("LA");
    expect(property.name).toBe("status");
    expect(property.description).toBe("lifecycle flag");
    expect(property.typeClassElementId).toBe("element-2");
    expect(property.typeLiteral).toBe("OrderStatus");
    expect(property.isStatic).toBe(true);
    expect(property.isReadOnly).toBe(true);
    expect(property.isDerived).toBe(true);
    expect(property.isID).toBe(true);
    expect(property.visibility.value).toBe("protected");
    expect(property.multiplicityLower).toBe(0);
    expect(property.multiplicityUpper).toBe("*");
    expect(property.isOrdered).toBe(true);
    expect(property.isUnique).toBe(true);
    expect(property.collectionKind.value).toBe("SET");
    expect(property.aggregationKind.value).toBe("COMPOSITE");
    expect(property.defaultValue).toBe("OPEN");
    expect(property.ordering).toBe(5);
    expect(property.status).toBe("VALIDATED");
    expect(property.createdAt.toISOString()).toBe("2020-01-01T00:00:00.000Z");
    expect(property.updatedAt.toISOString()).toBe("2020-01-02T00:00:00.000Z");
  });

  it("round-trips through toJSON", () => {
    const json = ClassProperty.reconstitute(reconstitutable()).toJSON();
    const restored = ClassProperty.reconstitute({
      ...json,
      visibility: ClassVisibility.from(json.visibility),
      collectionKind: ClassCollectionKind.from(json.collectionKind),
      aggregationKind: AggregationKind.from(json.aggregationKind),
    });

    expect(restored.toJSON()).toEqual(json);
  });
});

describe("ClassProperty.rename", () => {
  it("trims the new name and refreshes updatedAt", () => {
    const property = ClassProperty.reconstitute(reconstitutable());

    property.rename("  state  ");

    expect(property.name).toBe("state");
    expect(property.updatedAt.getTime()).toBeGreaterThan(
      Date.parse("2021-01-01T00:00:00.000Z"),
    );
  });

  it("refuses a blank name", () => {
    const property = ClassProperty.create(createProps());

    expect(() => property.rename("   ")).toThrow(
      "Property name can't be empty",
    );
    expect(property.name).toBe("status");
  });
});

describe("ClassProperty.setMultiplicity", () => {
  it("stores a non-negative lower bound", () => {
    const property = ClassProperty.create(createProps());

    property.setMultiplicity(0, "*");

    expect(property.multiplicityLower).toBe(0);
    expect(property.multiplicityUpper).toBe("*");
  });

  it("rejects a negative lower bound", () => {
    const property = ClassProperty.create(createProps());

    expect(() => property.setMultiplicity(-1, "*")).toThrow(
      "Multiplicity lower must be >= 0",
    );
    expect(property.multiplicityLower).toBe(1);
  });
});

describe("ClassProperty value object setters", () => {
  it("replaces visibility, collection kind and aggregation kind", () => {
    const property = ClassProperty.create(createProps());

    property.setVisibility(ClassVisibility.PRIVATE);
    property.setCollectionKind(ClassCollectionKind.ORDERED_SET);
    property.setAggregationKind(AggregationKind.SHARED);

    expect(property.visibility.value).toBe("private");
    expect(property.collectionKind.value).toBe("ORDERED_SET");
    expect(property.aggregationKind.value).toBe("SHARED");
    expect(property.toJSON().visibility).toBe("private");
    expect(property.toJSON().collectionKind).toBe("ORDERED_SET");
    expect(property.toJSON().aggregationKind).toBe("SHARED");
  });
});

describe("ClassProperty mutators", () => {
  it("stores description, type and flags", () => {
    const property = ClassProperty.create(createProps());

    property.setDescription("updated");
    property.setTypeClassElementId("element-8");
    property.setTypeLiteral("string");
    property.setStatic(true);
    property.setReadOnly(true);
    property.setDerived(true);
    property.setID(true);
    property.setDefaultValue("none");
    property.setOrdering(3);

    expect(property.description).toBe("updated");
    expect(property.typeClassElementId).toBe("element-8");
    expect(property.typeLiteral).toBe("string");
    expect(property.isStatic).toBe(true);
    expect(property.isReadOnly).toBe(true);
    expect(property.isDerived).toBe(true);
    expect(property.isID).toBe(true);
    expect(property.defaultValue).toBe("none");
    expect(property.ordering).toBe(3);

    property.setTypeClassElementId(null);
    expect(property.typeClassElementId).toBeNull();
  });
});

describe("ClassProperty.validate", () => {
  it("moves a draft property to validated", () => {
    const property = ClassProperty.create(createProps());

    property.validate();

    expect(property.status).toBe("VALIDATED");
  });

  it("refuses to validate a deprecated property", () => {
    const property = ClassProperty.create(createProps());

    property.deprecate();

    expect(property.status).toBe("DEPRECATED");
    expect(() => property.validate()).toThrow(
      "Cannot validate a deprecated property",
    );
    expect(property.status).toBe("DEPRECATED");
  });
});

describe("ClassProperty.equals", () => {
  it("compares on id", () => {
    const property = ClassProperty.create(createProps());
    const sameId = ClassProperty.create(createProps({ name: "other" }));
    const otherId = ClassProperty.create(createProps({ id: "property-2" }));

    expect(property.equals(sameId)).toBe(true);
    expect(property.equals(otherId)).toBe(false);
  });
});
