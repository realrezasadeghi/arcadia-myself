import { describe, expect, it } from "vitest";
import { ClassParameterDirection } from "../value-objects/class-parameter-direction";
import { ClassOperationParameter } from "./class-operation-parameter";

type CreateProps = Partial<
  Parameters<typeof ClassOperationParameter.create>[0]
>;
type ReconstituteProps = Parameters<
  typeof ClassOperationParameter.reconstitute
>[0];

const createProps = (overrides: CreateProps = {}) => ({
  id: "param-1",
  classOperationId: "operation-1",
  modelId: "model-1",
  layer: "LA",
  name: "amount",
  ...overrides,
});

const reconstitutable = (
  overrides: Partial<ReconstituteProps> = {},
): ReconstituteProps => ({
  id: "param-1",
  classOperationId: "operation-1",
  modelId: "model-1",
  layer: "LA",
  name: "amount",
  typeClassElementId: "element-9",
  typeLiteral: "int",
  multiplicityLower: 0,
  multiplicityUpper: "*",
  defaultValue: "0",
  direction: "INOUT",
  isOrdered: true,
  isUnique: true,
  ordering: 4,
  status: "VALIDATED",
  createdAt: "2020-01-01T00:00:00.000Z",
  updatedAt: "2020-01-02T00:00:00.000Z",
  ...overrides,
});

describe("ClassOperationParameter.create", () => {
  it("builds a draft parameter with defaults", () => {
    const parameter = ClassOperationParameter.create(createProps());

    expect(parameter.id).toBe("param-1");
    expect(parameter.classOperationId).toBe("operation-1");
    expect(parameter.modelId).toBe("model-1");
    expect(parameter.layer).toBe("LA");
    expect(parameter.name).toBe("amount");
    expect(parameter.typeClassElementId).toBeNull();
    expect(parameter.typeLiteral).toBe("");
    expect(parameter.multiplicityLower).toBe(1);
    expect(parameter.multiplicityUpper).toBe("1");
    expect(parameter.defaultValue).toBeNull();
    expect(parameter.direction.value).toBe("IN");
    expect(parameter.isOrdered).toBe(false);
    expect(parameter.isUnique).toBe(false);
    expect(parameter.ordering).toBe(0);
    expect(parameter.status).toBe("DRAFT");
    expect(parameter.createdAt).toBeInstanceOf(Date);
    expect(parameter.updatedAt).toBeInstanceOf(Date);
  });

  it("trims the name and applies the provided typing", () => {
    const parameter = ClassOperationParameter.create(
      createProps({
        name: "  amount  ",
        typeClassElementId: "element-2",
        typeLiteral: "decimal",
        multiplicityLower: 2,
        multiplicityUpper: "4",
        defaultValue: "1",
        direction: "OUT",
        isOrdered: true,
        isUnique: true,
        ordering: 5,
        status: "DEPRECATED",
      }),
    );

    expect(parameter.name).toBe("amount");
    expect(parameter.typeClassElementId).toBe("element-2");
    expect(parameter.typeLiteral).toBe("decimal");
    expect(parameter.multiplicityLower).toBe(2);
    expect(parameter.multiplicityUpper).toBe("4");
    expect(parameter.defaultValue).toBe("1");
    expect(parameter.direction.value).toBe("OUT");
    expect(parameter.isOrdered).toBe(true);
    expect(parameter.isUnique).toBe(true);
    expect(parameter.ordering).toBe(5);
    expect(parameter.status).toBe("DEPRECATED");
  });

  it("rejects a blank name and an unknown direction", () => {
    expect(() =>
      ClassOperationParameter.create(createProps({ name: "   " })),
    ).toThrow("Parameter name is required");
    expect(() =>
      ClassOperationParameter.reconstitute(
        reconstitutable({ direction: "SIDEWAYS" }),
      ),
    ).toThrow("Invalid parameter direction: SIDEWAYS");
  });
});

