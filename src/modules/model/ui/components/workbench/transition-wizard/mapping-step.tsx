"use client";

import { Button } from "@/modules/shared/ui/components/ui/button";
import { Checkbox } from "@/modules/shared/ui/components/ui/checkbox";
import { Input } from "@/modules/shared/ui/components/ui/input";
import { ScrollArea } from "@/modules/shared/ui/components/ui/scroll-area";
import { cn } from "@/modules/shared/ui/libs/cn";
import { ArrowRight, type LucideIcon, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { getElementTypeInfo } from "../../../helpers/element";
import type { Element } from "../../../types/element";
import { ShapeChip } from "./preview-step";
import type { RowState } from "./use-transition-wizard";

export function MappingStep({
  icon: Icon,
  title,
  subtitle,
  emptyHint,
  elements,
  rows,
  onToggle,
  onName,
  onToggleAll,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  emptyHint: string;
  elements: Element[];
  rows: Record<string, RowState>;
  onToggle: (id: string, value: boolean) => void;
  onName: (id: string, value: string) => void;
  onToggleAll: (ids: string[], value: boolean) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? elements.filter((e) => e.name.toLowerCase().includes(q))
      : elements;
  }, [elements, query]);

  const selectedCount = elements.filter((e) => rows[e.id]?.include).length;
  const allSelected = selectedCount === elements.length && elements.length > 0;
  const ids = elements.map((e) => e.id);

  if (elements.length === 0) {
    return (
      <div className="flex min-h-50 flex-col items-center justify-center gap-2 text-center">
        <Icon className="size-8 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">{emptyHint}</p>
        <p className="text-xs text-muted-foreground/60">
          You can continue to the next step.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <p className="flex items-center gap-1.5 text-sm font-medium">
            <Icon className="size-4 text-primary" />
            {title}
          </p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 shrink-0 text-xs"
          onClick={() => onToggleAll(ids, !allSelected)}
        >
          {allSelected ? "Clear all" : "Select all"}
        </Button>
      </div>

      {elements.length > 6 && (
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter elements…"
            className="h-8 ps-8 text-sm"
          />
        </div>
      )}

      <ScrollArea className="max-h-80">
        <div className="flex flex-col gap-1.5 pr-2">
          {filtered.map((el) => {
            const row = rows[el.id];
            const targetInfo = getElementTypeInfo(row.targetType);
            const sourceInfo = getElementTypeInfo(el.type);
            return (
              <div
                key={el.id}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg border px-2.5 py-2 transition-colors",
                  row.include
                    ? "border-border bg-card"
                    : "border-dashed border-border/60 bg-muted/20 opacity-60",
                )}
              >
                <Checkbox
                  checked={row.include}
                  onCheckedChange={(v) => onToggle(el.id, v === true)}
                />

                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <ShapeChip type={el.type} />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium">{el.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {sourceInfo.label}
                    </p>
                  </div>
                </div>

                <ArrowRight className="size-3.5 shrink-0 text-muted-foreground/60" />

                <div className="flex w-48 shrink-0 items-center gap-2">
                  <ShapeChip type={row.targetType} />
                  <div className="min-w-0 flex-1">
                    <Input
                      value={row.targetName}
                      disabled={!row.include}
                      onChange={(e) => onName(el.id, e.target.value)}
                      className="h-7 text-xs"
                      placeholder={el.name}
                    />
                    <p className="mt-0.5 truncate text-[9px] text-muted-foreground">
                      {targetInfo.label}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="py-6 text-center text-xs text-muted-foreground/70">
              No elements match "{query}".
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
