import { describe, expect, it } from "vitest";
import { Layer } from "./layer";
import { ScenarioType } from "./scenario-type";

describe("ScenarioType", () => {
  it("resolves every declared scenario type", () => {
    expect(ScenarioType.all().map((s) => s.value)).toEqual([
      "OIS",
      "SS",
      "LS",
      "PS",
    ]);
    expect(ScenarioType.from("SS").value).toBe("SS");
  });

  it("rejects an unknown scenario type", () => {
    expect(() => ScenarioType.from("CS")).toThrow("Invalid scenario type: CS");
  });

  it("places every scenario type in its layer", () => {
    expect(ScenarioType.from("OIS").layer.equals(Layer.OA)).toBe(true);
    expect(ScenarioType.from("SS").layer.equals(Layer.SA)).toBe(true);
    expect(ScenarioType.from("LS").layer.equals(Layer.LA)).toBe(true);
    expect(ScenarioType.from("PS").layer.equals(Layer.PA)).toBe(true);
  });

  it("exposes bilingual labels and a description", () => {
    const scenario = ScenarioType.from("OIS");
    expect(scenario.label).toBe("Operational Interaction Scenario");
    expect(scenario.labelFa).toBe("سناریو تعامل عملیاتی");
    expect(scenario.description).toContain("operational actors");
    expect(scenario.toString()).toBe("OIS");
  });

  it("compares by value", () => {
    expect(ScenarioType.from("LS").equals(ScenarioType.from("LS"))).toBe(true);
    expect(ScenarioType.from("LS").equals(ScenarioType.from("PS"))).toBe(false);
  });
});
