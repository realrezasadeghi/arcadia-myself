import { describe, expect, it } from "vitest";
import { Layer } from "../value-objects/layer";
import {
  ClassDiagram,
  ClassDiagramElementMovedEvent,
  ClassDiagramElementPlacedEvent,
  ClassDiagramRelationshipLayoutUpdatedEvent,
  ClassDiagramRenamedEvent,
} from "./class-diagram";

type CreateProps = Partial<Parameters<typeof ClassDiagram.create>[0]>;
type ReconstituteProps = Parameters<typeof ClassDiagram.reconstitute>[0];

const createProps = (overrides: CreateProps = {}) => ({
  id: "diagram-1",
  modelId: "model-1",
  layer: "LA",
  name: "Class Diagram",
  ...overrides,
});

const reconstitutable = (
  overrides: Partial<ReconstituteProps> = {},
): ReconstituteProps => ({
  id: "diagram-1",
  modelId: "model-1",
  layer: "LA",
  name: "Class Diagram",
  description: "overview",
  viewport: { x: 10, y: 20, zoom: 2 },
  elementLayouts: [
    {
      elementId: "element-1",
      position: { x: 100, y: 200 },
      size: { width: 120, height: 60 },
    },
  ],
  relationshipLayouts: [
    {
      relationshipId: "rel-1",
      labelX: 5,
      labelY: 6,
      sourceRoleLabelX: null,
      sourceRoleLabelY: null,
      targetRoleLabelX: null,
      targetRoleLabelY: null,
      sourceMultLabelX: null,
      sourceMultLabelY: null,
      targetMultLabelX: null,
      targetMultLabelY: null,
      waypoints: [{ x: 1, y: 2 }],
    },
  ],
  status: "VALIDATED",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
  ...overrides,
});

describe("ClassDiagram.create", () => {
  it("builds a draft diagram with a default viewport and no layouts", () => {
    const diagram = ClassDiagram.create(createProps());

    expect(diagram.id).toBe("diagram-1");
    expect(diagram.modelId).toBe("model-1");
    expect(diagram.layer.value).toBe("LA");
    expect(diagram.name).toBe("Class Diagram");
    expect(diagram.description).toBeUndefined();
    expect(diagram.status).toBe("DRAFT");
    expect(diagram.viewport).toEqual({ x: 0, y: 0, zoom: 1 });
    expect(diagram.elementLayouts).toEqual([]);
    expect(diagram.relationshipLayouts).toEqual([]);
    expect(diagram.createdAt).toBeInstanceOf(Date);
    expect(diagram.updatedAt).toBeInstanceOf(Date);
  });

  it("trims the name and the description", () => {
    const diagram = ClassDiagram.create(
      createProps({ name: "  Draft  ", description: "  notes  " }),
    );

    expect(diagram.name).toBe("Draft");
    expect(diagram.description).toBe("notes");
  });

  it("accepts an already-built Layer instance", () => {
    const diagram = ClassDiagram.create(createProps({ layer: Layer.SA }));

    expect(diagram.layer.value).toBe("SA");
  });

  it("rejects a blank name and an unknown layer", () => {
    expect(() => ClassDiagram.create(createProps({ name: "   " }))).toThrow(
      "Class diagram name is required",
    );
    expect(() => ClassDiagram.create(createProps({ layer: "XX" }))).toThrow(
      "Invalid layer value : XX",
    );
  });
});

describe("ClassDiagram.reconstitute", () => {
  it("restores stored state including both layout maps", () => {
    const diagram = ClassDiagram.reconstitute(reconstitutable());

    expect(diagram.id).toBe("diagram-1");
    expect(diagram.modelId).toBe("model-1");
    expect(diagram.layer.value).toBe("LA");
    expect(diagram.name).toBe("Class Diagram");
    expect(diagram.description).toBe("overview");
    expect(diagram.viewport).toEqual({ x: 10, y: 20, zoom: 2 });
    expect(diagram.status).toBe("VALIDATED");
    expect(diagram.elementLayouts).toHaveLength(1);
    expect(diagram.relationshipLayouts).toHaveLength(1);
    expect(diagram.getElementLayout("element-1")?.position).toEqual({
      x: 100,
      y: 200,
    });
    expect(diagram.getRelationshipLayout("rel-1")?.waypoints).toEqual([
      { x: 1, y: 2 },
    ]);
    expect(diagram.createdAt.toISOString()).toBe("2026-01-01T00:00:00.000Z");
    expect(diagram.updatedAt.toISOString()).toBe("2026-01-02T00:00:00.000Z");
  });

  it("round-trips through toJSON", () => {
    const json = ClassDiagram.reconstitute(reconstitutable()).toJSON();
    const restored = ClassDiagram.reconstitute({
      ...json,
      elementLayouts: [...json.elementLayouts],
      relationshipLayouts: [...json.relationshipLayouts],
    });

    expect(restored.toJSON()).toEqual(json);
  });
});

