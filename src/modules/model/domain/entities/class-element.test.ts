import { describe, expect, it } from "vitest";
import { ClassVisibility } from "../value-objects/class-visibility";
import { Layer } from "../value-objects/layer";
import {
  ClassElement,
  ClassElementParentChangedEvent,
  ClassElementRenamedEvent,
} from "./class-element";

type CreateProps = Partial<Parameters<typeof ClassElement.create>[0]>;
type ReconstituteProps = Parameters<typeof ClassElement.reconstitute>[0];

const createProps = (overrides: CreateProps = {}) => ({
  id: "element-1",
  modelId: "model-1",
  layer: "LA",
  name: "Order",
  elementType: "CLASS",
  ...overrides,
});

const reconstitutable = (
  overrides: Partial<ReconstituteProps> = {},
): ReconstituteProps => ({
  id: "element-1",
  modelId: "model-1",
  layer: "LA",
  name: "Order",
  description: "an order",
  elementType: "CLASS",
  visibility: "private",
  isAbstract: true,
  isStatic: false,
  parentId: "parent-1",
  ordering: 3,
  status: "VALIDATED",
  extensionProperties: { stereotype: "entity" },
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
  ...overrides,
});

describe("ClassElement.create", () => {
  it("builds a draft element with defaults", () => {
    const element = ClassElement.create(createProps());

    expect(element.id).toBe("element-1");
    expect(element.modelId).toBe("model-1");
    expect(element.layer.value).toBe("LA");
    expect(element.name).toBe("Order");
    expect(element.description).toBe("");
    expect(element.elementType.value).toBe("CLASS");
    expect(element.visibility.value).toBe("public");
    expect(element.isAbstract).toBe(false);
    expect(element.isStatic).toBe(false);
    expect(element.parentId).toBeNull();
    expect(element.ordering).toBe(0);
    expect(element.status).toBe("DRAFT");
    expect(element.extensionProperties).toEqual({});
    expect(element.isRoot()).toBe(true);
  });

  it("applies the provided flags, hierarchy and extension data", () => {
    const element = ClassElement.create(
      createProps({
        name: "  Abstract Order  ",
        description: "notes",
        visibility: "protected",
        isAbstract: true,
        isStatic: true,
        parentId: "parent-1",
        ordering: 7,
        extensionProperties: { stereotype: "entity" },
      }),
    );

    expect(element.name).toBe("Abstract Order");
    expect(element.description).toBe("notes");
    expect(element.visibility.value).toBe("protected");
    expect(element.isAbstract).toBe(true);
    expect(element.isStatic).toBe(true);
    expect(element.parentId).toBe("parent-1");
    expect(element.ordering).toBe(7);
    expect(element.extensionProperties).toEqual({ stereotype: "entity" });
    expect(element.isRoot()).toBe(false);
  });

  it("accepts an already-built Layer instance", () => {
    const element = ClassElement.create(createProps({ layer: Layer.SA }));

    expect(element.layer.value).toBe("SA");
  });

  it("rejects blank names and unknown value objects", () => {
    expect(() => ClassElement.create(createProps({ name: "   " }))).toThrow(
      "Class element name is required",
    );
    expect(() => ClassElement.create(createProps({ layer: "XX" }))).toThrow(
      "Invalid layer value : XX",
    );
    expect(() =>
      ClassElement.create(createProps({ elementType: "NOPE" })),
    ).toThrow("Invalid class element type: NOPE");
    expect(() =>
      ClassElement.create(createProps({ visibility: "hidden" })),
    ).toThrow("Invalid visibility: hidden");
  });

  it("refuses the abstract flag on non-class elements", () => {
    expect(() =>
      ClassElement.create(
        createProps({ elementType: "INTERFACE", isAbstract: true }),
      ),
    ).toThrow("Only CLASS elements can be abstract");

    expect(() =>
      ClassElement.create(createProps({ elementType: "INTERFACE" })),
    ).not.toThrow();
  });
});

describe("ClassElement.reconstitute", () => {
  it("restores every persisted field", () => {
    const element = ClassElement.reconstitute(reconstitutable());

    expect(element.id).toBe("element-1");
    expect(element.modelId).toBe("model-1");
    expect(element.layer.value).toBe("LA");
    expect(element.name).toBe("Order");
    expect(element.description).toBe("an order");
    expect(element.elementType.value).toBe("CLASS");
    expect(element.visibility.value).toBe("private");
    expect(element.isAbstract).toBe(true);
    expect(element.isStatic).toBe(false);
    expect(element.parentId).toBe("parent-1");
    expect(element.ordering).toBe(3);
    expect(element.status).toBe("VALIDATED");
    expect(element.extensionProperties).toEqual({ stereotype: "entity" });
    expect(element.isRoot()).toBe(false);
    expect(element.createdAt.toISOString()).toBe("2026-01-01T00:00:00.000Z");
    expect(element.updatedAt.toISOString()).toBe("2026-01-02T00:00:00.000Z");
  });

  it("round-trips through toJSON", () => {
    const json = ClassElement.reconstitute(reconstitutable()).toJSON();
    const restored = ClassElement.reconstitute(json);

    expect(restored.toJSON()).toEqual(json);
  });
});

