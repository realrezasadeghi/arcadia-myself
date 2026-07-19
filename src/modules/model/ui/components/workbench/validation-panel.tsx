"use client";

import { ScrollArea } from "@/modules/shared/ui/components/ui/scroll-area";
import { cn } from "@/modules/shared/ui/libs/cn";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  MousePointerClick,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import type { ValidationSeverity } from "../../../domain/policies/validation";
import { useValidateModel } from "../../clients/validate-model";
import { getElementTypeInfo } from "../../helpers/element";
import { getLayerInfo } from "../../helpers/layer";
import { useWorkbenchStore } from "../../stores/workbench";
import type { LayerValue } from "../../types/layer";

const LAYER_COLORS: Record<LayerValue, string> = {
  OA: "#2E86C1",
  SA: "#CA6F1E",
  LA: "#1E8449",
  PA: "#6C3483",
  EPBS: "#E74C3C",
};

const SEVERITY_CONFIG: Record<
  ValidationSeverity,
  { icon: typeof AlertCircle; color: string; bg: string }
> = {
  error: {
    icon: AlertCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  info: {
    icon: Info,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
};

export function ValidationPanel() {
  const projectId = useWorkbenchStore((s) => s.projectId);
  const selectElement = useWorkbenchStore((s) => s.selectElement);

  const { data, isLoading, refetch, isRefetching } = useValidateModel(
    projectId ?? "",
  );

  const issues = data?.issues ?? [];
  const summary = data?.summary;

  return (
    <aside className="flex h-full min-h-0 flex-col border-l bg-card">
      <div className="flex h-8 shrink-0 items-center gap-1.5 border-b bg-muted/30 px-3">
        <ShieldCheck className="size-3.5 text-muted-foreground" />
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Validation
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isRefetching}
          className="ms-auto rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
          title="Re-run validation"
        >
          <RefreshCw className={cn("size-3", isRefetching && "animate-spin")} />
        </button>
      </div>

      {!projectId ? (
        <EmptyState />
      ) : isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <RefreshCw className="size-4 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Summary bar */}
          {summary && (
            <div className="flex items-center gap-2 border-b px-3 py-2">
              <SummaryBadge
                count={summary.errors}
                severity="error"
                label="errors"
              />
              <SummaryBadge
                count={summary.warnings}
                severity="warning"
                label="warnings"
              />
              <SummaryBadge
                count={summary.infos}
                severity="info"
                label="info"
              />
            </div>
          )}

          {/* Issues list */}
          <ScrollArea className="min-h-0 flex-1">
            <div className="flex flex-col gap-1 p-2">
              {issues.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <CheckCircle2 className="size-6 text-emerald-500" />
                  <p className="text-xs font-medium text-emerald-600">
                    No issues found
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Model passes all validation rules
                  </p>
                </div>
              ) : (
                issues.map((issue) => {
                  const config = SEVERITY_CONFIG[issue.severity];
                  const Icon = config.icon;
                  const typeInfo = issue.elementType
                    ? getElementTypeInfo(issue.elementType)
                    : null;
                  const layerInfo = issue.layer
                    ? getLayerInfo(issue.layer)
                    : null;
                  return (
                    <button
                      key={issue.id}
                      type="button"
                      onClick={() => {
                        if (issue.elementId) selectElement(issue.elementId);
                      }}
                      className={cn(
                        "flex items-start gap-2 rounded-md border border-border px-2 py-1.5 text-left transition-colors hover:bg-muted",
                        issue.elementId && "cursor-pointer",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                          config.bg,
                        )}
                      >
                        <Icon className={cn("size-2.5", config.color)} />
                      </span>
                      <div className="min-w-0 flex-1">
                        {/* Element name + type badge */}
                        {issue.elementName ? (
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-medium leading-tight truncate">
                              {issue.elementName}
                            </p>
                            {typeInfo && (
                              <span className="shrink-0 text-[9px] rounded bg-muted px-1 py-0.5 text-muted-foreground">
                                {typeInfo.label}
                              </span>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs font-medium leading-tight">
                            Model
                          </p>
                        )}
                        {/* Message */}
                        <p className="text-[11px] text-muted-foreground leading-tight">
                          {issue.message}
                        </p>
                        {/* Rule + Layer tag */}
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <span className="text-[9px] text-muted-foreground/60">
                            {issue.rule}
                          </span>
                          {layerInfo && (
                            <span
                              className="shrink-0 text-[9px] rounded px-1 py-0.5 font-medium"
                              style={{
                                color: LAYER_COLORS[issue.layer!],
                                backgroundColor: `${LAYER_COLORS[issue.layer!]}15`,
                              }}
                            >
                              {issue.layer}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </>
      )}
    </aside>
  );
}

function SummaryBadge({
  count,
  severity,
  label,
}: {
  count: number;
  severity: ValidationSeverity;
  label: string;
}) {
  const config = SEVERITY_CONFIG[severity];
  const Icon = config.icon;
  return (
    <div className="flex items-center gap-1">
      <Icon className={cn("size-3", config.color)} />
      <span className="text-xs font-medium">{count}</span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-4 text-center text-muted-foreground">
      <MousePointerClick className="size-7 opacity-30" />
      <p className="text-xs">Open a model to run validation</p>
    </div>
  );
}
