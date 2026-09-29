import { describe, expect, it } from "vitest";
import { RELATIONSHIP_DEFINITIONS } from "../relationships/definitions";
import { TraceLinkType } from "./trace-link";

describe("TraceLinkType.from (write path)", () => {
  it("accepts the registered trace types", () => {
    expect(TraceLinkType.from("Realization").isLegacy).toBe(false);
    expect(TraceLinkType.from("Refinement").isLegacy).toBe(false);
  });

  it("rejects types that are no longer trace links", () => {
    for (const value of ["Allocation", "Deployment", "Involvement", "Owned"]) {
      expect(() => TraceLinkType.from(value), value).toThrow(
        `TraceLinkType is invalid : ${value}`,
      );
    }
  });
});

describe("TraceLinkType.reconstitute (read path)", () => {
  it("keeps legacy rows loadable instead of throwing", () => {
    const legacy = TraceLinkType.reconstitute("Allocation");

    expect(legacy.value).toBe("Allocation");
    expect(legacy.isLegacy).toBe(true);
    expect(legacy.label).toBe(RELATIONSHIP_DEFINITIONS.Allocation.label);
    expect(legacy.labelFa).toBe(RELATIONSHIP_DEFINITIONS.Allocation.labelFa);
  });

  it("falls back to the raw value when nothing matches the registry", () => {
    const legacy = TraceLinkType.reconstitute("Owned");

    expect(legacy.value).toBe("Owned");
    expect(legacy.isLegacy).toBe(true);
    expect(legacy.label).toBe("Owned");
    expect(legacy.labelFa).toBe("Owned");
  });

  it("marks registered types as non-legacy", () => {
    const realization = TraceLinkType.reconstitute("Realization");

    expect(realization.isLegacy).toBe(false);
    expect(realization.value).toBe("Realization");
    expect(realization.label).toBe(RELATIONSHIP_DEFINITIONS.Realization.label);
    expect(realization.isCrossLayer()).toBe(true);
  });

  it("keeps legacy types out of the cross-layer category", () => {
    expect(TraceLinkType.reconstitute("Allocation").isCrossLayer()).toBe(false);
    expect(TraceLinkType.reconstitute("Deployment").isCrossLayer()).toBe(false);
  });
});
