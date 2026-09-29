import { describe, expect, it } from "vitest";
import { FragmentOperand } from "./fragment-operand";

type CreateProps = Partial<Parameters<typeof FragmentOperand.create>[0]>;
type ReconstituteProps = Parameters<typeof FragmentOperand.reconstitute>[0];

const createProps = (overrides: CreateProps = {}) => ({
  id: "operand-1",
  fragmentId: "fragment-1",
  position: 0,
  ...overrides,
});

const reconstitutable = (
  overrides: Partial<ReconstituteProps> = {},
): ReconstituteProps => ({
  id: "operand-1",
  fragmentId: "fragment-1",
  position: 2,
  guard: "[ok]",
  createdAt: "2020-01-01T00:00:00.000Z",
  updatedAt: "2020-01-02T00:00:00.000Z",
  ...overrides,
});

describe("FragmentOperand.create", () => {
  it("builds an operand with an empty guard", () => {
    const operand = FragmentOperand.create(createProps());

    expect(operand.id).toBe("operand-1");
    expect(operand.fragmentId).toBe("fragment-1");
    expect(operand.position).toBe(0);
    expect(operand.guard).toBe("");
    expect(operand.createdAt).toBeInstanceOf(Date);
    expect(operand.updatedAt).toBeInstanceOf(Date);
  });

  it("keeps the provided position and guard", () => {
    const operand = FragmentOperand.create(
      createProps({ position: 3, guard: "[retry]" }),
    );

    expect(operand.position).toBe(3);
    expect(operand.guard).toBe("[retry]");
  });
});

describe("FragmentOperand.reconstitute", () => {
  it("restores every persisted field", () => {
    const operand = FragmentOperand.reconstitute(reconstitutable());

    expect(operand.id).toBe("operand-1");
    expect(operand.fragmentId).toBe("fragment-1");
    expect(operand.position).toBe(2);
    expect(operand.guard).toBe("[ok]");
    expect(operand.createdAt.toISOString()).toBe("2020-01-01T00:00:00.000Z");
    expect(operand.updatedAt.toISOString()).toBe("2020-01-02T00:00:00.000Z");
  });

  it("round-trips through toJSON", () => {
    const json = FragmentOperand.reconstitute(reconstitutable()).toJSON();
    const restored = FragmentOperand.reconstitute(json);

    expect(restored.toJSON()).toEqual(json);
  });
});

describe("FragmentOperand.updatePosition", () => {
  it("stores the position and refreshes updatedAt", () => {
    const operand = FragmentOperand.reconstitute(reconstitutable());

    operand.updatePosition(5);

    expect(operand.position).toBe(5);
    expect(operand.updatedAt.getTime()).toBeGreaterThan(
      Date.parse("2021-01-01T00:00:00.000Z"),
    );
  });
});

describe("FragmentOperand.updateGuard", () => {
  it("stores the guard and refreshes updatedAt", () => {
    const operand = FragmentOperand.reconstitute(reconstitutable());

    operand.updateGuard("[failed]");

    expect(operand.guard).toBe("[failed]");
    expect(operand.updatedAt.getTime()).toBeGreaterThan(
      Date.parse("2021-01-01T00:00:00.000Z"),
    );
  });
});

describe("FragmentOperand.equals", () => {
  it("compares on id", () => {
    const operand = FragmentOperand.create(createProps());
    const sameId = FragmentOperand.create(createProps({ position: 9 }));
    const otherId = FragmentOperand.create(createProps({ id: "operand-2" }));

    expect(operand.equals(sameId)).toBe(true);
    expect(operand.equals(otherId)).toBe(false);
  });
});
