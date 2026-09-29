import { describe, expect, it } from "vitest";
import { ElementType } from "../value-objects/element-type";
import { Layer } from "../value-objects/layer";
import { TraceLinkType } from "../value-objects/trace-link";
import { TracePolicy } from "./trace";

describe("TracePolicy", () => {
  it("allows a system function to realize an operational activity", () => {
    expect(
      TracePolicy.isAllowed(
        ElementType.from("SystemFunction"),
        Layer.SA,
        ElementType.from("OperationalActivity"),
        Layer.OA,
        TraceLinkType.Realization,
      ),
    ).toBe(true);
  });

  it("rejects the reversed direction", () => {
    expect(
      TracePolicy.isAllowed(
        ElementType.from("OperationalActivity"),
        Layer.OA,
        ElementType.from("SystemFunction"),
        Layer.SA,
        TraceLinkType.Realization,
      ),
    ).toBe(false);
  });

  it("rejects intra-layer traces", () => {
    expect(() =>
      TracePolicy.assertAllowed(
        ElementType.from("SystemFunction"),
        Layer.SA,
        ElementType.from("SystemCapability"),
        Layer.SA,
        TraceLinkType.Realization,
      ),
    ).toThrow();
  });

  it("rejects an element tracing to itself", () => {
    expect(() =>
      TracePolicy.assertAllowed(
        ElementType.from("SystemFunction"),
        Layer.SA,
        ElementType.from("SystemFunction"),
        Layer.SA,
        TraceLinkType.Realization,
      ),
    ).toThrow(/can't trace to itself/);
  });

  it("no longer offers allocation, deployment or involvement", () => {
    expect(() =>
      TracePolicy.assertAllowed(
        ElementType.from("LogicalFunction"),
        Layer.LA,
        ElementType.from("LogicalComponent"),
        Layer.LA,
        TraceLinkType.from("Allocation"),
      ),
    ).toThrow();
    expect(() => TraceLinkType.from("Allocation")).toThrow();
    expect(() => TraceLinkType.from("Owned")).toThrow();
  });

  it("lists realization options for a system function", () => {
    const options = TracePolicy.getTraceOptions("SystemFunction", "SA");
    expect(options).toHaveLength(1);
    expect(options[0].type.value).toBe("Realization");
    expect(options[0].targetLayer).toBe(Layer.OA);
    expect(options[0].targetTypes).toEqual(["OperationalActivity"]);
  });

  it("does not throw for EPBS sources", () => {
    const options = TracePolicy.getTraceOptions("ConfigurationItem", "EPBS");
    expect(options).toHaveLength(1);
    expect(options[0].type.value).toBe("Realization");
    expect(options[0].targetLayer).toBe(Layer.PA);
    expect(options[0].targetTypes).toEqual([
      "PhysicalComponent",
      "PhysicalActor",
    ]);
  });

  it("returns no options when nothing is traceable", () => {
    expect(TracePolicy.getTraceOptions("Mission", "OA")).toEqual([]);
    expect(TracePolicy.getTraceOptions("PhysicalNode", "PA")).toEqual([]);
  });
});
