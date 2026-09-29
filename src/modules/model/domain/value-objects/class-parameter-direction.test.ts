import { describe, expect, it } from "vitest";
import { ClassParameterDirection } from "./class-parameter-direction";

describe("ClassParameterDirection", () => {
  it("resolves every declared direction", () => {
    expect(ClassParameterDirection.all().map((d) => d.value)).toEqual([
      "IN",
      "OUT",
      "INOUT",
      "RETURN",
    ]);
    expect(ClassParameterDirection.from("RETURN")).toBe(
      ClassParameterDirection.RETURN,
    );
  });

  it("hands out a copy of the registry", () => {
    ClassParameterDirection.all().pop();
    expect(ClassParameterDirection.all()).toHaveLength(4);
  });

  it("rejects an unknown direction", () => {
    expect(() => ClassParameterDirection.from("INOUT_OUT")).toThrow(
      "Invalid parameter direction: INOUT_OUT",
    );
  });

  it("compares by value and prints its value", () => {
    expect(
      ClassParameterDirection.from("OUT").equals(ClassParameterDirection.OUT),
    ).toBe(true);
    expect(
      ClassParameterDirection.from("OUT").equals(ClassParameterDirection.IN),
    ).toBe(false);
    expect(ClassParameterDirection.INOUT.toString()).toBe("INOUT");
  });
});