describe("ClassDiagram.rename", () => {
  it("trims the new name and reports the old one", () => {
    const diagram = ClassDiagram.create(createProps());

    const events = diagram.rename("  Logical View  ");
    const event = events[0] as ClassDiagramRenamedEvent;

    expect(events).toHaveLength(1);
    expect(event).toBeInstanceOf(ClassDiagramRenamedEvent);
    expect(event.oldName).toBe("Class Diagram");
    expect(event.newName).toBe("Logical View");
    expect(diagram.name).toBe("Logical View");
  });

  it("refuses an empty name", () => {
    const diagram = ClassDiagram.create(createProps());

    expect(() => diagram.rename("   ")).toThrow(
      "Class diagram name can't be empty",
    );
    expect(diagram.name).toBe("Class Diagram");
  });
});

describe("ClassDiagram.updateDescription", () => {
  it("stores the trimmed description and can clear it", () => {
    const diagram = ClassDiagram.create(createProps());

    diagram.updateDescription("  notes  ");
    expect(diagram.description).toBe("notes");

    const events = diagram.updateDescription(undefined);
    expect(diagram.description).toBeUndefined();
    expect(events).toHaveLength(1);
  });
});

describe("ClassDiagram.updateViewport", () => {
  it("copies the viewport so later mutation cannot leak in", () => {
    const diagram = ClassDiagram.create(createProps());

    const events = diagram.updateViewport({ x: 5, y: 6, zoom: 1.5 });
    expect(events).toHaveLength(1);
    expect(diagram.viewport).toEqual({ x: 5, y: 6, zoom: 1.5 });

    const exposed = diagram.viewport;
    exposed.zoom = 99;
    expect(diagram.viewport.zoom).toBe(1.5);
  });
});

describe("ClassDiagram.placeElement", () => {
  it("stores a layout with the default size when none is given", () => {
    const diagram = ClassDiagram.create(createProps());

    const events = diagram.placeElement("element-1", { x: 10, y: 20 });
    const event = events[0] as ClassDiagramElementPlacedEvent;

    expect(event).toBeInstanceOf(ClassDiagramElementPlacedEvent);
    expect(event.elementId).toBe("element-1");
    expect(event.size).toBeUndefined();
    expect(diagram.hasElement("element-1")).toBe(true);
    expect(diagram.getElementLayout("element-1")).toEqual({
      elementId: "element-1",
      position: { x: 10, y: 20 },
      size: { width: 160, height: 80 },
    });
    expect(diagram.getElementLayout("missing")).toBeNull();
  });

  it("keeps an explicit size", () => {
    const diagram = ClassDiagram.create(createProps());

    diagram.placeElement(
      "element-1",
      { x: 1, y: 2 },
      { width: 40, height: 30 },
    );

    expect(diagram.getElementLayout("element-1")?.size).toEqual({
      width: 40,
      height: 30,
    });
  });
});

describe("ClassDiagram.moveElement", () => {
  it("repositions an placed element", () => {
    const diagram = ClassDiagram.create(createProps());
    diagram.placeElement("element-1", { x: 10, y: 20 });

    const events = diagram.moveElement("element-1", { x: 30, y: 40 });
    const event = events[0] as ClassDiagramElementMovedEvent;

    expect(event).toBeInstanceOf(ClassDiagramElementMovedEvent);
    expect(event.position).toEqual({ x: 30, y: 40 });
    expect(diagram.getElementLayout("element-1")?.position).toEqual({
      x: 30,
      y: 40,
    });
    expect(diagram.getElementLayout("element-1")?.size).toEqual({
      width: 160,
      height: 80,
    });
  });

  it("refuses to move an element that was never placed", () => {
    const diagram = ClassDiagram.create(createProps());

    expect(() => diagram.moveElement("element-9", { x: 1, y: 1 })).toThrow(
      "Element element-9 not placed in this diagram",
    );
  });
});

