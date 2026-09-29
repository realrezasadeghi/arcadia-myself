import { describe, expect, it } from "vitest";
import { ClassEnumerationLiteral } from "./class-enumeration-literal";

type CreateProps = Partial<
  Parameters<typeof ClassEnumerationLiteral.create>[0]
>;
type ReconstituteProps = Parameters<
  typeof ClassEnumerationLiteral.reconstitute
>[0];

const createProps = (overrides: CreateProps = {}) => ({
  id: "literal-1",
  classElementId: "element-1",
  modelId: "model-1",
  layer: "LA",
  name: "RED",
  ...overrides,
});

const reconstitutable = (
  overrides: Partial<ReconstituteProps> = {},
): ReconstituteProps => ({
  id: "literal-1",
  classElementId: "element-1",
  modelId: "model-1",
  layer: "LA",
  name: "RED",
  value: "#ff0000",
  ordering: 3,
  status: "VALIDATED",
  createdAt: "2020-01-01T00:00:00.000Z",
  updatedAt: "2020-01-02T00:00:00.000Z",
  ...overrides,
});

describe("ClassEnumerationLiteral.create", () => {
  it("builds a draft literal with defaults", () => {
    const literal = ClassEnumerationLiteral.create(createProps());

    expect(literal.id).toBe("literal-1");
    expect(literal.classElementId).toBe("element-1");
    expect(literal.modelId).toBe("model-1");
    expect(literal.layer).toBe("LA");
    expect(literal.name).toBe("RED");
    expect(literal.value).toBe("");
    expect(literal.ordering).toBe(0);
    expect(literal.status).toBe("DRAFT");
    expect(literal.createdAt).toBeInstanceOf(Date);
    expect(literal.updatedAt).toBeInstanceOf(Date);
  });

  it("trims the name and applies the provided value", () => {
    const literal = ClassEnumerationLiteral.create(
      createProps({
        name: "  BLUE  ",
        value: "#0000ff",
        ordering: 2,
        status: "DEPRECATED",
      }),
    );

    expect(literal.name).toBe("BLUE");
    expect(literal.value).toBe("#0000ff");
    expect(literal.ordering).toBe(2);
    expect(literal.status).toBe("DEPRECATED");
  });

  it("rejects a blank name", () => {
    expect(() =>
      ClassEnumerationLiteral.create(createProps({ name: "   " })),
    ).toThrow("Enumeration literal name is required");
  });
});

describe("ClassEnumerationLiteral.reconstitute", () => {
  it("restores every persisted field", () => {
    const literal = ClassEnumerationLiteral.reconstitute(reconstitutable());

    expect(literal.id).toBe("literal-1");
    expect(literal.classElementId).toBe("element-1");
    expect(literal.modelId).toBe("model-1");
    expect(literal.layer).toBe("LA");
    expect(literal.name).toBe("RED");
    expect(literal.value).toBe("#ff0000");
    expect(literal.ordering).toBe(3);
    expect(literal.status).toBe("VALIDATED");
    expect(literal.createdAt.toISOString()).toBe("2020-01-01T00:00:00.000Z");
    expect(literal.updatedAt.toISOString()).toBe("2020-01-02T00:00:00.000Z");
  });

  it("round-trips through toJSON", () => {
    const json = ClassEnumerationLiteral.reconstitute(
      reconstitutable(),
    ).toJSON();
    const restored = ClassEnumerationLiteral.reconstitute(json);

    expect(restored.toJSON()).toEqual(json);
  });
});

describe("ClassEnumerationLiteral.rename", () => {
  it("trims the new name and refreshes updatedAt", () => {
    const literal = ClassEnumerationLiteral.reconstitute(reconstitutable());

    literal.rename("  GREEN  ");

    expect(literal.name).toBe("GREEN");
    expect(literal.updatedAt.getTime()).toBeGreaterThan(
      Date.parse("2021-01-01T00:00:00.000Z"),
    );
  });

  it("refuses a blank name", () => {
    const literal = ClassEnumerationLiteral.create(createProps());

    expect(() => literal.rename("   ")).toThrow(
      "Enumeration literal name can't be empty",
    );
    expect(literal.name).toBe("RED");
  });
});

describe("ClassEnumerationLiteral.setValue", () => {
  it("stores the new value", () => {
    const literal = ClassEnumerationLiteral.create(createProps());

    literal.setValue("#00ff00");

    expect(literal.value).toBe("#00ff00");
  });
});

describe("ClassEnumerationLiteral.setOrdering", () => {
  it("stores the new ordering", () => {
    const literal = ClassEnumerationLiteral.create(createProps());

    literal.setOrdering(7);

    expect(literal.ordering).toBe(7);
  });
});

describe("ClassEnumerationLiteral.validate", () => {
  it("moves a draft literal to validated", () => {
    const literal = ClassEnumerationLiteral.create(createProps());

    literal.validate();

    expect(literal.status).toBe("VALIDATED");
  });

  it("refuses to validate a deprecated literal", () => {
    const literal = ClassEnumerationLiteral.create(createProps());

    literal.deprecate();

    expect(literal.status).toBe("DEPRECATED");
    expect(() => literal.validate()).toThrow(
      "Cannot validate a deprecated enumeration literal",
    );
    expect(literal.status).toBe("DEPRECATED");
  });
});

describe("ClassEnumerationLiteral.equals", () => {
  it("compares on id", () => {
    const literal = ClassEnumerationLiteral.create(createProps());
    const sameId = ClassEnumerationLiteral.create(
      createProps({ name: "BLUE" }),
    );
    const otherId = ClassEnumerationLiteral.create(
      createProps({ id: "literal-2" }),
    );

    expect(literal.equals(sameId)).toBe(true);
    expect(literal.equals(otherId)).toBe(false);
  });
});
