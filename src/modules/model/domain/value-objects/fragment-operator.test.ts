import { describe, expect, it } from "vitest";
import { FragmentOperator } from "./fragment-operator";

describe("FragmentOperator", () => {
  it("resolves every declared operator", () => {
    expect(FragmentOperator.all().map((o) => o.value)).toEqual([
      "alt",
      "opt",
      "loop",
      "break",
      "par",
      "critical",
      "assert",
      "neg",
      "ignore",
      "consider",
      "strict",
      "seq",
    ]);
    expect(FragmentOperator.from("alt").value).toBe("alt");
  });

  it("rejects an unknown operator", () => {
    expect(() => FragmentOperator.from("except")).toThrow(
      "Invalid fragment operator: except",
    );
  });

  it("exposes bilingual labels and a description", () => {
    const loop = FragmentOperator.from("loop");

    expect(loop.label).toBe("Loop");
    expect(loop.labelFa).toBe("حلقه");
    expect(loop.description).toBe("Repeated execution");
    expect(loop.toString()).toBe("loop");
  });

  it("marks the operators that carry a guard", () => {
    for (const guarded of ["alt", "opt", "loop", "break", "assert"] as const) {
      expect(FragmentOperator.from(guarded).hasGuard).toBe(true);
    }
    for (const unguarded of ["par", "critical", "neg", "seq"] as const) {
      expect(FragmentOperator.from(unguarded).hasGuard).toBe(false);
    }
  });

  it("marks the operators that own several operands", () => {
    for (const multi of ["alt", "par", "strict", "seq"] as const) {
      expect(FragmentOperator.from(multi).hasMultipleOperands).toBe(true);
    }
    for (const single of ["opt", "loop", "break", "critical"] as const) {
      expect(FragmentOperator.from(single).hasMultipleOperands).toBe(false);
    }
  });

  it("compares by value", () => {
    expect(
      FragmentOperator.from("neg").equals(FragmentOperator.from("neg")),
    ).toBe(true);
    expect(
      FragmentOperator.from("neg").equals(FragmentOperator.from("ignore")),
    ).toBe(false);
  });
});
