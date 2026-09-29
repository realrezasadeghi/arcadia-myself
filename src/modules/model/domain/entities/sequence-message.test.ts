import { describe, expect, it } from "vitest";
import { SequenceMessage } from "./sequence-message";

type CreateProps = Partial<Parameters<typeof SequenceMessage.create>[0]>;
type ReconstituteProps = Parameters<typeof SequenceMessage.reconstitute>[0];

const createProps = (overrides: CreateProps = {}) => ({
  id: "message-1",
  scenarioId: "scenario-1",
  name: "  request  ",
  sourceLifelineId: "lifeline-1",
  targetLifelineId: "lifeline-2",
  executionOrder: 1,
  ...overrides,
});

const reconstitutable = (
  overrides: Partial<ReconstituteProps> = {},
): ReconstituteProps => ({
  id: "message-1",
  scenarioId: "scenario-1",
  name: "request",
  kind: "CALL",
  sourceLifelineId: "lifeline-1",
  targetLifelineId: "lifeline-2",
  executionOrder: 2,
  exchangedItemId: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
  ...overrides,
});

describe("SequenceMessage.create", () => {
  it("builds a synchronous call with a trimmed name", () => {
    const message = SequenceMessage.create(createProps());

    expect(message.id).toBe("message-1");
    expect(message.scenarioId).toBe("scenario-1");
    expect(message.name).toBe("request");
    expect(message.kind.value).toBe("CALL");
    expect(message.sourceLifelineId).toBe("lifeline-1");
    expect(message.targetLifelineId).toBe("lifeline-2");
    expect(message.executionOrder).toBe(1);
    expect(message.exchangedItemId).toBeNull();
    expect(message.createdAt).toBeInstanceOf(Date);
  });

  it("keeps an explicit kind and exchanged item", () => {
    const message = SequenceMessage.create(
      createProps({ kind: "REPLY", exchangedItemId: "item-1" }),
    );

    expect(message.kind.value).toBe("REPLY");
    expect(message.exchangedItemId).toBe("item-1");
  });

  it("rejects a blank name and an unknown kind", () => {
    expect(() => SequenceMessage.create(createProps({ name: "  " }))).toThrow(
      "Message name is required",
    );
    expect(() =>
      SequenceMessage.create(createProps({ kind: "ASYNC" })),
    ).toThrow("Invalid message type: ASYNC");
  });

  it("allows a self message but never a self create or delete", () => {
    expect(() =>
      SequenceMessage.create(createProps({ targetLifelineId: "lifeline-1" })),
    ).not.toThrow();

    expect(() =>
      SequenceMessage.create(
        createProps({
          kind: "CREATE",
          targetLifelineId: "lifeline-1",
        }),
      ),
    ).toThrow("Cannot create or destroy the same lifeline with a self-message");

    expect(() =>
      SequenceMessage.create(
        createProps({
          kind: "DELETE",
          targetLifelineId: "lifeline-1",
        }),
      ),
    ).toThrow("Cannot create or destroy the same lifeline with a self-message");
  });
});

describe("SequenceMessage.reconstitute", () => {
  it("restores every persisted field", () => {
    const message = SequenceMessage.reconstitute(reconstitutable());

    expect(message.kind.value).toBe("CALL");
    expect(message.executionOrder).toBe(2);
    expect(message.exchangedItemId).toBeNull();
    expect(message.createdAt.toISOString()).toBe("2026-01-01T00:00:00.000Z");
    expect(message.updatedAt.toISOString()).toBe("2026-01-02T00:00:00.000Z");
  });

  it("refuses an unknown kind", () => {
    expect(() =>
      SequenceMessage.reconstitute(reconstitutable({ kind: "ASYNC" })),
    ).toThrow("Invalid message type: ASYNC");
  });
});

describe("SequenceMessage mutators", () => {
  it("renames with a trimmed value and bumps updatedAt", () => {
    const message = SequenceMessage.reconstitute(reconstitutable());

    message.rename("  response  ");

    expect(message.name).toBe("response");
    expect(message.updatedAt.getTime()).toBeGreaterThan(
      new Date("2026-01-02T00:00:00.000Z").getTime(),
    );
  });

  it("rejects an empty rename", () => {
    const message = SequenceMessage.reconstitute(reconstitutable());

    expect(() => message.rename("   ")).toThrow("Message name cannot be empty");
    expect(message.name).toBe("request");
  });

  it("repoints the endpoints unless the kind forbids it", () => {
    const call = SequenceMessage.reconstitute(reconstitutable());

    call.setTarget("lifeline-1");
    expect(call.targetLifelineId).toBe("lifeline-1");

    call.setSource("lifeline-3");
    expect(call.sourceLifelineId).toBe("lifeline-3");

    const create = SequenceMessage.reconstitute(
      reconstitutable({ kind: "CREATE" }),
    );

    expect(() => create.setSource("lifeline-2")).toThrow(
      "Cannot create or destroy the same lifeline",
    );
    expect(() => create.setTarget("lifeline-1")).toThrow(
      "Cannot create or destroy the same lifeline",
    );
    expect(create.updatedAt.toISOString()).toBe("2026-01-02T00:00:00.000Z");
  });

  it("rejects a negative execution order", () => {
    const message = SequenceMessage.reconstitute(reconstitutable());

    expect(() => message.setExecutionOrder(-1)).toThrow(
      "Execution order must be non-negative",
    );

    message.setExecutionOrder(0);

    expect(message.executionOrder).toBe(0);
    expect(message.updatedAt.getTime()).toBeGreaterThan(
      new Date("2026-01-02T00:00:00.000Z").getTime(),
    );
  });

  it("sets and clears the exchanged item", () => {
    const message = SequenceMessage.reconstitute(reconstitutable());

    message.setExchangedItem("item-4");
    expect(message.exchangedItemId).toBe("item-4");

    message.setExchangedItem(null);
    expect(message.exchangedItemId).toBeNull();
    expect(message.updatedAt.getTime()).toBeGreaterThan(
      new Date("2026-01-02T00:00:00.000Z").getTime(),
    );
  });
});

describe("SequenceMessage.toJSON", () => {
  it("serialises the kind, endpoints and dates", () => {
    const json = SequenceMessage.reconstitute(reconstitutable()).toJSON();

    expect(json).toEqual({
      id: "message-1",
      scenarioId: "scenario-1",
      name: "request",
      kind: "CALL",
      sourceLifelineId: "lifeline-1",
      targetLifelineId: "lifeline-2",
      executionOrder: 2,
      exchangedItemId: null,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
    });
  });

  it("compares messages by id", () => {
    const message = SequenceMessage.reconstitute(reconstitutable());

    expect(
      message.equals(SequenceMessage.reconstitute(reconstitutable())),
    ).toBe(true);
    expect(
      message.equals(
        SequenceMessage.reconstitute(reconstitutable({ id: "other" })),
      ),
    ).toBe(false);
  });
});
