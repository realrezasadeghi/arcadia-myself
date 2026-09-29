import { describe, expect, it } from "vitest";
import {
  checkName,
  NAME_MAX_LENGTH,
  SHORT_NAME_MAX_LENGTH,
  validateOptionalName,
  validateRequiredName,
} from "./naming";

describe("naming policy", () => {
  it("exposes the standard maximum lengths", () => {
    expect(NAME_MAX_LENGTH).toBe(255);
    expect(SHORT_NAME_MAX_LENGTH).toBe(100);
  });

  describe("checkName", () => {
    it("trims surrounding whitespace", () => {
      expect(checkName("  System Function  ", { label: "Name" })).toEqual({
        valid: true,
        value: "System Function",
      });
    });

    it("reports missing values as required", () => {
      expect(checkName(undefined, { label: "Element name" })).toEqual({
        valid: false,
        message: "Element name is required",
      });
      expect(checkName(null, { label: "Element name" })).toEqual({
        valid: false,
        message: "Element name is required",
      });
    });

    it("reports blank values as empty", () => {
      expect(checkName("", { label: "Element name" })).toEqual({
        valid: false,
        message: "Element name cannot be empty",
      });
      expect(checkName("   ", { label: "Element name" })).toEqual({
        valid: false,
        message: "Element name cannot be empty",
      });
    });

    it("defaults to the 255 character maximum", () => {
      const value = "a".repeat(255);
      expect(checkName(value, { label: "Name" }).valid).toBe(true);
      expect(checkName(`${value}a`, { label: "Name" })).toEqual({
        valid: false,
        message: "Name cannot exceed 255 characters",
      });
    });

    it("honours a custom maximum", () => {
      const value = "a".repeat(101);
      expect(
        checkName(value, { label: "Element name", maxLength: 100 }),
      ).toEqual({
        valid: false,
        message: "Element name cannot exceed 100 characters",
      });
    });
  });

  describe("validateRequiredName", () => {
    it("returns the trimmed value when valid", () => {
      expect(
        validateRequiredName(" PhysicalComponent ", { label: "Element name" }),
      ).toBe("PhysicalComponent");
    });

    it("throws with the policy message", () => {
      expect(() =>
        validateRequiredName("", { label: "Diagram name" }),
      ).toThrowError("Diagram name cannot be empty");

      expect(() =>
        validateRequiredName(undefined, { label: "Diagram name" }),
      ).toThrowError("Diagram name is required");

      expect(() =>
        validateRequiredName("a".repeat(101), {
          label: "Diagram name",
          maxLength: 100,
        }),
      ).toThrowError("Diagram name cannot exceed 100 characters");
    });
  });

  describe("validateOptionalName", () => {
    it("normalises absent and blank values to undefined", () => {
      const rule = { label: "Relationship name", maxLength: 100 };
      expect(validateOptionalName(undefined, rule)).toBeUndefined();
      expect(validateOptionalName(null, rule)).toBeUndefined();
      expect(validateOptionalName("", rule)).toBeUndefined();
      expect(validateOptionalName("   ", rule)).toBeUndefined();
    });

    it("trims present values", () => {
      expect(
        validateOptionalName(" Realization ", {
          label: "Relationship name",
          maxLength: 100,
        }),
      ).toBe("Realization");
    });

    it("throws when a present value is too long", () => {
      expect(() =>
        validateOptionalName("a".repeat(101), {
          label: "Relationship name",
          maxLength: 100,
        }),
      ).toThrowError("Relationship name cannot exceed 100 characters");
    });
  });
});
