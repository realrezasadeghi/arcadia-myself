import { describe, expect, it } from "vitest";
import { Layer, type LayerValue } from "./layer";

describe("Layer", () => {
  it("keeps the five Arcadia layers in abstraction order", () => {
    expect(Layer.all().map((l) => l.value)).toEqual([
      "OA",
      "SA",
      "LA",
      "PA",
      "EPBS",
    ]);
    expect(Layer.all().map((l) => l.order)).toEqual([1, 2, 3, 4, 5]);
  });

  it("exposes EN and FA section titles and descriptions for every layer", () => {
    for (const layer of Layer.all()) {
      expect(layer.sectionTitle.length).toBeGreaterThan(0);
      expect(layer.sectionTitleFa.length).toBeGreaterThan(0);
      expect(layer.description.length).toBeGreaterThan(0);
      expect(layer.descriptionFa.length).toBeGreaterThan(0);
      expect(layer.labelFa.length).toBeGreaterThan(0);
    }
  });

  it("derives section titles from the same meta as the labels", () => {
    for (const value of ["OA", "SA", "LA", "PA", "EPBS"] as LayerValue[]) {
      expect(Layer.from(value).sectionTitle).toBe(
        Layer.meta(value).sectionTitle,
      );
      expect(Layer.from(value).label).toBe(Layer.meta(value).label);
    }
  });

  it("walks the layer chain forwards and backwards", () => {
    expect(Layer.OA.nextLayer()?.value).toBe("SA");
    expect(Layer.SA.nextLayer()?.value).toBe("LA");
    expect(Layer.LA.nextLayer()?.value).toBe("PA");
    expect(Layer.PA.nextLayer()?.value).toBe("EPBS");
    expect(Layer.EPBS.nextLayer()).toBeNull();

    expect(Layer.SA.previousLayer()?.value).toBe("OA");
    expect(Layer.OA.previousLayer()).toBeNull();
  });

  it("orders abstraction and adjacency", () => {
    expect(Layer.OA.isHigherAbstractionThan(Layer.SA)).toBe(true);
    expect(Layer.SA.isHigherAbstractionThan(Layer.OA)).toBe(false);
    expect(Layer.OA.isAdjacentTo(Layer.SA)).toBe(true);
    expect(Layer.OA.isAdjacentTo(Layer.LA)).toBe(false);
  });

  it("allows realization only into the next layer", () => {
    expect(Layer.OA.canBeRealizedBy(Layer.SA)).toBe(true);
    expect(Layer.SA.canBeRealizedBy(Layer.LA)).toBe(true);
    expect(Layer.PA.canBeRealizedBy(Layer.EPBS)).toBe(true);
    expect(Layer.OA.canBeRealizedBy(Layer.LA)).toBe(false);
    expect(Layer.PA.canBeRealizedBy(Layer.SA)).toBe(false);
  });

  it("rejects unknown values", () => {
    expect(() => Layer.from("XX")).toThrow();
    expect(Layer.tryFrom("XX")).toBeNull();
    expect(Layer.tryFrom("SA")).toBe(Layer.SA);
  });
});