describe("ClassOperationParameter.reconstitute", () => {
  it("restores every persisted field", () => {
    const parameter = ClassOperationParameter.reconstitute(reconstitutable());

    expect(parameter.id).toBe("param-1");
    expect(parameter.classOperationId).toBe("operation-1");
    expect(parameter.modelId).toBe("model-1");
    expect(parameter.layer).toBe("LA");
    expect(parameter.name).toBe("amount");
    expect(parameter.typeClassElementId).toBe("element-9");
    expect(parameter.typeLiteral).toBe("int");
    expect(parameter.multiplicityLower).toBe(0);
    expect(parameter.multiplicityUpper).toBe("*");
    expect(parameter.defaultValue).toBe("0");
    expect(parameter.direction.value).toBe("INOUT");
    expect(parameter.isOrdered).toBe(true);
    expect(parameter.isUnique).toBe(true);
    expect(parameter.ordering).toBe(4);
    expect(parameter.status).toBe("VALIDATED");
    expect(parameter.createdAt.toISOString()).toBe("2020-01-01T00:00:00.000Z");
    expect(parameter.updatedAt.toISOString()).toBe("2020-01-02T00:00:00.000Z");
  });

  it("round-trips through toJSON", () => {
    const json = ClassOperationParameter.reconstitute(
      reconstitutable(),
    ).toJSON();
    const restored = ClassOperationParameter.reconstitute(json);

    expect(restored.toJSON()).toEqual(json);
  });
});

describe("ClassOperationParameter.rename", () => {
  it("trims the new name and refreshes updatedAt", () => {
    const parameter = ClassOperationParameter.reconstitute(reconstitutable());

    parameter.rename("  total  ");

    expect(parameter.name).toBe("total");
    expect(parameter.updatedAt.getTime()).toBeGreaterThan(
      Date.parse("2021-01-01T00:00:00.000Z"),
    );
  });

  it("refuses a blank name", () => {
    const parameter = ClassOperationParameter.create(createProps());

    expect(() => parameter.rename("  ")).toThrow(
      "Parameter name can't be empty",
    );
    expect(parameter.name).toBe("amount");
  });
});

describe("ClassOperationParameter.setMultiplicity", () => {
  it("stores a non-negative lower bound", () => {
    const parameter = ClassOperationParameter.create(createProps());

    parameter.setMultiplicity(0, "*");

    expect(parameter.multiplicityLower).toBe(0);
    expect(parameter.multiplicityUpper).toBe("*");
  });

  it("rejects a negative lower bound", () => {
    const parameter = ClassOperationParameter.create(createProps());

    expect(() => parameter.setMultiplicity(-1, "*")).toThrow(
      "Multiplicity lower must be >= 0",
    );
    expect(parameter.multiplicityLower).toBe(1);
  });
});

describe("ClassOperationParameter.setDirection", () => {
  it("replaces the direction value object", () => {
    const parameter = ClassOperationParameter.create(createProps());

    parameter.setDirection(ClassParameterDirection.OUT);

    expect(parameter.direction.value).toBe("OUT");
    expect(parameter.toJSON().direction).toBe("OUT");
  });
});

describe("ClassOperationParameter mutators", () => {
  it("stores typing, default and flags", () => {
    const parameter = ClassOperationParameter.create(createProps());

    parameter.setTypeClassElementId("element-7");
    parameter.setTypeLiteral("string");
    parameter.setDefaultValue("none");
    parameter.setOrdered(true);
    parameter.setUnique(true);
    parameter.setOrdering(6);

    expect(parameter.typeClassElementId).toBe("element-7");
    expect(parameter.typeLiteral).toBe("string");
    expect(parameter.defaultValue).toBe("none");
    expect(parameter.isOrdered).toBe(true);
    expect(parameter.isUnique).toBe(true);
    expect(parameter.ordering).toBe(6);

    parameter.setTypeClassElementId(null);
    expect(parameter.typeClassElementId).toBeNull();
  });
});

describe("ClassOperationParameter.validate", () => {
  it("moves a draft parameter to validated", () => {
    const parameter = ClassOperationParameter.create(createProps());

    parameter.validate();

    expect(parameter.status).toBe("VALIDATED");
  });

  it("refuses to validate a deprecated parameter", () => {
    const parameter = ClassOperationParameter.create(createProps());

    parameter.deprecate();

    expect(parameter.status).toBe("DEPRECATED");
    expect(() => parameter.validate()).toThrow(
      "Cannot validate a deprecated parameter",
    );
    expect(parameter.status).toBe("DEPRECATED");
  });
});

describe("ClassOperationParameter.equals", () => {
  it("compares on id", () => {
    const parameter = ClassOperationParameter.create(createProps());
    const sameId = ClassOperationParameter.create(
      createProps({ name: "other" }),
    );
    const otherId = ClassOperationParameter.create(
      createProps({ id: "param-2" }),
    );

    expect(parameter.equals(sameId)).toBe(true);
    expect(parameter.equals(otherId)).toBe(false);
  });
});
