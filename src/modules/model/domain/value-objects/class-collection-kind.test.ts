import { describe, expect, it } from "vitest";
import { ClassCollectionKind } from "./class-collection-kind";

describe("ClassCollectionKind", () => {
  it("resolves every declared kind", () => {
    expect(ClassCollectionKind.all().map((k) => k.value)).toEqual([
      "NONE",
      "SET",
      "BAG",
      "SEQUENCE",
      "ORDERED_SET",
    ]);
    expect(ClassCollectionKind.from("ORDERED_SET")).toBe(
      ClassCollectionKind.ORDERED_SET,
    );
  });

  it("hands out a copy of the registry", () => {
    ClassCollectionKind.all().pop();
    expect(ClassCollectionKind.all()).toHaveLength(5);
  });

  it("rejects an unknown kind", () => {
    expect(() => ClassCollectionKind.from("LIST")).toThrow(
      "Invalid collection kind: LIST",
    );
  });

  it("treats anything but NONE as a collection", () => {
    expect(ClassCollectionKind.SET.isCollection()).toBe(true);
    expect(ClassCollectionKind.BAG.isCollection()).toBe(true);
    expect(ClassCollectionKind.SEQUENCE.isCollection()).toBe(true);
    expect(ClassCollectionKind.ORDERED_SET.isCollection()).toBe(true);
    expect(ClassCollectionKind.NONE.isCollection()).toBe(false);
  });

  it("compares by value and prints its value", () => {
    expect(
      ClassCollectionKind.from("SET").equals(ClassCollectionKind.SET),
    ).toBe(true);
    expect(
      ClassCollectionKind.from("SET").equals(ClassCollectionKind.BAG),
    ).toBe(false);
    expect(ClassCollectionKind.SET.toString()).toBe("SET");
  });
});
