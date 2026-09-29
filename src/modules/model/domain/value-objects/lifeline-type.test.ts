import { describe, expect, it } from "vitest";
import { LifelineType } from "./lifeline-type";

describe("LifelineType", () => {
  it("resolves every declared lifeline type", () => {
    expect(LifelineType.all().map((l) => l.value)).toEqual([
      "ACTOR",
      "FUNCTION",
      "COMPONENT",
      "CLASS_ELEMENT",
      "EXTERNAL",
    ]);
    expect(LifelineType.from("ACTOR").value).toBe("ACTOR");
  });

  it("rejects an unknown lifeline type", () => {
    expect(() => LifelineType.from("PORT")).toThrow(
      "Invalid lifeline type: PORT",
    );
  });

  it("exposes bilingual labels and a description", () => {
    const actor = LifelineType.from("ACTOR");

    expect(actor.label).toBe("Actor");
    expect(actor.labelFa).toBe("بازیگر");
    expect(actor.description).toBe("An actor participating in the scenario");
    expect(actor.toString()).toBe("ACTOR");
  });

  it("distinguishes modelled lifelines from external ones", () => {
    expect(LifelineType.from("CLASS_ELEMENT").label).toBe("Class Element");
    expect(LifelineType.from("EXTERNAL").description).toBe(
      "An external element not modeled in the system",
    );
  });

  it("compares by value", () => {
    expect(
      LifelineType.from("FUNCTION").equals(LifelineType.from("FUNCTION")),
    ).toBe(true);
    expect(
      LifelineType.from("FUNCTION").equals(LifelineType.from("EXTERNAL")),
    ).toBe(false);
  });
});
