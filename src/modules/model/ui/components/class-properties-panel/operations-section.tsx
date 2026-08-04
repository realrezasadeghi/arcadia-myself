"use client";

import { Button } from "@/modules/shared/ui/components/ui/button";
import { Input } from "@/modules/shared/ui/components/ui/input";
import { Label } from "@/modules/shared/ui/components/ui/label";
import { ChevronRight, Loader2, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useCreateClassOperation } from "../../clients/create-class-operation";
import { useCreateClassOperationParameter } from "../../clients/create-class-operation-parameter";
import { useRemoveClassOperation } from "../../clients/remove-class-operation";
import { useRemoveClassOperationParameter } from "../../clients/remove-class-operation-parameter";
import { useUpdateClassOperation } from "../../clients/update-class-operation";
import { useUpdateClassOperationParameter } from "../../clients/update-class-operation-parameter";
import type { ClassElementTypeValue } from "../../types/class-diagram";
import type { OperationData } from "./index";
import {
  DirectionDropdown,
  ToggleButton,
  VisibilityDropdown,
} from "./edit-controls";

type ParameterData = NonNullable<OperationData["parameters"]>[number];

function getOperationLabel(type: ClassElementTypeValue): string {
  return type === "INTERFACE" ? "Interface Operations" : "Operations";
}

