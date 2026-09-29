import { describe, expect, it } from "vitest";
import { ClassElementLayout } from "./class-element-layout";

type CreateProps = Partial<Parameters<typeof ClassElementLayout.create>[0]>;
type ReconstituteProps = Parameters<typeof ClassElementLayout.reconstitute>[0];

const createProps = (overrides: CreateProps = {}) => ({
  id: "layout-1",
  classDiagramId: "diagram-1",
  classElementId: "element-1",
  ...overrides,
});

const reconstitutable = (
  overrides: Partial<ReconstituteProps> = {},
): ReconstituteProps => ({
  id: "layout-1",
  classDiagramId: "diagram-1",
  classElementId: "element-1",
  description: "placed by hand",
  x: 12,
  y: 34,
  width: 200,
  height: 90,
  createdAt: "2020-01-01T00:00:00.000Z",
  updatedAt: "2020-01-02T00:00:00.000Z",
  ...overrides,
});

describe("ClassElementLayout.create", () => {
  it("builds a layout with the default geometry", () => {
    const layout = ClassElementLayout.create(createProps());

    expect(layout.id).toBe("layout-1");
    expect(layout.classDiagramId).toBe("diagram-1");
    expect(layout.classElementId).toBe("element-1");
    expect(layout.description).toBe("");
    expect(layout.x).toBe(0);
    expect(layout.y).toBe(0);
    expect(layout.width).toBe(160);
    expect(layout.height).toBe(80);
    expect(layout.createdAt).toBeInstanceOf(Date);
    expect(layout.updatedAt).toBeInstanceOf(Date);
  });

  it("keeps the provided description and geometry", () => {
    const layout = ClassElementLayout.create(
      createProps({
        description: "moved",
        x: 5,
        y: 6,
        width: 300,
        height: 150,
      }),
    );

    expect(layout.description).toBe("moved");
    expect(layout.x).toBe(5);
    expect(layout.y).toBe(6);
    expect(layout.width).toBe(300);
    expect(layout.height).toBe(150);
  });
});

describe("ClassElementLayout.reconstitute", () => {
  it("restores every persisted field", () => {
    const layout = ClassElementLayout.reconstitute(reconstitutable());

    expect(layout.id).toBe("layout-1");
    expect(layout.classDiagramId).toBe("diagram-1");
    expect(layout.classElementId).toBe("element-1");
    expect(layout.description).toBe("placed by hand");
    expect(layout.x).toBe(12);
    expect(layout.y).toBe(34);
    expect(layout.width).toBe(200);
    expect(layout.height).toBe(90);
    expect(layout.createdAt.toISOString()).toBe("2020-01-01T00:00:00.000Z");
    expect(layout.updatedAt.toISOString()).toBe("2020-01-02T00:00:00.000Z");
  });

  it("round-trips through toJSON", () => {
    const json = ClassElementLayout.reconstitute(reconstitutable()).toJSON();
    const restored = ClassElementLayout.reconstitute(json);

    expect(restored.toJSON()).toEqual(json);
  });
});

describe("ClassElementLayout.setDescription", () => {
  it("stores the text and refreshes updatedAt", () => {
    const layout = ClassElementLayout.reconstitute(reconstitutable());

    layout.setDescription("renamed by user");

    expect(layout.description).toBe("renamed by user");
    expect(layout.updatedAt.getTime()).toBeGreaterThan(
      Date.parse("2021-01-01T00:00:00.000Z"),
    );
  });
});

describe("ClassElementLayout.setPosition", () => {
  it("stores the coordinates and refreshes updatedAt", () => {
    const layout = ClassElementLayout.reconstitute(reconstitutable());

    layout.setPosition(-40, 250);

    expect(layout.x).toBe(-40);
    expect(layout.y).toBe(250);
    expect(layout.updatedAt.getTime()).toBeGreaterThan(
      Date.parse("2021-01-01T00:00:00.000Z"),
    );
  });
});

describe("ClassElementLayout.setSize", () => {
  it("stores the size and refreshes updatedAt", () => {
    const layout = ClassElementLayout.reconstitute(reconstitutable());

    layout.setSize(64, 32);

    expect(layout.width).toBe(64);
    expect(layout.height).toBe(32);
    expect(layout.updatedAt.getTime()).toBeGreaterThan(
      Date.parse("2021-01-01T00:00:00.000Z"),
    );
  });
});

describe("ClassElementLayout.equals", () => {
  it("compares on id", () => {
    const layout = ClassElementLayout.create(createProps());
    const sameId = ClassElementLayout.create(createProps({ x: 99 }));
    const otherId = ClassElementLayout.create(createProps({ id: "layout-2" }));

    expect(layout.equals(sameId)).toBe(true);
    expect(layout.equals(otherId)).toBe(false);
  });
});
