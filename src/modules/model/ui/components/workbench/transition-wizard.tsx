"use client";

import { Button } from "@/modules/shared/ui/components/ui/button";
import { Checkbox } from "@/modules/shared/ui/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/modules/shared/ui/components/ui/dialog";
import { Input } from "@/modules/shared/ui/components/ui/input";
import { Label } from "@/modules/shared/ui/components/ui/label";
import { ScrollArea } from "@/modules/shared/ui/components/ui/scroll-area";
import { cn } from "@/modules/shared/ui/libs/cn";
import {
  ArrowRight,
  Boxes,
  Check,
  GitMerge,
  Layers,
  type LucideIcon,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useTransitionLayer } from "../../clients/transition-layer";
import { getElementTypeInfo, getElementVisual } from "../../helpers/element";
import { getLayerInfo } from "../../helpers/layer";
import type { Element, ElementTypeValue } from "../../types/element";
import type { LayerValue } from "../../types/layer";
import type { Model } from "../../types/model";

// نگاشت نوع المنت مبدأ → نوع المنت لایه بعد (کلید: لایه مبدأ)
const TARGET_TYPE_MAP: Record<
  LayerValue,
  Partial<Record<ElementTypeValue, ElementTypeValue>>
> = {
  OA: {
    OperationalEntity: "SystemActor",
    OperationalActor: "SystemActor",

    OperationalCapability: "SystemCapability",
    OperationalActivity: "SystemFunction",
  },
  SA: {
    SystemActor: "LogicalActor",
    SystemComponent: "LogicalComponent",
    SystemFunction: "LogicalFunction",
  },
  LA: {
    LogicalActor: "PhysicalActor",
    LogicalComponent: "PhysicalComponent",
    LogicalFunction: "PhysicalFunction",
  },
  PA: {},
};

const NEXT_LAYER: Record<LayerValue, LayerValue | null> = {
  OA: "SA",
  SA: "LA",
  LA: "PA",
  PA: null,
};

const LAYER_COLORS: Record<LayerValue, string> = {
  OA: "#2E86C1",
  SA: "#CA6F1E",
  LA: "#1E8449",
  PA: "#6C3483",
};

type RowState = {
  include: boolean;
  targetName: string;
  targetType: ElementTypeValue;
};

type TransitionWizardProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  sourceModel: Model;
  sourceElements: Element[];
  onCompleted: () => void;
};