export function ClassOperationsSection({
  operations,
  elementId,
  modelId,
  layer,
  elementType,
  onUpdate,
}: {
  operations: OperationData[];
  elementId: string;
  modelId: string;
  layer: string;
  elementType: ClassElementTypeValue;
  onUpdate: () => void;
}) {
  const sectionLabel = getOperationLabel(elementType);
  const [isAdding, setIsAdding] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newReturnType, setNewReturnType] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const createOperation = useCreateClassOperation();
  const removeOperation = useRemoveClassOperation();
  const updateOperation = useUpdateClassOperation();
  const createParameter = useCreateClassOperationParameter();
  const updateParameter = useUpdateClassOperationParameter();
  const removeParameter = useRemoveClassOperationParameter();

  useEffect(() => {
    if (isAdding) {
      setTimeout(() => nameInputRef.current?.focus(), 50);
    }
  }, [isAdding]);

  const handleAdd = useCallback(() => {
    if (!newName.trim()) return;
    createOperation.mutate(
      {
        classElementId: elementId,
        modelId,
        layer,
        name: newName.trim(),
        returnTypeLiteral: newReturnType.trim() || "void",
      },
      {
        onSuccess: () => {
          setNewName("");
          setNewReturnType("");
          setIsAdding(false);
          onUpdate();
          toast.success(`${sectionLabel.slice(0, -1)} added`);
        },
        onError: ({ message }) =>
          toast.error(message || `Error adding ${sectionLabel.toLowerCase().slice(0, -1)}`),
      },
    );
  }, [
    newName,
    newReturnType,
    elementId,
    modelId,
    layer,
    createOperation,
    onUpdate,
  ]);

  const handleRemove = useCallback(
    (id: string) => {
      removeOperation.mutate(
        { id },
        {
          onSuccess: () => {
            if (expandedId === id) setExpandedId(null);
            onUpdate();
            toast.success(`${sectionLabel.slice(0, -1)} removed`);
          },
          onError: ({ message }) =>
            toast.error(message || `Error removing ${sectionLabel.toLowerCase().slice(0, -1)}`),
        },
      );
    },
    [removeOperation, onUpdate, expandedId],
  );

  const handleCancel = useCallback(() => {
    setIsAdding(false);
    setNewName("");
    setNewReturnType("");
  }, []);

  const updateField = useCallback(
    (id: string, field: string, value: unknown) => {
      updateOperation.mutate(
        { id, [field]: value } as Parameters<typeof updateOperation.mutate>[0],
        {
          onSuccess: onUpdate,
          onError: ({ message }) =>
            toast.error(message || "Error updating operation"),
        },
      );
    },
    [updateOperation, onUpdate],
  );

  const handleAddParameter = useCallback(
    (operationId: string) => {
      createParameter.mutate(
        {
          classOperationId: operationId,
          modelId,
          layer,
          name: "newParam",
          typeLiteral: "String",
        },
        {
          onSuccess: () => {
            onUpdate();
            toast.success("Parameter added");
          },
          onError: ({ message }) =>
            toast.error(message || "Error adding parameter"),
        },
      );
    },
    [createParameter, modelId, layer, onUpdate],
  );

  const handleRemoveParameter = useCallback(
    (paramId: string) => {
      removeParameter.mutate(paramId, {
        onSuccess: () => {
          onUpdate();
          toast.success("Parameter removed");
        },
        onError: ({ message }) =>
          toast.error(message || "Error removing parameter"),
      });
    },
    [removeParameter, onUpdate],
  );

  const updateParameterField = useCallback(
    (paramId: string, field: string, value: unknown) => {
      updateParameter.mutate(
        { id: paramId, [field]: value } as Parameters<
          typeof updateParameter.mutate
        >[0],
        {
          onSuccess: onUpdate,
          onError: ({ message }) =>
            toast.error(message || "Error updating parameter"),
        },
      );
    },
    [updateParameter, onUpdate],
  );

  return (
    <div className="flex flex-col gap-2">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <p className="text-[11px] font-semibold text-foreground/80 tracking-wide uppercase">
            {sectionLabel}
          </p>
          {operations.length > 0 && (
            <span className="text-[9px] font-medium text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-full">
              {operations.length}
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
                placeholder="methodName"
                className="h-7 text-xs"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newName.trim()) handleAdd();
                  if (e.key === "Escape") handleCancel();
                }}
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <Label className="text-[10px] font-medium text-muted-foreground">
                Return Type
              </Label>
              <Input
                value={newReturnType}
                onChange={(e) => setNewReturnType(e.target.value)}
                placeholder="void"
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
              disabled={!newName.trim() || createOperation.isPending}
            >
              {createOperation.isPending ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Operations List */}
      <div className="flex flex-col">
        {operations.length === 0 && !isAdding && (
          <p className="text-[10px] text-muted-foreground/60 italic text-center py-2">
            No {sectionLabel.toLowerCase()} yet
          </p>
        )}
        {operations.map((op) => {
          const isExpanded = expandedId === op.id;
          const paramCount = op.parameters?.length ?? 0;
          const ret = op.returnTypeLiteral ? `: ${op.returnTypeLiteral}` : "";
          return (
            <div key={op.id} className="group">
              {/* Operation Row */}
              <div
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-mono cursor-pointer transition-colors ${
                  isExpanded ? "bg-accent/40" : "hover:bg-accent/30"
                }`}
                onClick={() =>
                  setExpandedId((prev) => (prev === op.id ? null : op.id))
                }
              >
                <VisibilityDropdown
                  value={op.visibility}
                  onChange={(v) => updateField(op.id, "visibility", v)}
                />
                {op.isAbstract && (
                  <span className="text-muted-foreground/50 text-[10px] italic">
                    a
                  </span>
                )}
                {op.isStatic && (
                  <span className="text-muted-foreground/50 text-[10px] underline">
                    _
                  </span>
                )}
                <ChevronRight
                  className={`size-3 text-muted-foreground/40 transition-transform duration-150 ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                />
                <span className="flex-1 truncate text-foreground/80">
                  {op.name}
                </span>
                <span className="text-muted-foreground/50 text-[10px]">
                  ({paramCount})
                </span>
                {ret && (
                  <span className="text-muted-foreground/60 text-[10px]">
                    {ret}
                  </span>
                )}
                {op.isQuery && (
                  <span
                    className="text-[9px] text-muted-foreground/40 ml-0.5"
                    title="Query"
                  >
                    q
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(op.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 ml-0.5 p-0.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                  title="Remove operation"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>

              {/* Expanded: Flags + Parameters */}
              {isExpanded && (
                <div className="ml-5 mr-2 mb-2 mt-1 flex flex-col gap-2 rounded-lg border border-border/40 bg-muted/15 p-2.5 animate-in fade-in-0 slide-in-from-top-0.5 duration-150">
                  {/* Flags */}
                  <div className="flex flex-wrap gap-1">
                    <ToggleButton
                      label="abstract"
                      active={op.isAbstract}
                      onClick={() =>
                        updateField(op.id, "isAbstract", !op.isAbstract)
                      }
                    />
                    <ToggleButton
                      label="static"
                      active={op.isStatic}
                      onClick={() =>
                        updateField(op.id, "isStatic", !op.isStatic)
                      }
                    />
                    <ToggleButton
                      label="query"
                      active={op.isQuery}
                      onClick={() => updateField(op.id, "isQuery", !op.isQuery)}
                    />
                  </div>

                  {/* Parameters */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                          Parameters
                        </Label>
                        {paramCount > 0 && (
                          <span className="text-[9px] font-medium text-muted-foreground/60 bg-muted/50 px-1.5 py-0.5 rounded-full">
                            {paramCount}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[10px] px-2 gap-1 text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddParameter(op.id);
                        }}
                      >
                        <Plus className="size-3" /> Add Parameter
                      </Button>
                    </div>

                    {/* Parameter Header Labels */}
                    {paramCount > 0 && (
                      <div className="flex items-center gap-2 px-2 text-[9px] font-medium text-muted-foreground/50 uppercase tracking-wider">
                        <span className="w-[52px]">Dir</span>
                        <span className="flex-1">Name</span>
                        <span className="w-[80px]">Type</span>
                        <span className="w-5" />
                      </div>
                    )}

                    {paramCount > 0 ? (
                      <div className="flex flex-col gap-1">
                        {op.parameters?.map((param) => (
                          <ParameterRow
                            key={param.id}
                            param={param}
                            onUpdate={(field, value) =>
                              updateParameterField(param.id, field, value)
                            }
                            onRemove={() => handleRemoveParameter(param.id)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-3 text-center">
                        <p className="text-[10px] text-muted-foreground/50">
                          No parameters defined
                        </p>
                        <p className="text-[9px] text-muted-foreground/30 mt-0.5">
                          Click "Add Parameter" to add input/output parameters
                        </p>
                      </div>
                    )}
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

function ParameterRow({
  param,
  onUpdate,
  onRemove,
}: {
  param: ParameterData;
  onUpdate: (field: string, value: unknown) => void;
  onRemove: () => void;
}) {
  const [editingName, setEditingName] = useState(param.name);
  const [editingType, setEditingType] = useState(param.typeLiteral || "");
  const [isEditing, setIsEditing] = useState(false);
  const [showTypeSuggestions, setShowTypeSuggestions] = useState(false);

  const commonTypes = [
    "String",
    "int",
    "boolean",
    "void",
    "double",
    "float",
    "long",
    "char",
    "byte",
    "short",
    "Object",
    "List",
    "Map",
    "Set",
  ];

  const filteredTypes = commonTypes.filter(
    (t) =>
      t.toLowerCase().includes(editingType.toLowerCase()) && editingType !== t,
  );

  return (
    <div
      className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] font-mono group transition-all duration-150 ${
        isEditing ? "bg-accent/40 ring-1 ring-primary/20" : "hover:bg-accent/25"
      }`}
    >
      {/* Direction Badge */}
      <DirectionDropdown
        value={param.direction ?? "IN"}
        onChange={(v) => onUpdate("direction", v)}
      />

      {/* Name */}
      <div className="flex-1 min-w-0">
        <Input
          value={editingName}
          onChange={(e) => setEditingName(e.target.value)}
          onFocus={() => setIsEditing(true)}
          onBlur={() => {
            setIsEditing(false);
            if (editingName.trim() && editingName !== param.name) {
              onUpdate("name", editingName.trim());
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && editingName.trim()) {
              onUpdate("name", editingName.trim());
              setIsEditing(false);
            }
            if (e.key === "Escape") {
              setEditingName(param.name);
              setIsEditing(false);
            }
          }}
          className="h-6 text-[11px] px-1.5 border-transparent focus:border-border/60 bg-transparent font-medium text-foreground/90"
        />
      </div>

      {/* Colon Separator */}
      <span className="text-muted-foreground/30 text-xs select-none">:</span>

      {/* Type with Suggestions */}
      <div className="relative">
        <Input
          value={editingType}
          onChange={(e) => {
            setEditingType(e.target.value);
            setShowTypeSuggestions(true);
          }}
          onFocus={() => {
            setIsEditing(true);
            setShowTypeSuggestions(true);
          }}
          onBlur={() => {
            setTimeout(() => {
              setIsEditing(false);
              setShowTypeSuggestions(false);
              if (editingType !== (param.typeLiteral || "")) {
                onUpdate("typeLiteral", editingType);
              }
            }, 150);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onUpdate("typeLiteral", editingType);
              setIsEditing(false);
              setShowTypeSuggestions(false);
            }
            if (e.key === "Escape") {
              setEditingType(param.typeLiteral || "");
              setIsEditing(false);
              setShowTypeSuggestions(false);
            }
          }}
          placeholder="String"
          className="h-6 text-[11px] w-[80px] px-1.5 border-transparent focus:border-border/60 bg-transparent text-primary/80 font-medium"
        />

        {/* Type Suggestions Dropdown */}
        {showTypeSuggestions && filteredTypes.length > 0 && (
          <div className="absolute z-50 top-full left-0 mt-1 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[100px] animate-in fade-in-0 zoom-in-95 duration-100">
            {filteredTypes.slice(0, 5).map((type) => (
              <button
                key={type}
                type="button"
                className="w-full text-left px-2.5 py-1 text-[11px] font-mono hover:bg-accent/60 text-muted-foreground hover:text-foreground transition-colors"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setEditingType(type);
                  onUpdate("typeLiteral", type);
                  setShowTypeSuggestions(false);
                }}
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Remove - Always Visible */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="p-1 rounded-md text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all duration-150"
        title="Remove parameter"
      >
        <Trash2 className="size-3" />
      </button>
    </div>
  );
}
