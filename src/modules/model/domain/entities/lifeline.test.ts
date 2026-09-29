import { describe, expect, it } from "vitest";
import { Lifeline } from "./lifeline";

type CreateProps = Partial<Parameters<typeof Lifeline.create>[0]>;
type ReconstituteProps = Parameters<typeof Lifeline.reconstitute>[0];

const createProps = (overrides: CreateProps = {}) => ({
  id: "lifeline-1",
  scenarioId: "scenario-1",
  name: "  System  ",
  representedElementType: "COMPONENT",
  columnIndex: 0,
  ...overrides,
});

const reconstitutable = (
  overrides: Partial<ReconstituteProps> = {},
): ReconstituteProps => ({
  id: "lifeline-1",
  scenarioId: "scenario-1",
  name: "System",
  representedElementType: "COMPONENT",
  representedElementId: "element-1",
  representedElementExternalId: null,
  columnIndex: 3,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
  ...overrides,
});

describe("Lifeline.create", () => {
  it("builds a lifeline with a trimmed name and no linked element", () => {
    const lifeline = Lifeline.create(createProps());

    expect(lifeline.id).toBe("lifeline-1");
    expect(lifeline.scenarioId).toBe("scenario-1");
    expect(lifeline.name).toBe("System");
    expect(lifeline.representedElementType.value).toBe("COMPONENT");
    expect(lifeline.representedElementId).toBeNull();
    expect(lifeline.representedElementExternalId).toBeNull();
    expect(lifeline.columnIndex).toBe(0);
    expect(lifeline.createdAt).toBeInstanceOf(Date);
  });

  it("keeps the represented element when provided", () => {
    const lifeline = Lifeline.create(
      createProps({
        representedElementId: "element-9",
        representedElementExternalId: "external-9",
      }),
    );

    expect(lifeline.representedElementId).toBe("element-9");
    expect(lifeline.representedElementExternalId).toBe("external-9");
  });

  it("rejects a blank name and an unknown lifeline type", () => {
    expect(() => Lifeline.create(createProps({ name: "   " }))).toThrow(
      "Lifeline name is required",
    );
    expect(() =>
      Lifeline.create(createProps({ representedElementType: "PORT" })),
    ).toThrow("Invalid lifeline type: PORT");
  });
});

describe("Lifeline.reconstitute", () => {
  it("restores every persisted field", () => {
    const lifeline = Lifeline.reconstitute(reconstitutable());

    expect(lifeline.name).toBe("System");
    expect(lifeline.representedElementId).toBe("element-1");
    expect(lifeline.columnIndex).toBe(3);
    expect(lifeline.createdAt.toISOString()).toBe("2026-01-01T00:00:00.000Z");
    expect(lifeline.updatedAt.toISOString()).toBe("2026-01-02T00:00:00.000Z");
  });

  it("refuses an unknown lifeline type", () => {
    expect(() =>
      Lifeline.reconstitute(
        reconstitutable({ representedElementType: "PORT" }),
      ),
    ).toThrow("Invalid lifeline type: PORT");
  });
});

describe("Lifeline mutators", () => {
  it("renames with a trimmed value and bumps updatedAt", () => {
    const lifeline = Lifeline.reconstitute(reconstitutable());

    lifeline.rename("  Bus  ");

    expect(lifeline.name).toBe("Bus");
    expect(lifeline.updatedAt.getTime()).toBeGreaterThan(
      new Date("2026-01-02T00:00:00.000Z").getTime(),
    );
  });

  it("rejects an empty rename", () => {
    const lifeline = Lifeline.reconstitute(reconstitutable());

    expect(() => lifeline.rename("   ")).toThrow(
      "Lifeline name cannot be empty",
    );
    expect(lifeline.name).toBe("System");
  });

  it("moves between columns but never before the first one", () => {
    const lifeline = Lifeline.reconstitute(reconstitutable());

    expect(() => lifeline.setColumnIndex(-1)).toThrow(
      "Column index must be non-negative",
    );

    lifeline.setColumnIndex(0);

    expect(lifeline.columnIndex).toBe(0);
    expect(lifeline.updatedAt.getTime()).toBeGreaterThan(
      new Date("2026-01-02T00:00:00.000Z").getTime(),
    );
  });

  it("links to and unlinks a represented element", () => {
    const lifeline = Lifeline.reconstitute(reconstitutable());

    lifeline.linkToElement("element-7");
    expect(lifeline.representedElementId).toBe("element-7");

    lifeline.unlinkElement();
    expect(lifeline.representedElementId).toBeNull();
    expect(lifeline.updatedAt.getTime()).toBeGreaterThan(
      new Date("2026-01-02T00:00:00.000Z").getTime(),
    );
  });
});

describe("Lifeline.toJSON", () => {
  it("serialises the type, dates and linkage", () => {
    const json = Lifeline.reconstitute(reconstitutable()).toJSON();

    expect(json).toEqual({
      id: "lifeline-1",
      scenarioId: "scenario-1",
      name: "System",
      representedElementType: "COMPONENT",
      representedElementId: "element-1",
      representedElementExternalId: null,
      columnIndex: 3,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
    });
  });

  it("compares lifelines by id", () => {
    const lifeline = Lifeline.reconstitute(reconstitutable());

    expect(lifeline.equals(Lifeline.reconstitute(reconstitutable()))).toBe(
      true,
    );
    expect(
      lifeline.equals(Lifeline.reconstitute(reconstitutable({ id: "other" }))),
    ).toBe(false);
  });
});
