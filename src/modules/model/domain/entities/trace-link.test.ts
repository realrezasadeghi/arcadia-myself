import { describe, expect, it } from "vitest";
import { TraceLink } from "./trace-link";

const reconstitutable = (type: string) => ({
  id: "trace-1",
  projectId: "project-1",
  sourceModelId: "model-1",
  targetModelId: "model-2",
  type,
  sourceElementId: "element-1",
  sourceLayer: "LA",
  targetElementId: "element-2",
  targetLayer: "SA",
  description: "",
  createdAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
  updatedAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
});

describe("TraceLink.reconstitute", () => {
  it("loads a registered trace type", () => {
    const link = TraceLink.reconstitute(reconstitutable("Realization"));

    expect(link.type.value).toBe("Realization");
    expect(link.type.isLegacy).toBe(false);
    expect(link.toJSON().type).toBe("Realization");
  });

  it("loads a legacy trace type instead of failing the whole read", () => {
    const link = TraceLink.reconstitute(reconstitutable("Allocation"));

    expect(link.type.value).toBe("Allocation");
    expect(link.type.isLegacy).toBe(true);
    expect(link.toJSON().type).toBe("Allocation");
    expect(link.isAdjacentLayerTrace()).toBe(true);
  });
});

describe("TraceLink.create", () => {
  it("refuses to create an unregistered trace type", () => {
    expect(() =>
      TraceLink.create({
        id: "trace-1",
        projectId: "project-1",
        sourceModelId: "model-1",
        targetModelId: "model-2",
        type: "Allocation",
        sourceElementId: "element-1",
        sourceLayer: "LA",
        targetElementId: "element-2",
        targetLayer: "SA",
      }),
    ).toThrow("TraceLinkType is invalid : Allocation");
  });

  it("refuses an element tracing to itself in the same layer", () => {
    expect(() =>
      TraceLink.create({
        id: "trace-1",
        projectId: "project-1",
        sourceModelId: "model-1",
        targetModelId: "model-2",
        type: "Realization",
        sourceElementId: "element-1",
        sourceLayer: "LA",
        targetElementId: "element-1",
        targetLayer: "LA",
      }),
    ).toThrow("An element cannot trace to itself");
  });
});
