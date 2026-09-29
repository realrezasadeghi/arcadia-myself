import { describe, expect, it } from "vitest";
import { Model } from "./model";

type ReconstituteProps = Parameters<typeof Model.reconstitute>[0];

const reconstitutable = (
  overrides: Partial<ReconstituteProps> = {},
): ReconstituteProps => ({
  id: "model-1",
  projectId: "project-1",
  layer: "LA",
  name: "Logical model",
  description: "architecture of the logical layer",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
  ...overrides,
});

describe("Model.create", () => {
  it("builds a model with a trimmed name and an empty description", () => {
    const model = Model.create({
      id: "model-1",
      projectId: "project-1",
      layer: "LA",
      name: "  Logical model  ",
    });

    expect(model.id).toBe("model-1");
    expect(model.projectId).toBe("project-1");
    expect(model.layer.value).toBe("LA");
    expect(model.name).toBe("Logical model");
    expect(model.description).toBe("");
    expect(model.createdAt).toBeInstanceOf(Date);
    expect(model.updatedAt).toBeInstanceOf(Date);
  });

  it("keeps a provided description", () => {
    const model = Model.create({
      id: "model-1",
      projectId: "project-1",
      layer: "SA",
      name: "System",
      description: "system layer",
    });

    expect(model.description).toBe("system layer");
  });

  it("rejects a blank name and an unknown layer", () => {
    expect(() =>
      Model.create({ id: "m", projectId: "p", layer: "LA", name: "   " }),
    ).toThrow("Model name is required.");

    expect(() =>
      Model.create({ id: "m", projectId: "p", layer: "XX", name: "Model" }),
    ).toThrow("Invalid layer value : XX");
  });
});

describe("Model.reconstitute", () => {
  it("restores every persisted field", () => {
    const model = Model.reconstitute(reconstitutable());

    expect(model.id).toBe("model-1");
    expect(model.layer.value).toBe("LA");
    expect(model.name).toBe("Logical model");
    expect(model.description).toBe("architecture of the logical layer");
    expect(model.createdAt.toISOString()).toBe("2026-01-01T00:00:00.000Z");
    expect(model.updatedAt.toISOString()).toBe("2026-01-02T00:00:00.000Z");
  });

  it("refuses an unknown layer", () => {
    expect(() => Model.reconstitute(reconstitutable({ layer: "XX" }))).toThrow(
      "Invalid layer value : XX",
    );
  });
});

describe("Model mutators", () => {
  it("renames with a trimmed value and bumps updatedAt", () => {
    const model = Model.reconstitute(reconstitutable());

    model.rename("  Renamed  ");

    expect(model.name).toBe("Renamed");
    expect(model.updatedAt.getTime()).toBeGreaterThan(
      new Date("2026-01-02T00:00:00.000Z").getTime(),
    );
  });

  it("rejects an empty rename", () => {
    const model = Model.reconstitute(reconstitutable());

    expect(() => model.rename("   ")).toThrow("Model name can't empty");
    expect(() => model.rename(undefined)).toThrow("Model name can't empty");
    expect(model.name).toBe("Logical model");
  });

  it("replaces the description and bumps updatedAt", () => {
    const model = Model.reconstitute(reconstitutable());

    model.updateDescription("new description");

    expect(model.description).toBe("new description");
    expect(model.updatedAt.getTime()).toBeGreaterThan(
      new Date("2026-01-02T00:00:00.000Z").getTime(),
    );
  });
});

describe("Model.toJSON", () => {
  it("serialises the layer and the dates", () => {
    const json = Model.reconstitute(reconstitutable()).toJSON();

    expect(json).toEqual({
      id: "model-1",
      projectId: "project-1",
      layer: "LA",
      name: "Logical model",
      description: "architecture of the logical layer",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
    });
  });

  it("compares models by id", () => {
    const model = Model.reconstitute(reconstitutable());

    expect(model.equals(Model.reconstitute(reconstitutable()))).toBe(true);
    expect(
      model.equals(Model.reconstitute(reconstitutable({ id: "other" }))),
    ).toBe(false);
  });
});
