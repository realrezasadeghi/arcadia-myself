import { describe, expect, it } from "vitest";
import { ClassRelationshipType } from "./class-relationship-type";
import { ClassVisibility } from "./class-visibility";

const VALUES = [
  "ASSOCIATION",
  "GENERALIZATION",
  "REALIZATION",
  "DEPENDENCY",
] as const;

describe("ClassRelationshipType.from", () => {
  it("resolves every registered type to its constant", () => {
    for (const value of VALUES) {
      const type = ClassRelationshipType.from(value);
      expect(type.value).toBe(value);
      expect(type).toBe(ClassRelationshipType[value]);
    }
  });

  it("exposes the four static constants", () => {
    expect(ClassRelationshipType.ASSOCIATION.value).toBe("ASSOCIATION");
    expect(ClassRelationshipType.GENERALIZATION.value).toBe("GENERALIZATION");
    expect(ClassRelationshipType.REALIZATION.value).toBe("REALIZATION");
    expect(ClassRelationshipType.DEPENDENCY.value).toBe("DEPENDENCY");
  });

  it("rejects unknown values with the exact message", () => {
    expect(() => ClassRelationshipType.from("WIDGET")).toThrow(
      "Invalid class relationship type: WIDGET",
    );
    expect(() => ClassRelationshipType.from("")).toThrow(
      "Invalid class relationship type: ",
    );
    expect(() => ClassRelationshipType.from("association")).toThrow(
      "Invalid class relationship type: association",
    );
  });
});

describe("ClassRelationshipType.all", () => {
  it("returns every type in declaration order", () => {
    expect(ClassRelationshipType.all().map((t) => t.value)).toEqual([
      ...VALUES,
    ]);
    expect(ClassRelationshipType.all()[0]).toBe(
      ClassRelationshipType.ASSOCIATION,
    );
    expect(ClassRelationshipType.all()[3]).toBe(
      ClassRelationshipType.DEPENDENCY,
    );
  });

  it("returns a fresh copy on every call", () => {
    const first = ClassRelationshipType.all();
    expect(first).not.toBe(ClassRelationshipType.all());

    first.pop();
    first[0] = ClassRelationshipType.DEPENDENCY;

    expect(ClassRelationshipType.all().map((t) => t.value)).toEqual([
      ...VALUES,
    ]);
  });
});

describe("ClassRelationshipType metadata", () => {
  it("describes every type with label, labelFa and description", () => {
    const labels: Record<(typeof VALUES)[number], string> = {
      ASSOCIATION: "Association",
      GENERALIZATION: "Generalization",
      REALIZATION: "Realization",
      DEPENDENCY: "Dependency",
    };
    const labelsFa: Record<(typeof VALUES)[number], string> = {
      ASSOCIATION: "ارتباط",
      GENERALIZATION: "تعمیم",
      REALIZATION: "تحقق",
      DEPENDENCY: "وابستگی",
    };

    for (const type of ClassRelationshipType.all()) {
      expect(type.label).toBe(labels[type.value]);
      expect(type.labelFa).toBe(labelsFa[type.value]);
      expect(type.description.length).toBeGreaterThan(0);
    }

    expect(ClassRelationshipType.REALIZATION.description).toBe(
      "An implementation relationship (class implements interface)",
    );
  });

  it("stringifies to its raw value", () => {
    expect(ClassRelationshipType.GENERALIZATION.toString()).toBe(
      "GENERALIZATION",
    );
    expect(`${ClassRelationshipType.DEPENDENCY}`).toBe("DEPENDENCY");
  });
});

describe("ClassRelationshipType predicates", () => {
  it("treats generalization and realization as inheritance", () => {
    expect(ClassRelationshipType.GENERALIZATION.isInheritance()).toBe(true);
    expect(ClassRelationshipType.REALIZATION.isInheritance()).toBe(true);
    expect(ClassRelationshipType.ASSOCIATION.isInheritance()).toBe(false);
    expect(ClassRelationshipType.DEPENDENCY.isInheritance()).toBe(false);
  });

  it("scopes structural and whole-part checks to association", () => {
    expect(ClassRelationshipType.ASSOCIATION.isStructural()).toBe(true);
    expect(ClassRelationshipType.GENERALIZATION.isStructural()).toBe(false);
    expect(ClassRelationshipType.ASSOCIATION.isWholePart()).toBe(true);
    expect(ClassRelationshipType.DEPENDENCY.isWholePart()).toBe(false);
  });
});

describe("ClassRelationshipType.equals", () => {
  it("matches same-type instances and rejects different types", () => {
    expect(
      ClassRelationshipType.ASSOCIATION.equals(
        ClassRelationshipType.from("ASSOCIATION"),
      ),
    ).toBe(true);
    expect(
      ClassRelationshipType.ASSOCIATION.equals(
        ClassRelationshipType.DEPENDENCY,
      ),
    ).toBe(false);
    expect(
      ClassRelationshipType.REALIZATION.equals(
        ClassRelationshipType.REALIZATION,
      ),
    ).toBe(true);
  });

  it("rejects value objects of another class", () => {
    expect(
      ClassRelationshipType.ASSOCIATION.equals(
        ClassVisibility.PUBLIC as unknown as ClassRelationshipType,
      ),
    ).toBe(false);
  });
});
