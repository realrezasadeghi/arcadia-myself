import { describe, expect, it } from "vitest";
import { Scenario } from "./scenario";

type CreateProps = Partial<Parameters<typeof Scenario.create>[0]>;
type ReconstituteProps = Parameters<typeof Scenario.reconstitute>[0];

const createProps = (overrides: CreateProps = {}) => ({
  id: "scenario-1",
  modelId: "model-1",
  name: "  Boot sequence  ",
  scenarioType: "SS",
  ...overrides,
});

const reconstitutable = (
  overrides: Partial<ReconstituteProps> = {},
): ReconstituteProps => ({
  id: "scenario-1",
  modelId: "model-1",
  name: "Boot sequence",
  description: "how the system starts",
  scenarioType: "SS",
  status: "DRAFT",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
  ...overrides,
});

describe("Scenario.create", () => {
  it("builds a draft scenario with a trimmed name", () => {
    const scenario = Scenario.create(createProps());

    expect(scenario.id).toBe("scenario-1");
    expect(scenario.modelId).toBe("model-1");
    expect(scenario.name).toBe("Boot sequence");
    expect(scenario.description).toBe("");
    expect(scenario.scenarioType.value).toBe("SS");
    expect(scenario.status).toBe("DRAFT");
    expect(scenario.createdAt).toBeInstanceOf(Date);
  });

  it("keeps a provided description", () => {
    const scenario = Scenario.create(
      createProps({ description: "startup flow" }),
    );

    expect(scenario.description).toBe("startup flow");
  });

  it("rejects a blank name and an unknown scenario type", () => {
    expect(() => Scenario.create(createProps({ name: "   " }))).toThrow(
      "Scenario name is required",
    );
    expect(() => Scenario.create(createProps({ scenarioType: "CS" }))).toThrow(
      "Invalid scenario type: CS",
    );
  });

  it("places the scenario in the layer of its type", () => {
    const scenario = Scenario.create(createProps({ scenarioType: "PS" }));

    expect(scenario.scenarioType.layer.value).toBe("PA");
  });
});

describe("Scenario.reconstitute", () => {
  it("restores every persisted field", () => {
    const scenario = Scenario.reconstitute(reconstitutable());

    expect(scenario.name).toBe("Boot sequence");
    expect(scenario.description).toBe("how the system starts");
    expect(scenario.status).toBe("DRAFT");
    expect(scenario.createdAt.toISOString()).toBe("2026-01-01T00:00:00.000Z");
    expect(scenario.updatedAt.toISOString()).toBe("2026-01-02T00:00:00.000Z");
  });

  it("refuses an unknown scenario type", () => {
    expect(() =>
      Scenario.reconstitute(reconstitutable({ scenarioType: "CS" })),
    ).toThrow("Invalid scenario type: CS");
  });
});

describe("Scenario mutators", () => {
  it("renames with a trimmed value and bumps updatedAt", () => {
    const scenario = Scenario.reconstitute(reconstitutable());

    scenario.rename("  Cold start  ");

    expect(scenario.name).toBe("Cold start");
    expect(scenario.updatedAt.getTime()).toBeGreaterThan(
      new Date("2026-01-02T00:00:00.000Z").getTime(),
    );
  });

  it("rejects an empty rename", () => {
    const scenario = Scenario.reconstitute(reconstitutable());

    expect(() => scenario.rename("   ")).toThrow(
      "Scenario name cannot be empty",
    );
    expect(scenario.name).toBe("Boot sequence");
  });

  it("replaces the description and bumps updatedAt", () => {
    const scenario = Scenario.reconstitute(reconstitutable());

    scenario.updateDescription("starts the bus");

    expect(scenario.description).toBe("starts the bus");
    expect(scenario.updatedAt.getTime()).toBeGreaterThan(
      new Date("2026-01-02T00:00:00.000Z").getTime(),
    );
  });
});

describe("Scenario status", () => {
  it("moves from draft to validated", () => {
    const scenario = Scenario.reconstitute(reconstitutable());

    scenario.validate();

    expect(scenario.status).toBe("VALIDATED");
    expect(scenario.updatedAt.getTime()).toBeGreaterThan(
      new Date("2026-01-02T00:00:00.000Z").getTime(),
    );
  });

  it("cannot validate a deprecated scenario", () => {
    const scenario = Scenario.reconstitute(
      reconstitutable({ status: "DEPRECATED" }),
    );

    expect(() => scenario.validate()).toThrow(
      "Cannot validate a deprecated scenario",
    );
    expect(scenario.status).toBe("DEPRECATED");
  });

  it("deprecates and returns to draft", () => {
    const scenario = Scenario.reconstitute(reconstitutable());

    scenario.deprecate();
    expect(scenario.status).toBe("DEPRECATED");

    scenario.revertToDraft();
    expect(scenario.status).toBe("DRAFT");
    expect(scenario.updatedAt.getTime()).toBeGreaterThan(
      new Date("2026-01-02T00:00:00.000Z").getTime(),
    );
  });
});

describe("Scenario.toJSON", () => {
  it("serialises the type, status and dates", () => {
    const json = Scenario.reconstitute(reconstitutable()).toJSON();

    expect(json).toEqual({
      id: "scenario-1",
      modelId: "model-1",
      name: "Boot sequence",
      description: "how the system starts",
      scenarioType: "SS",
      status: "DRAFT",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
    });
  });

  it("compares scenarios by id", () => {
    const scenario = Scenario.reconstitute(reconstitutable());

    expect(scenario.equals(Scenario.reconstitute(reconstitutable()))).toBe(
      true,
    );
    expect(
      scenario.equals(Scenario.reconstitute(reconstitutable({ id: "other" }))),
    ).toBe(false);
  });
});
