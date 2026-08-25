"use client";

export type EnvironmentNodeData = {
  width: number;
  height: number;
  label: string;
};

type EnvironmentNodeProps = {
  data: EnvironmentNodeData;
};

/**
 * EnvironmentNode — Capella-style Interaction Use reference
 *
 * Renders a rectangle spanning the covered lifelines,
 * representing an "Interaction Use" (ref) that references
 * another scenario diagram. Capella renders these with
 * a dashed border and a reference label in the top-left corner.
 */
export function EnvironmentNode({ data }: EnvironmentNodeProps) {
  return (
    <div
      className="rounded-md border-2 border-dashed border-muted-foreground/20 bg-muted/5 pointer-events-none"
      style={{ width: data.width, height: data.height }}
    >
      <div className="absolute -top-2.5 left-3 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground/60 bg-card rounded border border-border/50 shadow-sm">
        ref
      </div>
      <div className="absolute top-3 left-3 right-3 text-[10px] font-mono text-muted-foreground/50 truncate">
        {data.label}
      </div>
    </div>
  );
}
