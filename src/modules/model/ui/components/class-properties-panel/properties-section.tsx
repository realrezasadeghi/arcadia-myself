"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/modules/shared/ui/components/ui/button";
import { Input } from "@/modules/shared/ui/components/ui/input";
import { Label } from "@/modules/shared/ui/components/ui/label";
import { useCreateClassProperty } from "../../clients/create-class-property";
import { useRemoveClassProperty } from "../../clients/remove-class-property";
import { useUpdateClassProperty } from "../../clients/update-class-property";
import { formatMultiplicity } from "../../constants/class-diagram";
import type { ClassElementTypeValue } from "../../types/class-diagram";
import { ToggleButton, VisibilityDropdown } from "./edit-controls";
import type { PropertyData } from "./index";

function getAttributeLabel(type: ClassElementTypeValue): string {
  return type === "DATA_TYPE" || type === "UNION" ? "Fields" : "Attributes";
}

export function ClassPropertiesSection({
  properties,
  elementId,
  modelId,
  layer,
  elementType,
  onUpdate,
}: {
  properties: PropertyData[];
  elementId: string;
  modelId: string;
  layer: string;
  elementType: ClassElementTypeValue;
  onUpdate: () => void;
}) {
  const sectionLabel = getAttributeLabel(elementType);
  const [isAdding, setIsAdding] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const createProperty = useCreateClassProperty();
  const removeProperty = useRemoveClassProperty();
  const updateProperty = useUpdateClassProperty();

  useEffect(() => {
    if (isAdding) {
      setTimeout(() => nameInputRef.current?.focus(), 50);
    }
  }, [isAdding]);

  const handleAdd = useCallback(() => {
    if (!newName.trim()) return;
    createProperty.mutate(
      {
        classElementId: elementId,
        modelId,
        layer,
        name: newName.trim(),
        typeLiteral: newType.trim() || "String",
      },
      {
        onSuccess: () => {
          setNewName("");
          setNewType("");
          setIsAdding(false);
          onUpdate();
          toast.success(`${sectionLabel.slice(0, -1)} added`);
        },
        onError: ({ message }) =>
          toast.error(
            message ||
              `Error adding ${sectionLabel.toLowerCase().slice(0, -1)}`,
          ),
      },
    );
  }, [newName, newType, elementId, modelId, layer, createProperty, onUpdate]);

  const handleRemove = useCallback(
    (id: string) => {
      removeProperty.mutate(
        { id },
        {
          onSuccess: () => {
            if (expandedId === id) setExpandedId(null);
            onUpdate();
            toast.success(`${sectionLabel.slice(0, -1)} removed`);
          },
          onError: ({ message }) =>
            toast.error(
              message ||
                `Error removing ${sectionLabel.toLowerCase().slice(0, -1)}`,
            ),
        },
      );
    },
    [removeProperty, onUpdate, expandedId],
  );

  const handleCancel = useCallback(() => {
    setIsAdding(false);
    setNewName("");
    setNewType("");
  }, []);

  const updateField = useCallback(
    (id: string, field: string, value: unknown) => {
      updateProperty.mutate(
        { id, [field]: value } as Parameters<typeof updateProperty.mutate>[0],
        {
          onSuccess: onUpdate,
          onError: ({ message }) =>
            toast.error(message || "Error updating attribute"),
        },
      );
    },
    [updateProperty, onUpdate],
  );

  return (
    <div className="flex flex-col gap-2">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <p className="text-[11px] font-semibold text-foreground/80 tracking-wide uppercase">
            {sectionLabel}
          </p>
          {properties.length > 0 && (
            <span className="text-[9px] font-medium text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-full">
              {properties.length}
            </span>
          )}
        </div>
        {!isAdding && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-[10px] px-2 gap-1 text-muted-foreground hover:text-foreground"
            onClick={() => setIsAdding(true)}
          >
            <span className="text-xs leading-none">+</span> Add
          </Button>
        )}
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3 flex flex-col gap-2.5 animate-in fade-in-0 slide-in-from-top-1 duration-200">
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <Label className="text-[10px] font-medium text-muted-foreground">
                Name
              </Label>
              <Input
                ref={nameInputRef}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="attributeName"
                className="h-7 text-xs"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newName.trim()) handleAdd();
                  if (e.key === "Escape") handleCancel();
                }}
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <Label className="text-[10px] font-medium text-muted-foreground">
                Type
              </Label>
              <Input
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                placeholder="String"
                className="h-7 text-xs"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newName.trim()) handleAdd();
                  if (e.key === "Escape") handleCancel();
                }}
              />
            </div>
          </div>
          <div className="flex justify-end gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[10px] px-2"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-6 text-[10px] px-3"
              onClick={handleAdd}
              disabled={!newName.trim() || createProperty.isPending}
            >
              {createProperty.isPending ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Properties List */}
      <div className="flex flex-col">
        {properties.length === 0 && !isAdding && (
          <p className="text-[10px] text-muted-foreground/60 italic text-center py-2">
            No {sectionLabel.toLowerCase()} yet
          </p>
        )}
        {properties.map((prop) => {
          const isExpanded = expandedId === prop.id;
          const mult = formatMultiplicity(
            prop.multiplicityLower,
            prop.multiplicityUpper,
          );
          return (
            <div key={prop.id} className="group">
              {/* Property Row */}
              <div
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-mono cursor-pointer transition-colors ${
                  isExpanded ? "bg-accent/40" : "hover:bg-accent/30"
                }`}
                onClick={() =>
                  setExpandedId((prev) => (prev === prop.id ? null : prop.id))
                }
              >
                <VisibilityDropdown
                  value={prop.visibility}
                  onChange={(v) => updateField(prop.id, "visibility", v)}
                />
                {prop.isDerived && (
                  <span className="text-muted-foreground/50 text-[10px]">
                    /
                  </span>
                )}
                {prop.isStatic && (
                  <span className="text-muted-foreground/50 text-[10px] underline">
                    _
                  </span>
                )}
                <span className="flex-1 truncate text-foreground/80">
                  {prop.name}
                </span>
                {prop.typeLiteral && (
                  <span className="text-muted-foreground/60 text-[10px]">
                    : {prop.typeLiteral}
                  </span>
                )}
                {mult && (
                  <span className="text-muted-foreground/50 text-[9px]">
                    {mult}
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(prop.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 ml-0.5 p-0.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                  title="Remove attribute"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="ml-5 mr-2 mb-2 mt-1 flex flex-col gap-2 rounded-lg border border-border/40 bg-muted/15 p-2.5 animate-in fade-in-0 slide-in-from-top-0.5 duration-150">
                  <div className="flex flex-wrap gap-1">
                    <ToggleButton
                      label="static"
                      active={prop.isStatic}
                      onClick={() =>
                        updateField(prop.id, "isStatic", !prop.isStatic)
                      }
                    />
                    <ToggleButton
                      label="derived"
                      active={prop.isDerived}
                      onClick={() =>
                        updateField(prop.id, "isDerived", !prop.isDerived)
                      }
                    />
                    <ToggleButton
                      label="readonly"
                      active={prop.isReadOnly}
                      onClick={() =>
                        updateField(prop.id, "isReadOnly", !prop.isReadOnly)
                      }
                    />
                    {prop.isID && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                        id
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 items-end">
                    <div className="flex flex-col gap-0.5 flex-1">
                      <Label className="text-[9px] font-medium text-muted-foreground">
                        Multiplicity
                      </Label>
                      <div className="flex gap-1 items-center">
                        <Input
                          value={prop.multiplicityLower ?? 1}
                          onChange={(e) =>
                            updateField(
                              prop.id,
                              "multiplicityLower",
                              Number(e.target.value) || 0,
                            )
                          }
                          className="h-6 text-[10px] w-8 text-center font-mono"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="text-[10px] text-muted-foreground/50">
                          ..
                        </span>
                        <Input
                          value={prop.multiplicityUpper ?? "1"}
                          onChange={(e) =>
                            updateField(
                              prop.id,
                              "multiplicityUpper",
                              e.target.value,
                            )
                          }
                          className="h-6 text-[10px] w-10 text-center font-mono"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-0.5 flex-1">
                      <Label className="text-[9px] font-medium text-muted-foreground">
                        Default
                      </Label>
                      <Input
                        value={prop.defaultValue ?? ""}
                        onChange={(e) =>
                          updateField(prop.id, "defaultValue", e.target.value)
                        }
                        placeholder="—"
                        className="h-6 text-[10px]"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
