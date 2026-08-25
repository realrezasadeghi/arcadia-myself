export type NumberingInputMessage = {
  id: string;
  executionOrder: number;
};

export type NumberingInputFragment = {
  id: string;
  rowIndex: number;
};

type Span = { top: number; bottom: number };

/**
 * Computes Capella/UML hierarchical message numbers ("1", "2", "2.1", ...)
 * from fragment containment:
 *
 * - A fragment's vertical span is [rowIndex .. last message order at or
 *   below rowIndex] (bottom falls back to rowIndex for empty fragments).
 * - A message belongs to the innermost (smallest) fragment span containing
 *   its execution order; fragments nest the same way via their top row.
 * - Within each level, fragments and messages are numbered together in
 *   positional order (fragment → rowIndex, message → executionOrder).
 *
 * Returns a map of messageId → label. Messages outside any fragment get
 * top-level numbers.
 */
export function computeMessageNumbers(
  messages: NumberingInputMessage[],
  fragments: NumberingInputFragment[],
): Map<string, string> {
  const numbers = new Map<string, string>();
  if (messages.length === 0) return numbers;

  const sortedMessages = [...messages].sort(
    (a, b) => a.executionOrder - b.executionOrder,
  );

  const spans = new Map<string, Span>();
  for (const fragment of fragments) {
    const containedOrders = sortedMessages
      .filter((m) => m.executionOrder >= fragment.rowIndex)
      .map((m) => m.executionOrder);
    const bottom = containedOrders.length
      ? Math.max(fragment.rowIndex, ...containedOrders)
      : fragment.rowIndex;
    spans.set(fragment.id, { top: fragment.rowIndex, bottom });
  }

  const contains = (outer: Span, innerTop: number) =>
    innerTop >= outer.top && innerTop <= outer.bottom;

  const messageFragment = new Map<string, string>();
  for (const message of sortedMessages) {
    let best: { id: string; span: Span } | null = null;
    for (const fragment of fragments) {
      const span = spans.get(fragment.id);
      if (!span) continue;
      if (!contains(span, message.executionOrder)) continue;
      if (!best || span.top > best.span.top) {
        best = { id: fragment.id, span };
      }
    }
    if (best) messageFragment.set(message.id, best.id);
  }

  const fragmentParent = new Map<string, string>();
  for (const fragment of fragments) {
    let best: { id: string; top: number } | null = null;
    for (const other of fragments) {
      if (other.id === fragment.id) continue;
      const span = spans.get(other.id);
      if (!span) continue;
      if (!contains(span, fragment.rowIndex)) continue;
      if (!best || span.top > best.top) {
        best = { id: other.id, top: span.top };
      }
    }
    if (best) fragmentParent.set(fragment.id, best.id);
  }

  const childrenOf = new Map<
    string,
    { kind: "fragment" | "message"; id: string; position: number }[]
  >();
  const rootItems: {
    kind: "fragment" | "message";
    id: string;
    position: number;
  }[] = [];

  for (const fragment of fragments) {
    const parent = fragmentParent.get(fragment.id);
    const item = {
      kind: "fragment" as const,
      id: fragment.id,
      position: fragment.rowIndex,
    };
    if (parent) {
      const list = childrenOf.get(parent) ?? [];
      list.push(item);
      childrenOf.set(parent, list);
    } else {
      rootItems.push(item);
    }
  }

  for (const message of sortedMessages) {
    const parent = messageFragment.get(message.id);
    const item = {
      kind: "message" as const,
      id: message.id,
      position: message.executionOrder,
    };
    if (parent) {
      const list = childrenOf.get(parent) ?? [];
      list.push(item);
      childrenOf.set(parent, list);
    } else {
      rootItems.push(item);
    }
  }

  const visit = (
    items: { kind: "fragment" | "message"; id: string; position: number }[],
    prefix: string,
  ) => {
    const sorted = [...items].sort((a, b) =>
      a.position !== b.position
        ? a.position - b.position
        : a.kind.localeCompare(b.kind),
    );
    sorted.forEach((item, index) => {
      const label = prefix ? `${prefix}.${index + 1}` : `${index + 1}`;
      if (item.kind === "message") {
        numbers.set(item.id, label);
      } else {
        visit(childrenOf.get(item.id) ?? [], label);
      }
    });
  };

  visit(rootItems, "");
  return numbers;
}