describe("ClassDiagram.removeElementLayout", () => {
  it("drops the layout and still reports the removal", () => {
    const diagram = ClassDiagram.create(createProps());
    diagram.placeElement("element-1", { x: 10, y: 20 });

    const events = diagram.removeElementLayout("element-1");

    expect(events).toHaveLength(1);
    expect(diagram.hasElement("element-1")).toBe(false);
    expect(diagram.getElementLayout("element-1")).toBeNull();

    const missing = diagram.removeElementLayout("element-9");
    expect(missing).toHaveLength(1);
  });
});

describe("ClassDiagram.placeRelationship", () => {
  it("stores a layout with null labels and no waypoints by default", () => {
    const diagram = ClassDiagram.create(createProps());

    const events = diagram.placeRelationship("rel-1");

    expect(events).toHaveLength(1);
    expect(diagram.hasRelationship("rel-1")).toBe(true);
    expect(diagram.getRelationshipLayout("rel-1")).toEqual({
      relationshipId: "rel-1",
      labelX: null,
      labelY: null,
      sourceRoleLabelX: null,
      sourceRoleLabelY: null,
      targetRoleLabelX: null,
      targetRoleLabelY: null,
      sourceMultLabelX: null,
      sourceMultLabelY: null,
      targetMultLabelX: null,
      targetMultLabelY: null,
      waypoints: [],
    });
    expect(diagram.getRelationshipLayout("rel-9")).toBeNull();
  });

  it("keeps the given label positions and waypoints", () => {
    const diagram = ClassDiagram.create(createProps());

    diagram.placeRelationship("rel-1", {
      labelX: 3,
      labelY: 4,
      waypoints: [{ x: 7, y: 8 }],
    });

    const layout = diagram.getRelationshipLayout("rel-1");
    expect(layout?.labelX).toBe(3);
    expect(layout?.labelY).toBe(4);
    expect(layout?.waypoints).toEqual([{ x: 7, y: 8 }]);
  });
});

describe("ClassDiagram.updateRelationshipLayout", () => {
  it("merges the given fields into the stored layout", () => {
    const diagram = ClassDiagram.create(createProps());
    diagram.placeRelationship("rel-1", { labelX: 10, labelY: 20 });

    const events = diagram.updateRelationshipLayout("rel-1", { labelY: 99 });
    const event = events[0] as ClassDiagramRelationshipLayoutUpdatedEvent;

    expect(event).toBeInstanceOf(ClassDiagramRelationshipLayoutUpdatedEvent);
    const layout = diagram.getRelationshipLayout("rel-1");
    expect(layout?.labelX).toBe(10);
    expect(layout?.labelY).toBe(99);
  });

  it("refuses to update a relationship that was never placed", () => {
    const diagram = ClassDiagram.create(createProps());

    expect(() =>
      diagram.updateRelationshipLayout("rel-9", { labelX: 1 }),
    ).toThrow("Relationship rel-9 not placed in this diagram");
  });
});

describe("ClassDiagram.removeRelationshipLayout", () => {
  it("drops the layout", () => {
    const diagram = ClassDiagram.create(createProps());
    diagram.placeRelationship("rel-1");

    const events = diagram.removeRelationshipLayout("rel-1");

    expect(events).toHaveLength(1);
    expect(diagram.hasRelationship("rel-1")).toBe(false);
    expect(diagram.getRelationshipLayout("rel-1")).toBeNull();
  });
});

describe("ClassDiagram.validate", () => {
  it("moves a draft diagram to validated", () => {
    const diagram = ClassDiagram.create(createProps());

    const events = diagram.validate();

    expect(events).toHaveLength(1);
    expect(events[0].eventName).toBe("ClassDiagramValidated");
    expect(diagram.status).toBe("VALIDATED");
    expect(diagram.validate()).toHaveLength(1);
  });

  it("deprecates once and refuses validation afterwards", () => {
    const diagram = ClassDiagram.create(createProps());

    expect(diagram.deprecate()).toHaveLength(1);
    expect(diagram.status).toBe("DEPRECATED");
    expect(diagram.deprecate()).toEqual([]);
    expect(() => diagram.validate()).toThrow(
      "Cannot validate a deprecated class diagram",
    );
  });
});

describe("ClassDiagram.equals", () => {
  it("compares on id", () => {
    const diagram = ClassDiagram.create(createProps());
    const sameId = ClassDiagram.create(createProps({ name: "Other" }));
    const otherId = ClassDiagram.create(createProps({ id: "diagram-2" }));

    expect(diagram.equals(sameId)).toBe(true);
    expect(diagram.equals(otherId)).toBe(false);
  });
});
