import { describe, expect, it } from "vitest";
import { ClassDiagramPolicy } from "./class-diagram";

type Ctx = Parameters<typeof ClassDiagramPolicy.validate>[0];
type Element = Ctx["elements"][number];
type Relationship = Ctx["relationships"][number];

function element(overrides: Partial<Element> = {}): Element {
  return {
    id: "e1",
    modelId: "m1",
    layer: "LA",
    type: "CLASS",
    name: "Foo",
    isAbstract: false,
    isStatic: false,
    parentId: null,
    status: "ACTIVE",
    enumerationLiteralCount: 0,
    ...overrides,
  };
}

function relationship(overrides: Partial<Relationship> = {}): Relationship {
  return {
    id: "r1",
    modelId: "m1",
    layer: "LA",
    sourceElementId: "e1",
    targetElementId: "e2",
    relationshipType: "ASSOCIATION",
    aggregationKind: "NONE",
    sourceMultiplicityLower: 1,
    sourceMultiplicityUpper: "1",
    targetMultiplicityLower: 1,
    targetMultiplicityUpper: "1",
    isNavigableSource: true,
    isNavigableTarget: true,
    status: "ACTIVE",
    ...overrides,
  };
}

function validate(elements: Element[], relationships: Relationship[] = []) {
  return ClassDiagramPolicy.validate({ elements, relationships });
}

function rules(issues: ReturnType<typeof validate>) {
  return issues.map((issue) => issue.rule);
}

describe("ClassDiagramPolicy", () => {
  it("accepts a well-formed class diagram", () => {
    expect(
      validate(
        [element(), element({ id: "e2", name: "Bar" })],
        [relationship()],
      ),
    ).toEqual([]);
  });

  it("rejects an abstract element that is not a class", () => {
    const issues = validate([element({ type: "INTERFACE", isAbstract: true })]);

    expect(rules(issues)).toContain("abstract-only-class");
  });

  it("detects a generalization cycle", () => {
    const issues = validate(
      [element(), element({ id: "e2", name: "Bar" })],
      [
        relationship({ relationshipType: "GENERALIZATION" }),
        relationship({
          id: "r2",
          sourceElementId: "e2",
          targetElementId: "e1",
          relationshipType: "GENERALIZATION",
        }),
      ],
    );

    expect(rules(issues)).toContain("generalization-cycle");
  });

  it("requires realizations to target an interface", () => {
    const issues = validate(
      [element(), element({ id: "e2", name: "Bar" })],
      [relationship({ relationshipType: "REALIZATION" })],
    );

    expect(rules(issues)).toContain("realization-target-interface");
  });

  it("requires composite aggregation to sit on an association", () => {
    const issues = validate(
      [element(), element({ id: "e2", name: "Bar" })],
      [
        relationship({
          relationshipType: "GENERALIZATION",
          aggregationKind: "COMPOSITE",
        }),
      ],
    );

    expect(rules(issues)).toContain("composition-implies-association");
  });

  it("warns when an upper multiplicity falls below the lower one", () => {
    const issues = validate(
      [element(), element({ id: "e2", name: "Bar" })],
      [
        relationship({
          sourceMultiplicityLower: 3,
          sourceMultiplicityUpper: "1",
        }),
      ],
    );

    expect(rules(issues)).toContain("multiplicity-upper-lower");
  });

  it("warns about an interface acting as the whole of a composition", () => {
    const issues = validate(
      [
        element({ type: "INTERFACE" }),
        element({ id: "e2", name: "Bar", type: "INTERFACE" }),
      ],
      [relationship({ aggregationKind: "SHARED" })],
    );

    expect(rules(issues)).toContain("interface-no-composition");
  });

  it("warns about duplicate names inside the same model and layer", () => {
    const issues = validate(
      [element(), element({ id: "e2" })],
      [relationship()],
    );

    expect(rules(issues)).toContain("duplicate-name");
  });

  it("reports blank and over-long names through the naming policy", () => {
    const blank = validate([element({ name: "   " })]);
    const tooLong = validate([element({ name: "x".repeat(256) })]);

    expect(blank.find((issue) => issue.rule === "empty-name")?.message).toBe(
      "Name cannot be empty",
    );
    expect(tooLong.find((issue) => issue.rule === "empty-name")?.message).toBe(
      "Name cannot exceed 255 characters",
    );
  });

  it("warns about an enumeration without literals", () => {
    const empty = validate([element({ type: "ENUM", name: "Color" })]);
    const populated = validate([
      element({ type: "ENUM", name: "Color", enumerationLiteralCount: 2 }),
    ]);

    expect(rules(empty)).toContain("enum-without-literals");
    expect(rules(populated)).not.toContain("enum-without-literals");
  });

  it("warns about class elements with no relationships and no parent", () => {
    expect(rules(validate([element()]))).toContain("orphan-element");
  });

  it("assigns unique issue ids", () => {
    const issues = validate(
      [element({ name: "" }), element({ id: "e2", name: "  " })],
      [],
    );

    const ids = issues.map((issue) => issue.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