describe("ClassElement.rename", () => {
  it("trims the new name and reports the old one", () => {
    const element = ClassElement.create(createProps());

    const events = element.rename("  Invoice  ");
    const event = events[0] as ClassElementRenamedEvent;

    expect(events).toHaveLength(1);
    expect(event).toBeInstanceOf(ClassElementRenamedEvent);
    expect(event.oldName).toBe("Order");
    expect(event.newName).toBe("Invoice");
    expect(element.name).toBe("Invoice");
  });

  it("refuses an empty name", () => {
    const element = ClassElement.create(createProps());

    expect(() => element.rename("   ")).toThrow(
      "Class element name can't be empty",
    );
    expect(element.name).toBe("Order");
  });
});

describe("ClassElement.setDescription", () => {
  it("emits an event only when the text actually changes", () => {
    const element = ClassElement.create(createProps());

    expect(element.setDescription("first")).toHaveLength(1);
    expect(element.description).toBe("first");
    expect(element.setDescription("first")).toEqual([]);
    expect(element.description).toBe("first");
  });
});

describe("ClassElement.setVisibility", () => {
  it("emits an event only when the visibility changes", () => {
    const element = ClassElement.create(createProps());

    expect(element.setVisibility(ClassVisibility.PROTECTED)).toHaveLength(1);
    expect(element.visibility.value).toBe("protected");
    expect(element.setVisibility(ClassVisibility.PROTECTED)).toEqual([]);
    expect(element.visibility.value).toBe("protected");
  });
});

describe("ClassElement.setAbstract", () => {
  it("toggles abstract on a class", () => {
    const element = ClassElement.create(createProps());

    expect(element.setAbstract(true)).toHaveLength(1);
    expect(element.isAbstract).toBe(true);
    expect(element.setAbstract(true)).toEqual([]);
  });

  it("refuses abstract on non-class elements", () => {
    const element = ClassElement.create(createProps({ elementType: "ENUM" }));

    expect(() => element.setAbstract(true)).toThrow(
      "Only CLASS elements can be abstract",
    );
    expect(element.isAbstract).toBe(false);
  });
});

describe("ClassElement.setStatic", () => {
  it("emits an event only when the flag changes", () => {
    const element = ClassElement.create(createProps());

    expect(element.setStatic(true)).toHaveLength(1);
    expect(element.isStatic).toBe(true);
    expect(element.setStatic(true)).toEqual([]);
  });
});

describe("ClassElement.setParent", () => {
  it("reports the previous parent when it changes", () => {
    const element = ClassElement.create(createProps());

    const events = element.setParent("parent-1");
    const event = events[0] as ClassElementParentChangedEvent;

    expect(event).toBeInstanceOf(ClassElementParentChangedEvent);
    expect(event.oldParentId).toBeNull();
    expect(event.newParentId).toBe("parent-1");
    expect(element.isRoot()).toBe(false);

    expect(element.setParent("parent-1")).toEqual([]);

    element.setParent(null);
    expect(element.isRoot()).toBe(true);
  });

  it("refuses an element as its own parent", () => {
    const element = ClassElement.create(createProps());

    expect(() => element.setParent("element-1")).toThrow(
      "Element cannot be its own parent",
    );
    expect(element.parentId).toBeNull();
  });
});

describe("ClassElement.setOrdering", () => {
  it("emits an event only when the ordering changes", () => {
    const element = ClassElement.create(createProps());

    expect(element.setOrdering(5)).toHaveLength(1);
    expect(element.ordering).toBe(5);
    expect(element.setOrdering(5)).toEqual([]);
  });
});

describe("ClassElement.setExtensionProperty", () => {
  it("merges into the existing extension properties", () => {
    const element = ClassElement.create(
      createProps({ extensionProperties: { a: 1 } }),
    );

    const events = element.setExtensionProperty("b", 2);

    expect(events).toHaveLength(1);
    expect(element.extensionProperties).toEqual({ a: 1, b: 2 });

    element.setExtensionProperty("a", 3);
    expect(element.extensionProperties).toEqual({ a: 3, b: 2 });
  });
});

describe("ClassElement.validate", () => {
  it("moves a draft element to validated", () => {
    const element = ClassElement.create(createProps());

    const events = element.validate();

    expect(events).toHaveLength(1);
    expect(events[0].eventName).toBe("ClassElementValidated");
    expect(element.status).toBe("VALIDATED");
    expect(element.validate()).toHaveLength(1);
  });

  it("deprecates once and refuses validation afterwards", () => {
    const element = ClassElement.create(createProps());

    expect(element.deprecate()).toHaveLength(1);
    expect(element.status).toBe("DEPRECATED");
    expect(element.deprecate()).toEqual([]);
    expect(() => element.validate()).toThrow(
      "Cannot validate a deprecated element",
    );
  });
});

describe("ClassElement.equals", () => {
  it("compares on id", () => {
    const element = ClassElement.create(createProps());
    const sameId = ClassElement.create(createProps({ name: "Other" }));
    const otherId = ClassElement.create(createProps({ id: "element-2" }));

    expect(element.equals(sameId)).toBe(true);
    expect(element.equals(otherId)).toBe(false);
  });
});
