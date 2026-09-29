import { describe, expect, it } from "vitest";
import { ClassRelationshipLayout } from "./class-relationship-layout";

type CreateProps = Partial<
  Parameters<typeof ClassRelationshipLayout.create>[0]
>;
type ReconstituteProps = Parameters<
  typeof ClassRelationshipLayout.reconstitute
>[0];

const createProps = (overrides: CreateProps = {}) => ({
  id: "rel-layout-1",
  classDiagramId: "diagram-1",
  classRelationshipId: "relationship-1",
  ...overrides,
});

const reconstitutable = (
  overrides: Partial<ReconstituteProps> = {},
): ReconstituteProps => ({
  id: "rel-layout-1",
  classDiagramId: "diagram-1",
  classRelationshipId: "relationship-1",
  labelX: 100,
  labelY: 120,
  sourceRoleLabelX: 10,
  sourceRoleLabelY: 20,
  targetRoleLabelX: 30,
  targetRoleLabelY: 40,
  sourceMultLabelX: 50,
  sourceMultLabelY: 60,
  targetMultLabelX: 70,
  targetMultLabelY: 80,
  waypoints: [
    { x: 1, y: 2 },
    { x: 3, y: 4 },
  ],
  createdAt: "2020-01-01T00:00:00.000Z",
  updatedAt: "2020-01-02T00:00:00.000Z",
  ...overrides,
});

describe("ClassRelationshipLayout.create", () => {
  it("builds a layout with no label positions and no waypoints", () => {
    const layout = ClassRelationshipLayout.create(createProps());

    expect(layout.id).toBe("rel-layout-1");
    expect(layout.classDiagramId).toBe("diagram-1");
    expect(layout.classRelationshipId).toBe("relationship-1");
    expect(layout.labelX).toBeNull();
    expect(layout.labelY).toBeNull();
    expect(layout.sourceRoleLabelX).toBeNull();
    expect(layout.sourceRoleLabelY).toBeNull();
    expect(layout.targetRoleLabelX).toBeNull();
    expect(layout.targetRoleLabelY).toBeNull();
    expect(layout.sourceMultLabelX).toBeNull();
    expect(layout.sourceMultLabelY).toBeNull();
    expect(layout.targetMultLabelX).toBeNull();
    expect(layout.targetMultLabelY).toBeNull();
    expect(layout.waypoints).toEqual([]);
    expect(layout.createdAt).toBeInstanceOf(Date);
    expect(layout.updatedAt).toBeInstanceOf(Date);
  });

  it("keeps the provided label positions and waypoints", () => {
    const layout = ClassRelationshipLayout.create(
      createProps({
        labelX: 5,
        labelY: 6,
        targetRoleLabelX: 7,
        targetRoleLabelY: 8,
        waypoints: [{ x: 9, y: 10 }],
      }),
    );

    expect(layout.labelX).toBe(5);
    expect(layout.labelY).toBe(6);
    expect(layout.targetRoleLabelX).toBe(7);
    expect(layout.targetRoleLabelY).toBe(8);
    expect(layout.waypoints).toEqual([{ x: 9, y: 10 }]);
  });
});

describe("ClassRelationshipLayout.reconstitute", () => {
  it("restores every persisted field", () => {
    const layout = ClassRelationshipLayout.reconstitute(reconstitutable());

    expect(layout.id).toBe("rel-layout-1");
    expect(layout.classDiagramId).toBe("diagram-1");
    expect(layout.classRelationshipId).toBe("relationship-1");
    expect(layout.labelX).toBe(100);
    expect(layout.labelY).toBe(120);
    expect(layout.sourceRoleLabelX).toBe(10);
    expect(layout.sourceRoleLabelY).toBe(20);
    expect(layout.targetRoleLabelX).toBe(30);
    expect(layout.targetRoleLabelY).toBe(40);
    expect(layout.sourceMultLabelX).toBe(50);
    expect(layout.sourceMultLabelY).toBe(60);
    expect(layout.targetMultLabelX).toBe(70);
    expect(layout.targetMultLabelY).toBe(80);
    expect(layout.waypoints).toEqual([
      { x: 1, y: 2 },
      { x: 3, y: 4 },
    ]);
    expect(layout.createdAt.toISOString()).toBe("2020-01-01T00:00:00.000Z");
    expect(layout.updatedAt.toISOString()).toBe("2020-01-02T00:00:00.000Z");
  });

  it("round-trips through toJSON", () => {
    const json = ClassRelationshipLayout.reconstitute(
      reconstitutable(),
    ).toJSON();
    const restored = ClassRelationshipLayout.reconstitute(json);

    expect(restored.toJSON()).toEqual(json);
  });
});

describe("ClassRelationshipLayout label setters", () => {
  it("stores the label positions and refreshes updatedAt", () => {
    const layout = ClassRelationshipLayout.reconstitute(reconstitutable());

    layout.setLabelPosition(1, 2);
    layout.setSourceRoleLabelPosition(3, 4);
    layout.setTargetRoleLabelPosition(null, null);
    layout.setSourceMultiplicityLabelPosition(5, 6);
    layout.setTargetMultiplicityLabelPosition(null, 7);

    expect(layout.labelX).toBe(1);
    expect(layout.labelY).toBe(2);
    expect(layout.sourceRoleLabelX).toBe(3);
    expect(layout.sourceRoleLabelY).toBe(4);
    expect(layout.targetRoleLabelX).toBeNull();
    expect(layout.targetRoleLabelY).toBeNull();
    expect(layout.sourceMultLabelX).toBe(5);
    expect(layout.sourceMultLabelY).toBe(6);
    expect(layout.targetMultLabelX).toBeNull();
    expect(layout.targetMultLabelY).toBe(7);
    expect(layout.updatedAt.getTime()).toBeGreaterThan(
      Date.parse("2021-01-01T00:00:00.000Z"),
    );
  });
});

describe("ClassRelationshipLayout.setWaypoints", () => {
  it("replaces the route and refreshes updatedAt", () => {
    const layout = ClassRelationshipLayout.reconstitute(reconstitutable());

    layout.setWaypoints([{ x: 100, y: 200 }]);

    expect(layout.waypoints).toEqual([{ x: 100, y: 200 }]);
    expect(layout.updatedAt.getTime()).toBeGreaterThan(
      Date.parse("2021-01-01T00:00:00.000Z"),
    );
  });
});

describe("ClassRelationshipLayout.equals", () => {
  it("compares on id", () => {
    const layout = ClassRelationshipLayout.create(createProps());
    const sameId = ClassRelationshipLayout.create(createProps({ labelX: 1 }));
    const otherId = ClassRelationshipLayout.create(
      createProps({ id: "rel-layout-2" }),
    );

    expect(layout.equals(sameId)).toBe(true);
    expect(layout.equals(otherId)).toBe(false);
  });
});
