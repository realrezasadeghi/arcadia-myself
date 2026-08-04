"use client";

import { Input } from "@/modules/shared/ui/components/ui/input";
import { Label } from "@/modules/shared/ui/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/shared/ui/components/ui/select";
import { Separator } from "@/modules/shared/ui/components/ui/separator";
import { Textarea } from "@/modules/shared/ui/components/ui/textarea";
import { ArrowRight, Check, GitBranch, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useUpdateClassRelationship } from "../../clients/update-class-relationship";
import { getClassRelationshipTypeInfo } from "../../constants/class-diagram";
import type { CanvasEdge, ClassEdgeData } from "../../stores/canvas";
import { useCanvasStore } from "../../stores/canvas";

function MultiplicityField({
  label,
  description,
  lower,
  upper,
  onLowerChange,
  onUpperChange,
  onBlur,
}: {
  label: string;
  description: string;
  lower: string;
  upper: string;
  onLowerChange: (v: string) => void;
  onUpperChange: (v: string) => void;
  onBlur: () => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline gap-2">
        <span className="text-xs font-medium text-foreground/80">{label}</span>
        <span className="text-[10px] text-muted-foreground">{description}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-muted-foreground mb-0.5">min</span>
          <Input
            value={lower}
            onChange={(e) => onLowerChange(e.target.value)}
            onBlur={onBlur}
            className="h-8 w-14 text-xs tabular-nums text-center"
            placeholder="1"
          />
        </div>
        <span className="text-muted-foreground text-sm mt-4">..</span>
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-muted-foreground mb-0.5">max</span>
          <Input
            value={upper}
            onChange={(e) => onUpperChange(e.target.value)}
            onBlur={onBlur}
            className="h-8 w-14 text-xs tabular-nums text-center"
            placeholder="*"
          />
        </div>
      </div>
    </div>
  );
}