export function TransitionWizard({
  open,
  onOpenChange,
  projectId,
  sourceModel,
  sourceElements,
  onCompleted,
}: TransitionWizardProps) {
  const transition = useTransitionLayer();

  const sourceLayer = sourceModel.layer;
  const targetLayer = NEXT_LAYER[sourceLayer];
  const typeMap = TARGET_TYPE_MAP[sourceLayer];
  const targetLayerInfo = targetLayer ? getLayerInfo(targetLayer) : null;

  const transitionable = useMemo(
    () =>
      sourceElements.filter(
        (el) => el.status !== "DEPRECATED" && typeMap[el.type],
      ),
    [sourceElements, typeMap],
  );

  const components = useMemo(
    () =>
      transitionable.filter((el) => !typeMap[el.type]?.endsWith("Function")),
    [transitionable, typeMap],
  );
  const functions = useMemo(
    () => transitionable.filter((el) => typeMap[el.type]?.endsWith("Function")),
    [transitionable, typeMap],
  );

  const [step, setStep] = useState(0);
  const [targetModelName, setTargetModelName] = useState(
    targetLayerInfo?.label ?? "",
  );
  const [rows, setRows] = useState<Record<string, RowState>>(() =>
    Object.fromEntries(
      transitionable.map((el) => [
        el.id,
        {
          include: true,
          targetName: el.name,
          targetType: typeMap[el.type] as ElementTypeValue,
        },
      ]),
    ),
  );

  if (!targetLayer || !targetLayerInfo) return null;

  const updateRow = (id: string, patch: Partial<RowState>) =>
    setRows((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const setManyInclude = (ids: string[], value: boolean) =>
    setRows((prev) => {
      const next = { ...prev };
      for (const id of ids) next[id] = { ...next[id], include: value };
      return next;
    });

  const includedIn = (els: Element[]) =>
    els.filter((el) => rows[el.id]?.include).length;
  const includedCount = Object.values(rows).filter((r) => r.include).length;

  const handleConfirm = () => {
    const mappings = transitionable
      .filter((el) => rows[el.id]?.include)
      .map((el) => ({
        sourceElementId: el.id,
        targetType: rows[el.id].targetType,
        targetName: rows[el.id].targetName.trim() || el.name,
        traceType: "Realization" as const,
      }));

    transition.mutate(
      {
        projectId,
        sourceModelId: sourceModel.id,
        sourceLayer,
        targetLayer,
        targetModelName: targetModelName.trim() || targetLayerInfo.label,
        mappings,
      },
      {
        onSuccess: ({ data }) => {
          toast.success(
            `Transitioned to ${targetLayerInfo.label}: ${data.createdElements} elements, ${data.createdTraceLinks} realization links`,
          );
          onCompleted();
        },
        onError: ({ message }) =>
          toast.error(message || "Error during transition"),
      },
    );
  };

  const STEPS: Array<{ label: string; icon: LucideIcon; count: number }> = [
    {
      label: "Actors & Components",
      icon: Users,
      count: includedIn(components),
    },
    { label: "Functions", icon: Boxes, count: includedIn(functions) },
    { label: "Review", icon: Sparkles, count: includedCount },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl gap-0 overflow-hidden p-0">
        {/* ─── Header with layer transition ─────────────────────────────── */}
        <DialogHeader className="space-y-3 border-b bg-muted/30 px-5 py-4">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Layers className="size-4 text-primary" />
            Layer Transition
          </DialogTitle>
          <DialogDescription className="sr-only">
            Map elements from {getLayerInfo(sourceLayer).label} to{" "}
            {targetLayerInfo.label}.
          </DialogDescription>

          <div className="flex items-center gap-3">
            <LayerChip layer={sourceLayer} />
            <div className="flex flex-1 items-center">
              <span className="h-px flex-1 bg-border" />
              <span className="rounded-full border bg-background p-1.5">
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <LayerChip layer={targetLayer} />
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-1 pt-1">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const active = i === step;
              const done = i < step;
              return (
                <div key={s.label} className="flex flex-1 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setStep(i)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors",
                      active
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-4 items-center justify-center rounded-full text-[10px]",
                        active || done
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted-foreground/20",
                      )}
                    >
                      {done ? <Check className="size-2.5" /> : i + 1}
                    </span>
                    <Icon className="size-3.5" />
                    <span className="hidden sm:inline">{s.label}</span>
                    {s.count > 0 && (
                      <span className="rounded-full bg-primary/15 px-1.5 text-[9px] font-semibold text-primary">
                        {s.count}
                      </span>
                    )}
                  </button>
                  {i < STEPS.length - 1 && (
                    <span className="h-px flex-1 bg-border" />
                  )}
                </div>
              );
            })}
          </div>
        </DialogHeader>

        {/* ─── Body ──────────────────────────────────────────────────────── */}
        <div className="px-5 py-4">
          {step === 0 && (
            <MappingStep
              icon={Users}
              title="Map actors, entities & components"
              subtitle="Each becomes a new element in the target layer, realized from the source."
              emptyHint="No actors, entities, or components to transition here."
              elements={components}
              rows={rows}
              onToggle={(id, v) => updateRow(id, { include: v })}
              onName={(id, v) => updateRow(id, { targetName: v })}
              onToggleAll={setManyInclude}
            />
          )}

          {step === 1 && (
            <MappingStep
              icon={Boxes}
              title="Map activities & functions"
              subtitle="Operational/system behaviour carried forward as functions."
              emptyHint="No activities or functions to transition here."
              elements={functions}
              rows={rows}
              onToggle={(id, v) => updateRow(id, { include: v })}
              onName={(id, v) => updateRow(id, { targetName: v })}
              onToggleAll={setManyInclude}
            />
          )}

          {step === 2 && (
            <ReviewStep
              targetLayer={targetLayer}
              targetModelName={targetModelName}
              onTargetModelName={setTargetModelName}
              includedCount={includedCount}
              components={components.filter((e) => rows[e.id]?.include)}
              functions={functions.filter((e) => rows[e.id]?.include)}
              rows={rows}
            />
          )}
        </div>

        {/* ─── Footer ────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-2 border-t bg-muted/30 px-5 py-3">
          <span className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{includedCount}</span>{" "}
            of {transitionable.length} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                step === 0 ? onOpenChange(false) : setStep(step - 1)
              }
              disabled={transition.isPending}
            >
              {step === 0 ? "Cancel" : "Back"}
            </Button>

            {step < 2 ? (
              <Button type="button" size="sm" onClick={() => setStep(step + 1)}>
                Next
                <ArrowRight className="size-3.5" />
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={handleConfirm}
                loading={transition.isPending}
                disabled={includedCount === 0}
              >
                <GitMerge className="size-3.5" />
                Create {targetLayer} Model
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LayerChip({ layer }: { layer: LayerValue }) {
  const info = getLayerInfo(layer);
  const color = LAYER_COLORS[layer];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium"
      style={{ borderColor: color, color }}
    >
      <span
        className="size-2.5 rounded-sm"
        style={{ backgroundColor: color }}
      />
      {info.label}
      <span className="opacity-60">({layer})</span>
    </span>
  );
}

function ShapeChip({
  type,
  size = 16,
}: {
  type: ElementTypeValue;
  size?: number;
}) {
  const spec = getElementVisual(type);
  const radius =
    spec.shape === "ellipse"
      ? "50%"
      : spec.shape === "rounded-rectangle"
        ? "5px"
        : "2px";
  return (
    <span
      className="shrink-0 border"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        borderColor: spec.strokeColor,
        backgroundColor: spec.fillColor,
      }}
    />
  );
}

function MappingStep({
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

                {/* source */}
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

                {/* target */}
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
              No elements match “{query}”.
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function ReviewStep({
  targetLayer,
  targetModelName,
  onTargetModelName,
  includedCount,
  components,
  functions,
  rows,
}: {
  targetLayer: LayerValue;
  targetModelName: string;
  onTargetModelName: (value: string) => void;
  includedCount: number;
  components: Element[];
  functions: Element[];
  rows: Record<string, RowState>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="target-model-name" className="text-xs">
          Target model name
        </Label>
        <Input
          id="target-model-name"
          value={targetModelName}
          onChange={(e) => onTargetModelName(e.target.value)}
          className="h-8 text-sm"
        />
        <p className="text-[10px] text-muted-foreground">
          An existing {targetLayer} model will be reused if one already exists.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard label="Elements" value={includedCount} icon={Boxes} />
        <StatCard
          label="Realization links"
          value={includedCount}
          icon={GitMerge}
        />
        <StatCard label="Target layer" value={targetLayer} icon={Layers} />
      </div>

      {/* Preview */}
      {includedCount === 0 ? (
        <p className="rounded-md border border-dashed py-6 text-center text-xs text-muted-foreground">
          Nothing selected — go back and pick at least one element.
        </p>
      ) : (
        <ScrollArea className="max-h-56">
          <div className="flex flex-col gap-3 pr-2">
            <PreviewGroup
              title="Actors & Components"
              elements={components}
              rows={rows}
            />
            <PreviewGroup title="Functions" elements={functions} rows={rows} />
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-card p-2.5">
      <Icon className="size-4 text-primary" />
      <span className="text-lg font-semibold leading-none">{value}</span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}

function PreviewGroup({
  title,
  elements,
  rows,
}: {
  title: string;
  elements: Element[];
  rows: Record<string, RowState>;
}) {
  if (elements.length === 0) return null;
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title} ({elements.length})
      </p>
      <div className="flex flex-col gap-1">
        {elements.map((el) => {
          const row = rows[el.id];
          return (
            <div
              key={el.id}
              className="flex items-center gap-2 rounded-md border bg-card px-2 py-1.5 text-xs"
            >
              <ShapeChip type={row.targetType} size={14} />
              <span className="truncate font-medium">
                {row.targetName.trim() || el.name}
              </span>
              <span className="ms-auto truncate text-[10px] text-muted-foreground">
                {getElementTypeInfo(row.targetType).label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
