import { describe, expect, it } from "vitest";
import { Fragment } from "./fragment";

type CreateProps = Partial<Parameters<typeof Fragment.create>[0]>;
type ReconstituteProps = Parameters<typeof Fragment.reconstitute>[0];

const createProps = (overrides: CreateProps = {}) => ({
  id: "fragment-1",
  scenarioId: "scenario-1",
  name: "Retry",
  operator: "loop",
  rowIndex: 2,
  columnIndex: 1,
  ...overrides,
});

const reconstitutable = (
  overrides: Partial<ReconstituteProps> = {},
): ReconstituteProps => ({
  id: "fragment-1",
  scenarioId: "scenario-1",
  name: "Retry",
  operator: "loop",
  guard: "[attempts < 3]",
  rowIndex: 2,
  columnIndex: 1,
  spanColumns: 4,
  createdAt: "2020-01-01T00:00:00.000Z",
  updatedAt: "2020-01-02T00:00:00.000Z",
  ...overrides,
});

describe("Fragment.create", () => {
  it("builds a fragment with defaults", () => {
    const fragment = Fragment.create(createProps());

    expect(fragment.id).toBe("fragment-1");
    expect(fragment.scenarioId).toBe("scenario-1");
    expect(fragment.name).toBe("Retry");
    expect(fragment.operator.value).toBe("loop");
    expect(fragment.guard).toBe("");
    expect(fragment.rowIndex).toBe(2);
    expect(fragment.columnIndex).toBe(1);
    expect(fragment.spanColumns).toBe(1);
    expect(fragment.createdAt).toBeInstanceOf(Date);
    expect(fragment.updatedAt).toBeInstanceOf(Date);
  });

  it("trims the name and applies the provided layout", () => {
    const fragment = Fragment.create(
      createProps({
        name: "  Retry  ",
        operator: "alt",
        guard: "[ok]",
        rowIndex: 4,
        columnIndex: 3,
        spanColumns: 2,
      }),
    );

    expect(fragment.name).toBe("Retry");
    expect(fragment.operator.value).toBe("alt");
    expect(fragment.guard).toBe("[ok]");
    expect(fragment.rowIndex).toBe(4);
    expect(fragment.columnIndex).toBe(3);
    expect(fragment.spanColumns).toBe(2);
  });

  it("rejects a blank name and an unknown operator", () => {
    expect(() => Fragment.create(createProps({ name: "   " }))).toThrow(
      "Fragment name is required",
    );
    expect(() => Fragment.create(createProps({ operator: "nope" }))).toThrow(
      "Invalid fragment operator: nope",
    );
  });
});

describe("Fragment.reconstitute", () => {
  it("restores every persisted field", () => {
    const fragment = Fragment.reconstitute(reconstitutable());

    expect(fragment.id).toBe("fragment-1");
    expect(fragment.scenarioId).toBe("scenario-1");
    expect(fragment.name).toBe("Retry");
    expect(fragment.operator.value).toBe("loop");
    expect(fragment.guard).toBe("[attempts < 3]");
    expect(fragment.rowIndex).toBe(2);
    expect(fragment.columnIndex).toBe(1);
    expect(fragment.spanColumns).toBe(4);
    expect(fragment.createdAt.toISOString()).toBe("2020-01-01T00:00:00.000Z");
    expect(fragment.updatedAt.toISOString()).toBe("2020-01-02T00:00:00.000Z");
  });

  it("round-trips through toJSON", () => {
    const json = Fragment.reconstitute(reconstitutable()).toJSON();
    const restored = Fragment.reconstitute(json);

    expect(restored.toJSON()).toEqual(json);
  });
});

describe("Fragment.rename", () => {
  it("trims the new name and refreshes updatedAt", () => {
    const fragment = Fragment.reconstitute(reconstitutable());

    fragment.rename("  Retry block  ");

    expect(fragment.name).toBe("Retry block");
    expect(fragment.updatedAt.getTime()).toBeGreaterThan(
      Date.parse("2021-01-01T00:00:00.000Z"),
    );
  });

  it("refuses a blank name", () => {
    const fragment = Fragment.create(createProps());

    expect(() => fragment.rename("   ")).toThrow(
      "Fragment name cannot be empty",
    );
    expect(fragment.name).toBe("Retry");
  });
});

describe("Fragment.updateGuard", () => {
  it("stores the guard", () => {
    const fragment = Fragment.create(createProps());

    fragment.updateGuard("[attempts > 1]");

    expect(fragment.guard).toBe("[attempts > 1]");
  });
});

describe("Fragment.setPosition", () => {
  it("stores both coordinates and refreshes updatedAt", () => {
    const fragment = Fragment.reconstitute(reconstitutable());

    fragment.setPosition(5, 6);

    expect(fragment.rowIndex).toBe(5);
    expect(fragment.columnIndex).toBe(6);
    expect(fragment.updatedAt.getTime()).toBeGreaterThan(
      Date.parse("2021-01-01T00:00:00.000Z"),
    );
  });

  it("rejects negative coordinates", () => {
    const fragment = Fragment.create(createProps());

    expect(() => fragment.setPosition(-1, 0)).toThrow(
      "Row index must be non-negative",
    );
    expect(() => fragment.setPosition(0, -1)).toThrow(
      "Column index must be non-negative",
    );
    expect(fragment.rowIndex).toBe(2);
    expect(fragment.columnIndex).toBe(1);
  });
});

describe("Fragment.setSpanColumns", () => {
  it("stores a span of at least one column", () => {
    const fragment = Fragment.create(createProps());

    fragment.setSpanColumns(3);

    expect(fragment.spanColumns).toBe(3);
  });

  it("rejects a span below one", () => {
    const fragment = Fragment.create(createProps());

    expect(() => fragment.setSpanColumns(0)).toThrow(
      "Span columns must be at least 1",
    );
    expect(() => fragment.setSpanColumns(-2)).toThrow(
      "Span columns must be at least 1",
    );
    expect(fragment.spanColumns).toBe(1);
  });
});

describe("Fragment.equals", () => {
  it("compares on id", () => {
    const fragment = Fragment.create(createProps());
    const sameId = Fragment.create(createProps({ name: "Other" }));
    const otherId = Fragment.create(createProps({ id: "fragment-2" }));

    expect(fragment.equals(sameId)).toBe(true);
    expect(fragment.equals(otherId)).toBe(false);
  });
});
