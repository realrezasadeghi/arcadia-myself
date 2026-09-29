import { describe, expect, it } from "vitest";
import { ClassStatus } from "./class-status";

describe("ClassStatus", () => {
  it("resolves every declared status", () => {
    expect(ClassStatus.from("DRAFT")).toBe(ClassStatus.DRAFT);
    expect(ClassStatus.from("VALIDATED")).toBe(ClassStatus.VALIDATED);
    expect(ClassStatus.from("DEPRECATED")).toBe(ClassStatus.DEPRECATED);
  });

  it("rejects an unknown status", () => {
    expect(() => ClassStatus.from("APPROVED")).toThrow(
      "Invalid class status: APPROVED",
    );
  });

  it("compares by value and prints its value", () => {
    expect(ClassStatus.from("DRAFT").equals(ClassStatus.DRAFT)).toBe(true);
    expect(ClassStatus.from("DRAFT").equals(ClassStatus.DEPRECATED)).toBe(
      false,
    );
    expect(ClassStatus.DEPRECATED.toString()).toBe("DEPRECATED");
  });
});