export function ClassEdgeProperties({ edge }: { edge: CanvasEdge }) {
  const data = edge.data as ClassEdgeData;
  const [name, setName] = useState(data.name ?? "");
  const [description, setDescription] = useState(data.description ?? "");
  const [aggregationKind, setAggregationKind] = useState(
    data.aggregationKind ?? "NONE",
  );
  const [sourceMultLower, setSourceMultLower] = useState(
    String(data.sourceMultiplicityLower ?? 1),
  );
  const [sourceMultUpper, setSourceMultUpper] = useState(
    data.sourceMultiplicityUpper ?? "1",
  );
  const [targetMultLower, setTargetMultLower] = useState(
    String(data.targetMultiplicityLower ?? 1),
  );
  const [targetMultUpper, setTargetMultUpper] = useState(
    data.targetMultiplicityUpper ?? "1",
  );
  const [sourceRole, setSourceRole] = useState(data.sourceRole ?? "");
  const [targetRole, setTargetRole] = useState(data.targetRole ?? "");
  const [isDerived, setIsDerived] = useState(data.isDerived ?? false);

  const selectNode = useCanvasStore((s) => s.selectNode);
  const updateEdgeData = useCanvasStore((s) => s.updateEdgeData);
  const updateClassRelationship = useUpdateClassRelationship();

  const sourceNode = useCanvasStore((s) =>
    s.nodes.find((n) => n.id === edge.source),
  );
  const targetNode = useCanvasStore((s) =>
    s.nodes.find((n) => n.id === edge.target),
  );

  useEffect(() => {
    setName(data.name ?? "");
    setDescription(data.description ?? "");
    setAggregationKind(data.aggregationKind ?? "NONE");
    setSourceMultLower(String(data.sourceMultiplicityLower ?? 1));
    setSourceMultUpper(data.sourceMultiplicityUpper ?? "1");
    setTargetMultLower(String(data.targetMultiplicityLower ?? 1));
    setTargetMultUpper(data.targetMultiplicityUpper ?? "1");
    setSourceRole(data.sourceRole ?? "");
    setTargetRole(data.targetRole ?? "");
    setIsDerived(data.isDerived ?? false);
  }, [data]);

  const relTypeInfo = getClassRelationshipTypeInfo(data.relationshipType);
  const isAssociation = data.relationshipType === "ASSOCIATION";

  const handleSave = useCallback(() => {
    const payload: any = {
      modelId: data.modelId,
      id: edge.id,
      name: name?.trim() || undefined,
      isDerived,
    };
    if (isAssociation) {
      payload.aggregationKind = aggregationKind;
      payload.sourceMultiplicityLower = Number(sourceMultLower) || 1;
      payload.sourceMultiplicityUpper = sourceMultUpper || "1";
      payload.targetMultiplicityLower = Number(targetMultLower) || 1;
      payload.targetMultiplicityUpper = targetMultUpper || "1";
      payload.sourceRole = sourceRole;
      payload.targetRole = targetRole;
    }
    updateClassRelationship.mutate(payload, {
      onSuccess: () => {
        updateEdgeData(edge.id, {
          name,
          description,
          aggregationKind,
          sourceMultiplicityLower: Number(sourceMultLower) || 1,
          sourceMultiplicityUpper: sourceMultUpper,
          targetMultiplicityLower: Number(targetMultLower) || 1,
          targetMultiplicityUpper: targetMultUpper,
          sourceRole,
          targetRole,
          isDerived,
        } as any);
      },
      onError: ({ message }) => {
        toast.error(message || "Error saving relationship");
      },
    });
  }, [
    edge,
    name,
    description,
    data,
    aggregationKind,
    sourceMultLower,
    sourceMultUpper,
    targetMultLower,
    targetMultUpper,
    sourceRole,
    targetRole,
    isDerived,
    isAssociation,
    updateClassRelationship,
    updateEdgeData,
  ]);

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Relationship Flow - Clear Visual */}
      <div className="rounded-xl border border-border/50 bg-linear-to-b from-muted/30 to-transparent p-4">
        <div className="flex flex-col items-center gap-3">
          {/* Source */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide w-12">
              From
            </span>
            {sourceNode ? (
              <button
                type="button"
                onClick={() => selectNode(sourceNode.id)}
                className="flex-1 flex items-center gap-2 rounded-lg border border-border/50 bg-background px-3 py-2 text-sm font-medium transition-all hover:border-border hover:bg-accent/50 hover:shadow-sm"
              >
                <span className="truncate">{sourceNode.data.name}</span>
              </button>
            ) : (
              <span className="flex-1 text-sm text-muted-foreground italic">
                No source
              </span>
            )}
          </div>

          {/* Arrow + Type */}
          <div className="flex flex-col items-center gap-1">
            <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
            <div
              className="flex items-center gap-2 rounded-full border px-3 py-1"
              style={{
                borderColor: `${relTypeInfo.strokeColor}40`,
                backgroundColor: `${relTypeInfo.strokeColor}08`,
                color: relTypeInfo.strokeColor,
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: relTypeInfo.strokeColor }}
              />
              <span className="text-xs font-medium">{relTypeInfo.label}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground -rotate-90" />
          </div>

          {/* Target */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide w-12">
              To
            </span>
            {targetNode ? (
              <button
                type="button"
                onClick={() => selectNode(targetNode.id)}
                className="flex-1 flex items-center gap-2 rounded-lg border border-border/50 bg-background px-3 py-2 text-sm font-medium transition-all hover:border-border hover:bg-accent/50 hover:shadow-sm"
              >
                <span className="truncate">{targetNode.data.name}</span>
              </button>
            ) : (
              <span className="flex-1 text-sm text-muted-foreground italic">
                No target
              </span>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* General Properties - Clear Labels */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium" htmlFor="class-edge-name">
            Name
          </Label>
          <Input
            id="class-edge-name"
            value={name}
            onBlur={handleSave}
            className="h-9 text-sm"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            placeholder="e.g., manages, contains, uses"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium" htmlFor="class-edge-desc">
            Description
          </Label>
          <Textarea
            rows={2}
            id="class-edge-desc"
            value={description}
            onBlur={handleSave}
            className="text-sm resize-none"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this relationship represent?"
          />
        </div>

        {/* Derived Toggle - Clear with Icon */}
        <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Derived relationship</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isDerived}
            onClick={() => {
              setIsDerived(!isDerived);
              setTimeout(handleSave, 0);
            }}
            className={`
              relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
              ${isDerived ? "bg-primary" : "bg-border"}
            `}
          >
            <span
              className={`
                pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200
                ${isDerived ? "translate-x-5.5" : "translate-x-0.5"}
              `}
            />
          </button>
        </div>
      </div>

      {/* Association-specific - Grouped Clearly */}
      {isAssociation && (
        <>
          <Separator />

          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: relTypeInfo.strokeColor }}
              />
              <h4 className="text-sm font-semibold">Association Properties</h4>
            </div>

            {/* Aggregation */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Aggregation type</Label>
              <p className="text-xs text-muted-foreground mb-1">
                How the source relates to the target
              </p>
              <Select
                value={aggregationKind}
                onValueChange={(v) => {
                  setAggregationKind(v as typeof aggregationKind);
                  setTimeout(handleSave, 0);
                }}
              >
                <SelectTrigger className="h-9 text-sm w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">
                    None (plain relationship)
                  </SelectItem>
                  <SelectItem value="SHARED">
                    Shared (hollow diamond)
                  </SelectItem>
                  <SelectItem value="COMPOSITE">
                    Composite (filled diamond)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Multiplicities */}
            <div className="flex flex-col gap-3">
              <Label className="text-sm font-medium">Cardinality</Label>
              <p className="text-xs text-muted-foreground -mt-1">
                How many instances can participate
              </p>
              <div className="grid grid-cols-2 gap-4">
                <MultiplicityField
                  label="Source"
                  description="from this side"
                  lower={sourceMultLower}
                  upper={sourceMultUpper}
                  onLowerChange={setSourceMultLower}
                  onUpperChange={setSourceMultUpper}
                  onBlur={handleSave}
                />
                <MultiplicityField
                  label="Target"
                  description="from that side"
                  lower={targetMultLower}
                  upper={targetMultUpper}
                  onLowerChange={setTargetMultLower}
                  onUpperChange={setTargetMultUpper}
                  onBlur={handleSave}
                />
              </div>
            </div>

            {/* Role Names */}
            <div className="flex flex-col gap-3">
              <Label className="text-sm font-medium">Role names</Label>
              <p className="text-xs text-muted-foreground -mt-1">
                What each side plays in this relationship
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted-foreground">
                    Source plays
                  </span>
                  <Input
                    value={sourceRole}
                    onChange={(e) => setSourceRole(e.target.value)}
                    onBlur={handleSave}
                    className="h-9 text-sm"
                    placeholder="e.g., owner"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted-foreground">
                    Target plays
                  </span>
                  <Input
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    onBlur={handleSave}
                    className="h-9 text-sm"
                    placeholder="e.g., member"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Save Status - Subtle */}
      {updateClassRelationship.isPending && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
          <Loader2 className="size-3.5 animate-spin" />
          <span>Saving changes...</span>
        </div>
      )}

      {updateClassRelationship.isSuccess && (
        <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg px-3 py-2">
          <Check className="size-3.5" />
          <span>Changes saved</span>
        </div>
      )}
    </div>
  );
}
