"use client";

import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/modules/shared/ui/components/ui/button";
import { Input } from "@/modules/shared/ui/components/ui/input";
import { Label } from "@/modules/shared/ui/components/ui/label";
import { useCreateClassEnumerationLiteral } from "../../clients/create-class-enumeration-literal";
import { useRemoveClassEnumerationLiteral } from "../../clients/remove-class-enumeration-literal";
import { useUpdateClassEnumerationLiteral } from "../../clients/update-class-enumeration-literal";
import type { LiteralData } from "./index";

export function ClassEnumerationSection({
  literals,
  elementId,
  modelId,
  layer,
  onUpdate,
}: {
  literals: LiteralData[];
  elementId: string;
  modelId: string;
  layer: string;
  onUpdate: () => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const createLiteral = useCreateClassEnumerationLiteral();
  const removeLiteral = useRemoveClassEnumerationLiteral();
  const updateLiteral = useUpdateClassEnumerationLiteral();

  useEffect(() => {
    if (isAdding) {
      setTimeout(() => nameInputRef.current?.focus(), 50);
    }
  }, [isAdding]);

  useEffect(() => {
    if (editingId) {
      setTimeout(() => editInputRef.current?.focus(), 50);
    }
  }, [editingId]);

  const handleAdd = useCallback(() => {
    if (!newName.trim()) return;
    createLiteral.mutate(
      {
        classElementId: elementId,
        modelId,
        layer,
        name: newName.trim(),
      },
      {
        onSuccess: () => {
          setNewName("");
          setIsAdding(false);
          onUpdate();
          toast.success("Literal added");
        },
        onError: ({ message }) =>
          toast.error(message || "Error adding literal"),
      },
    );
  }, [newName, elementId, modelId, layer, createLiteral, onUpdate]);

  const handleRemove = useCallback(
    (id: string) => {
      removeLiteral.mutate(
        { id },
        {
          onSuccess: () => {
            onUpdate();
            toast.success("Literal removed");
          },
          onError: ({ message }) =>
            toast.error(message || "Error removing literal"),
        },
      );
    },
    [removeLiteral, onUpdate],
  );

  const handleStartEdit = useCallback((lit: LiteralData) => {
    setEditingId(lit.id);
    setEditingName(lit.name);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!editingId || !editingName.trim()) return;
    updateLiteral.mutate(
      { id: editingId, name: editingName.trim() },
      {
        onSuccess: () => {
          setEditingId(null);
          setEditingName("");
          onUpdate();
          toast.success("Literal updated");
        },
        onError: ({ message }) =>
          toast.error(message || "Error updating literal"),
      },
    );
  }, [editingId, editingName, updateLiteral, onUpdate]);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditingName("");
  }, []);

  const handleCancel = useCallback(() => {
    setIsAdding(false);
    setNewName("");
  }, []);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">
          Enumeration Literals
        </p>
        {!isAdding && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-[10px] px-1.5 gap-1"
            onClick={() => setIsAdding(true)}
          >
            <span className="text-xs leading-none">+</span> Add
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-2.5 flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Label className="text-[10px] text-muted-foreground">Name</Label>
            <Input
              ref={nameInputRef}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="LITERAL_NAME"
              className="h-7 text-xs"
              onKeyDown={(e) => {
                if (e.key === "Enter" && newName.trim()) handleAdd();
                if (e.key === "Escape") handleCancel();
              }}
            />
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
              disabled={!newName.trim() || createLiteral.isPending}
            >
              {createLiteral.isPending ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-0.5">
        {literals.length === 0 && !isAdding && (
          <p className="text-[10px] text-muted-foreground italic text-center py-1">
            No literals
          </p>
        )}
        {literals.map((lit) => (
          <div
            key={lit.id}
            className="group flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-mono hover:bg-accent/50"
          >
            {editingId === lit.id ? (
              <>
                <Input
                  ref={editInputRef}
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="h-6 text-[10px] flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && editingName.trim())
                      handleSaveEdit();
                    if (e.key === "Escape") handleCancelEdit();
                  }}
                  onBlur={handleSaveEdit}
                />
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-muted-foreground hover:text-foreground"
                  title="Cancel"
                >
                  <span className="text-[10px]">Esc</span>
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 truncate">{lit.name}</span>
                {lit.value && (
                  <span className="text-muted-foreground">= {lit.value}</span>
                )}
                <button
                  type="button"
                  onClick={() => handleStartEdit(lit)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
                  title="Edit literal"
                >
                  <Pencil className="size-2.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(lit.id)}
                  className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive transition-opacity"
                  title="Remove literal"
                >
                  <Trash2 className="size-2.5" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
