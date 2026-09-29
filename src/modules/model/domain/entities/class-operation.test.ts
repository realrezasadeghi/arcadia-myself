import { describe, expect, it } from "vitest";
import { ClassVisibility } from "../value-objects/class-visibility";
import { ClassOperation } from "./class-operation";

type CreateProps = Partial<Parameters<typeof ClassOperation.create>[0]>;
type ReconstituteProps = Parameters<typeof ClassOperation.reconstitute>[0];

const createProps = (overrides: CreateProps = {}) => ({
  id: "operation-1",
  classElementId: "element-1",
  modelId: "model-1",
  layer: "LA",
  name: "charge",
  ...overrides,
});

const reconstitutable = (
  overrides: Partial<ReconstituteProps> = {},
): ReconstituteProps => ({
  id: "operation-1",
  classElementId: "element-1",
  modelId: "model-1",
  layer: "LA",
  name: "charge",
  description: "charges the card",
  returnTypeClassElementId: "element-2",
  returnTypeLiteral: "Receipt",
  returnMultiplicityLower: 0,
  returnMultiplicityUpper: "*",
  isStatic: true,
  isAbstract: true,
  isQuery: true,
  visibility: "private",
  ordering: 4,
  status: "VALIDATED",
  createdAt: "2020-01-01T00:00:00.000Z",
  updatedAt: "2020-01-02T00:00:00.000Z",
  ...overrides,
});

describe("ClassOperation.create", () => {
  it("builds a draft operation with defaults", () => {
    const operation = ClassOperation.create(createProps());

    expect(operation.id).toBe("operation-1");
    expect(operation.classElementId).toBe("element-1");
    expect(operation.modelId).toBe("model-1");
    expect(operation.layer).toBe("LA");
    expect(operation.name).toBe("charge");
    expect(operation.description).toBe("");
    expect(operation.returnTypeClassElementId).toBeNull();
    expect(operation.returnTypeLiteral).toBe("");
    expect(operation.returnMultiplicityLower).toBe(1);
    expect(operation.returnMultiplicityUpper).toBe("1");
    expect(operation.isStatic).toBe(false);
    expect(operation.isAbstract).toBe(false);
    expect(operation.isQuery).toBe(false);
    expect(operation.visibility.value).toBe("public");
    expect(operation.ordering).toBe(0);
    expect(operation.status).toBe("DRAFT");
    expect(operation.createdAt).toBeInstanceOf(Date);
    expect(operation.updatedAt).toBeInstanceOf(Date);
  });

  it("trims the name and applies the provided signature", () => {
    const operation = ClassOperation.create(
      createProps({
        name: "  charge  ",
        description: "charges the card",
        returnTypeClassElementId: "element-2",
        returnTypeLiteral: "Receipt",
        returnMultiplicityLower: 0,
        returnMultiplicityUpper: "*",
        isStatic: true,
        isAbstract: true,
        isQuery: true,
        visibility: "protected",
        ordering: 4,
        status: "DEPRECATED",
      }),
    );

    expect(operation.name).toBe("charge");
    expect(operation.description).toBe("charges the card");
    expect(operation.returnTypeClassElementId).toBe("element-2");
    expect(operation.returnTypeLiteral).toBe("Receipt");
    expect(operation.returnMultiplicityLower).toBe(0);
    expect(operation.returnMultiplicityUpper).toBe("*");
    expect(operation.isStatic).toBe(true);
    expect(operation.isAbstract).toBe(true);
    expect(operation.isQuery).toBe(true);
    expect(operation.visibility.value).toBe("protected");
    expect(operation.ordering).toBe(4);
    expect(operation.status).toBe("DEPRECATED");
  });

  it("rejects a blank name and an unknown visibility", () => {
    expect(() => ClassOperation.create(createProps({ name: "   " }))).toThrow(
      "Operation name is required",
    );
    expect(() =>
      ClassOperation.create(createProps({ visibility: "hidden" })),
    ).toThrow("Invalid visibility: hidden");
  });
});

