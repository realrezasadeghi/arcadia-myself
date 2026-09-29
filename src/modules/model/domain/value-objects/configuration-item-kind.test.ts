import { describe, expect, it } from "vitest";
import { ConfigurationItemKind } from "./configuration-item-kind";

describe("ConfigurationItemKind", () => {
  it("resolves every declared kind", () => {
    expect(ConfigurationItemKind.all().map((k) => k.value)).toEqual([
      "System",
      "Subsystem",
      "Hardware",
      "Software",
    ]);
    expect(ConfigurationItemKind.from("Hardware")).toBe(
      ConfigurationItemKind.HARDWARE,
    );
  });

  it("hands out a copy of the registry", () => {
    ConfigurationItemKind.all().pop();
    expect(ConfigurationItemKind.all()).toHaveLength(4);
  });

  it("rejects an unknown kind", () => {
    expect(() => ConfigurationItemKind.from("Firmware")).toThrow(
      "Invalid ConfigurationItem kind: Firmware",
    );
  });

  it("labels a kind with itself", () => {
    expect(ConfigurationItemKind.SUBSYSTEM.label).toBe("Subsystem");
  });

  it("compares by value and prints its value", () => {
    expect(
      ConfigurationItemKind.from("Software").equals(
        ConfigurationItemKind.SOFTWARE,
      ),
    ).toBe(true);
    expect(
      ConfigurationItemKind.from("Software").equals(
        ConfigurationItemKind.HARDWARE,
      ),
    ).toBe(false);
    expect(ConfigurationItemKind.SYSTEM.toString()).toBe("System");
  });
});
