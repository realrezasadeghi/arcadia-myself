import { describe, expect, it } from "vitest";
import { ClassVisibility } from "./class-visibility";

describe("ClassVisibility", () => {
  it("resolves every declared visibility", () => {
    expect(ClassVisibility.from("public")).toBe(ClassVisibility.PUBLIC);
    expect(ClassVisibility.from("private")).toBe(ClassVisibility.PRIVATE);
    expect(ClassVisibility.from("protected")).toBe(ClassVisibility.PROTECTED);
    expect(ClassVisibility.from("package")).toBe(ClassVisibility.PACKAGE);
  });

  it("rejects an unknown visibility", () => {
    expect(() => ClassVisibility.from("Public")).toThrow(
      "Invalid visibility: Public",
    );
  });

  it("compares by value and prints its value", () => {
    expect(
      ClassVisibility.from("private").equals(ClassVisibility.PRIVATE),
    ).toBe(true);
    expect(ClassVisibility.from("private").equals(ClassVisibility.PUBLIC)).toBe(
      false,
    );
    expect(ClassVisibility.PACKAGE.toString()).toBe("package");
  });
});