describe("ClassOperation.reconstitute", () => {
  it("restores every persisted field", () => {
    const operation = ClassOperation.reconstitute(reconstitutable());

    expect(operation.id).toBe("operation-1");
    expect(operation.classElementId).toBe("element-1");
    expect(operation.modelId).toBe("model-1");
    expect(operation.layer).toBe("LA");
    expect(operation.name).toBe("charge");
    expect(operation.description).toBe("charges the card");
    expect(operation.returnTypeClassElementId).toBe("element-2");
    expect(operation.returnTypeLiteral).toBe("Receipt");
    expect(operation.returnMultiplicityLower).toBe(0);
    expect(operation.returnMultiplicityUpper).toBe("*");
    expect(operation.isStatic).toBe(true);
    expect(operation.isAbstract).toBe(true);
    expect(operation.isQuery).toBe(true);
    expect(operation.visibility.value).toBe("private");
    expect(operation.ordering).toBe(4);
    expect(operation.status).toBe("VALIDATED");
    expect(operation.createdAt.toISOString()).toBe("2020-01-01T00:00:00.000Z");
    expect(operation.updatedAt.toISOString()).toBe("2020-01-02T00:00:00.000Z");
  });

  it("rejects an unknown visibility while loading", () => {
    expect(() =>
      ClassOperation.reconstitute(reconstitutable({ visibility: "secret" })),
    ).toThrow("Invalid visibility: secret");
  });

  it("round-trips through toJSON", () => {
    const json = ClassOperation.reconstitute(reconstitutable()).toJSON();
    const restored = ClassOperation.reconstitute(json);

    expect(restored.toJSON()).toEqual(json);
  });
});

describe("ClassOperation.rename", () => {
  it("trims the new name and refreshes updatedAt", () => {
    const operation = ClassOperation.reconstitute(reconstitutable());

    operation.rename("  refund  ");

    expect(operation.name).toBe("refund");
    expect(operation.updatedAt.getTime()).toBeGreaterThan(
      Date.parse("2021-01-01T00:00:00.000Z"),
    );
  });

  it("refuses a blank name", () => {
    const operation = ClassOperation.create(createProps());

    expect(() => operation.rename("   ")).toThrow(
      "Operation name can't be empty",
    );
    expect(operation.name).toBe("charge");
  });
});

describe("ClassOperation.setReturnMultiplicity", () => {
  it("stores a non-negative lower bound", () => {
    const operation = ClassOperation.create(createProps());

    operation.setReturnMultiplicity(0, "*");

    expect(operation.returnMultiplicityLower).toBe(0);
    expect(operation.returnMultiplicityUpper).toBe("*");
  });

  it("rejects a negative lower bound", () => {
    const operation = ClassOperation.create(createProps());

    expect(() => operation.setReturnMultiplicity(-1, "*")).toThrow(
      "Return multiplicity lower must be >= 0",
    );
    expect(operation.returnMultiplicityLower).toBe(1);
  });
});

describe("ClassOperation.setVisibility", () => {
  it("replaces the visibility and rejects unknown values", () => {
    const operation = ClassOperation.create(createProps());

    operation.setVisibility("protected");
    expect(operation.visibility.value).toBe("protected");
    expect(operation.toJSON().visibility).toBe("protected");

    expect(() => operation.setVisibility("secret")).toThrow(
      "Invalid visibility: secret",
    );
    expect(operation.visibility.value).toBe("protected");

    operation.setVisibility("package");
    expect(operation.visibility).toBe(ClassVisibility.PACKAGE);
  });
});

describe("ClassOperation mutators", () => {
  it("stores description, return type and flags", () => {
    const operation = ClassOperation.create(createProps());

    operation.setDescription("updated");
    operation.setReturnTypeClassElementId("element-5");
    operation.setReturnTypeLiteral("boolean");
    operation.setStatic(true);
    operation.setAbstract(true);
    operation.setQuery(true);
    operation.setOrdering(9);

    expect(operation.description).toBe("updated");
    expect(operation.returnTypeClassElementId).toBe("element-5");
    expect(operation.returnTypeLiteral).toBe("boolean");
    expect(operation.isStatic).toBe(true);
    expect(operation.isAbstract).toBe(true);
    expect(operation.isQuery).toBe(true);
    expect(operation.ordering).toBe(9);

    operation.setReturnTypeClassElementId(null);
    expect(operation.returnTypeClassElementId).toBeNull();
  });
});

describe("ClassOperation.validate", () => {
  it("moves a draft operation to validated", () => {
    const operation = ClassOperation.create(createProps());

    operation.validate();

    expect(operation.status).toBe("VALIDATED");
  });

  it("refuses to validate a deprecated operation", () => {
    const operation = ClassOperation.create(createProps());

    operation.deprecate();

    expect(operation.status).toBe("DEPRECATED");
    expect(() => operation.validate()).toThrow(
      "Cannot validate a deprecated operation",
    );
    expect(operation.status).toBe("DEPRECATED");
  });
});

describe("ClassOperation.equals", () => {
  it("compares on id", () => {
    const operation = ClassOperation.create(createProps());
    const sameId = ClassOperation.create(createProps({ name: "other" }));
    const otherId = ClassOperation.create(createProps({ id: "operation-2" }));

    expect(operation.equals(sameId)).toBe(true);
    expect(operation.equals(otherId)).toBe(false);
  });
});
