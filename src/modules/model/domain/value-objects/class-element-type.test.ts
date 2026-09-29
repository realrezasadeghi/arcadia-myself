import { describe, expect, it } from "vitest";
import { ClassElementType } from "./class-element-type";

const META: Record<string, { label: string; labelFa: string }> = {
  CLASS: { label: "Class", labelFa: "کلاس" },
  INTERFACE: { label: "Interface", labelFa: "رابط" },
  ENUM: { label: "Enumeration", labelFa: "شمارش" },
  DATA_TYPE: { label: "Data Type", labelFa: "نوع داده" },
  PRIMITIVE: { label: "Primitive", labelFa: "ابتدایی" },
  COLLECTION: { label: "Collection", labelFa: "مجموعه" },
  UNION: { label: "Union", labelFa: "اتحاد" },
  PACKAGE: { label: "Package", labelFa: "پکیج" },
};

const VALUES = Object.keys(META);

describe("ClassElementType.from", () => {
  it("resolves every registered type to its constant", () => {
    for (const value of VALUES) {
      const type = ClassElementType.from(value);
      expect(type.value).toBe(value);
      expect(type).toBe(
        ClassElementType[value as keyof typeof ClassElementType],
      );
    }
  });

  it("exposes the eight static constants", () => {
    expect(ClassElementType.CLASS.value).toBe("CLASS");
    expect(ClassElementType.INTERFACE.value).toBe("INTERFACE");
    expect(ClassElementType.ENUM.value).toBe("ENUM");
    expect(ClassElementType.DATA_TYPE.value).toBe("DATA_TYPE");
    expect(ClassElementType.PRIMITIVE.value).toBe("PRIMITIVE");
    expect(ClassElementType.COLLECTION.value).toBe("COLLECTION");
    expect(ClassElementType.UNION.value).toBe("UNION");
    expect(ClassElementType.PACKAGE.value).toBe("PACKAGE");
  });

  it("rejects unknown values with the exact message", () => {
    expect(() => ClassElementType.from("WIDGET")).toThrow(
      "Invalid class element type: WIDGET",
    );
    expect(() => ClassElementType.from("")).toThrow(
      "Invalid class element type: ",
    );
    expect(() => ClassElementType.from("class")).toThrow(
      "Invalid class element type: class",
    );
  });
});

describe("ClassElementType.all", () => {
  it("returns every type in declaration order", () => {
    expect(ClassElementType.all().map((t) => t.value)).toEqual(VALUES);
    expect(ClassElementType.all()[0]).toBe(ClassElementType.CLASS);
    expect(ClassElementType.all()[7]).toBe(ClassElementType.PACKAGE);
  });

  it("returns a fresh copy on every call", () => {
    const first = ClassElementType.all();
    expect(first).not.toBe(ClassElementType.all());

    first.pop();
    first[0] = ClassElementType.PACKAGE;

    expect(ClassElementType.all().map((t) => t.value)).toEqual(VALUES);
  });
});

describe("ClassElementType metadata", () => {
  it("describes every type with its English and Persian labels", () => {
    for (const type of ClassElementType.all()) {
      expect(type.label).toBe(META[type.value].label);
      expect(type.labelFa).toBe(META[type.value].labelFa);
    }
    expect(ClassElementType.ENUM.label).toBe("Enumeration");
    expect(ClassElementType.ENUM.labelFa).toBe("شمارش");
    expect(ClassElementType.PACKAGE.labelFa).toBe("پکیج");
  });

  it("stringifies to its raw value", () => {
    expect(ClassElementType.DATA_TYPE.toString()).toBe("DATA_TYPE");
    expect(`${ClassElementType.ENUM}`).toBe("ENUM");
  });
});

describe("ClassElementType predicates", () => {
  it("identifies each type exclusively", () => {
    expect(ClassElementType.CLASS.isClass()).toBe(true);
    expect(ClassElementType.INTERFACE.isInterface()).toBe(true);
    expect(ClassElementType.ENUM.isEnum()).toBe(true);
    expect(ClassElementType.COLLECTION.isCollection()).toBe(true);
    expect(ClassElementType.UNION.isUnion()).toBe(true);
    expect(ClassElementType.PACKAGE.isPackage()).toBe(true);

    expect(ClassElementType.CLASS.isInterface()).toBe(false);
    expect(ClassElementType.INTERFACE.isClass()).toBe(false);
    expect(ClassElementType.ENUM.isCollection()).toBe(false);
    expect(ClassElementType.PACKAGE.isUnion()).toBe(false);
    expect(ClassElementType.PRIMITIVE.isClass()).toBe(false);
  });

  it("groups DATA_TYPE and PRIMITIVE under isDataType", () => {
    expect(ClassElementType.DATA_TYPE.isDataType()).toBe(true);
    expect(ClassElementType.PRIMITIVE.isDataType()).toBe(true);
    expect(ClassElementType.CLASS.isDataType()).toBe(false);
    expect(ClassElementType.COLLECTION.isDataType()).toBe(false);
  });
});

describe("ClassElementType.equals", () => {
  it("matches same-type instances and rejects different types", () => {
    expect(ClassElementType.CLASS.equals(ClassElementType.from("CLASS"))).toBe(
      true,
    );
    expect(ClassElementType.CLASS.equals(ClassElementType.INTERFACE)).toBe(
      false,
    );
    expect(ClassElementType.ENUM.equals(ClassElementType.ENUM)).toBe(true);
  });
});
