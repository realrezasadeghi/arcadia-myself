import { executionOrderToY } from "../constants/scenario";

export type ExecutionSpecInputMessage = {
  sourceLifelineId: string;
  targetLifelineId: string;
  kind: string;
  executionOrder: number;
};

export type ExecutionSpecInputLifeline = { id: string };

export type ExecutionSpecInterval = {
  lifelineId: string;
  startOrder: number;
  endOrder: number;
  depth: number;
};

type OpenInterval = { startOrder: number; depth: number };

const isReplyKind = (kind: string) => kind === "RETURN" || kind === "REPLY";

/**
 * Computes Capella-style execution specification intervals from the message
 * sequence, following UML activation semantics:
 *
 * - Receiving CALL/CREATE/DELETE opens an activation on the target lifeline.
 * - Sending a request opens an activation on the sender if none is active.
 * - Sending RETURN/REPLY closes the replier's innermost activation.
 * - Receiving a reply closes the waiting caller's activation once it has no
 *   outstanding requests and owes no replies itself.
 * - FOUND messages open an activation on the target (unknown source).
 * - LOST messages produce a minimal activation on the sender (unknown target).
 * - Remaining open activations are closed at the scenario's last event.
 *
 * Intervals carry a nesting depth so the renderer can offset nested bars.
 */
export function computeExecutionSpecs(
  lifelines: ExecutionSpecInputLifeline[],
  messages: ExecutionSpecInputMessage[],
): ExecutionSpecInterval[] {
  const lifelineIds = new Set(lifelines.map((l) => l.id));
  const sorted = [...messages].sort(
    (a, b) => a.executionOrder - b.executionOrder,
  );
  const maxOrder = sorted.length ? sorted[sorted.length - 1].executionOrder : 0;

  const stacks = new Map<string, OpenInterval[]>();
  const intervals: ExecutionSpecInterval[] = [];
  const incomingUnanswered = new Map<string, number>();
  const outgoingUnanswered = new Map<string, number>();

  const openIfInactive = (lifelineId: string, order: number) => {
    if (!lifelineIds.has(lifelineId)) return;
    let stack = stacks.get(lifelineId);
    if (!stack) {
      stack = [];
      stacks.set(lifelineId, stack);
    }
    if (stack.length === 0) {
      stack.push({ startOrder: order, depth: 0 });
    }
  };

  const closeInnermost = (lifelineId: string, order: number) => {
    const stack = stacks.get(lifelineId);
    if (!stack || stack.length === 0) return;
    const open = stack.pop();
    if (!open) return;
    intervals.push({
      lifelineId,
      startOrder: open.startOrder,
      endOrder: Math.max(order, open.startOrder),
      depth: open.depth,
    });
  };

  for (const message of sorted) {
    const { sourceLifelineId: source, targetLifelineId: target } = message;
    const order = message.executionOrder;
    const isSelf = source === target;

    if (message.kind === "FOUND") {
      openIfInactive(target, order);
      incomingUnanswered.set(target, (incomingUnanswered.get(target) ?? 0) + 1);
      continue;
    }

    if (message.kind === "LOST") {
      openIfInactive(source, order);
      closeInnermost(source, order);
      continue;
    }

    if (isReplyKind(message.kind)) {
      if (isSelf) {
        incomingUnanswered.set(
          source,
          Math.max(0, (incomingUnanswered.get(source) ?? 0) - 1),
        );
        outgoingUnanswered.set(
          source,
          Math.max(0, (outgoingUnanswered.get(source) ?? 0) - 1),
        );
        closeInnermost(source, order);
        continue;
      }

      // Send side: the replier finishes its activation.
      incomingUnanswered.set(
        source,
        Math.max(0, (incomingUnanswered.get(source) ?? 0) - 1),
      );
      closeInnermost(source, order);

      // Receive side: the caller's wait may complete.
      outgoingUnanswered.set(
        target,
        Math.max(0, (outgoingUnanswered.get(target) ?? 0) - 1),
      );
      if (
        (outgoingUnanswered.get(target) ?? 0) === 0 &&
        (incomingUnanswered.get(target) ?? 0) === 0
      ) {
        closeInnermost(target, order);
      }
      continue;
    }

    // Request kinds: CALL / CREATE / DELETE
    if (isSelf) {
      openIfInactive(source, order);
      continue;
    }

    // Send side: sender stays active while waiting for the reply.
    openIfInactive(source, order);
    outgoingUnanswered.set(source, (outgoingUnanswered.get(source) ?? 0) + 1);

    // Receive side: the callee starts processing.
    openIfInactive(target, order);
    incomingUnanswered.set(target, (incomingUnanswered.get(target) ?? 0) + 1);
  }

  // Close anything still open at the end of the scenario.
  for (const [lifelineId, stack] of stacks) {
    while (stack.length > 0) {
      const open = stack.pop();
      if (!open) break;
      intervals.push({
        lifelineId,
        startOrder: open.startOrder,
        endOrder: Math.max(maxOrder, open.startOrder),
        depth: open.depth,
      });
    }
  }

  return intervals.sort((a, b) => {
    if (a.lifelineId !== b.lifelineId) {
      return a.lifelineId.localeCompare(b.lifelineId);
    }
    return a.startOrder - b.startOrder;
  });
}

export function executionSpecGeometry(
  startOrder: number,
  endOrder: number,
): { top: number; height: number } {
  const top = executionOrderToY(startOrder) - 4;
  const bottom = executionOrderToY(endOrder) + 4;
  return { top, height: Math.max(bottom - top, 14) };
}
