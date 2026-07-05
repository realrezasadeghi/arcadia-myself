"use client";

import { useEffect, useState } from "react";
import { Button } from "@/modules/shared/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/modules/shared/ui/components/ui/dialog";
import { Input } from "@/modules/shared/ui/components/ui/input";
import { Label } from "@/modules/shared/ui/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/shared/ui/components/ui/select";
import { Textarea } from "@/modules/shared/ui/components/ui/textarea";
import { useCreateElement } from "../../clients/create-element";
import { useUpdateElement } from "../../clients/update-element";
import { getElementTypeInfo } from "../../helpers/element";
import type { ElementTypeValue } from "../../types/element";

const CLASS_ELEMENT_TYPES: ElementTypeValue[] = [
  "Class",
  "Interface",
  "DataType",
  "Enumeration",
  "PrimitiveType",
  "Collection",
  "ExchangeItem",
];

type ClassNodeFormProps = {
  open: boolean;
  mode: "create" | "edit";
  modelId: string;
  editNodeId: string | null;
  existingElements: Array<{ id: string; name: string; type: string }>;
  onClose: () => void;
};

export function ClassNodeForm({
  open,
  mode,
  modelId,
  editNodeId,
  existingElements,
  onClose,
}: ClassNodeFormProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<ElementTypeValue>("Class");
  const [description, setDescription] = useState("");

  const createElement = useCreateElement();
  const updateElement = useUpdateElement();

  const editElement = editNodeId
    ? existingElements.find((e) => e.id === editNodeId)
    : null;

  useEffect(() => {
    if (mode === "edit" && editElement) {
      setName(editElement.name);
      setType(editElement.type as ElementTypeValue);
    } else {
      setName("");
      setType("Class");
      setDescription("");
    }
  }, [mode, editElement, open]);

  function handleSubmit() {
    if (!name.trim()) return;

    if (mode === "edit" && editNodeId) {
      updateElement.mutate(
        {
          id: editNodeId,
          name: name.trim(),
          description: description || undefined,
        },
        { onSuccess: () => onClose() },
      );
    } else {
      const typeInfo = getElementTypeInfo(type);
      createElement.mutate(
        {
          modelId,
          type,
          layer: typeInfo.layer,
          name: name.trim(),
          description: description || undefined,
        },
        { onSuccess: () => onClose() },
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Class Element" : "New Class Element"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update the element properties"
              : "Create a new class element in the diagram"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="node-name">Name</Label>
            <Input
              id="node-name"
              placeholder="e.g. UserController"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {mode === "create" && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="node-type">Type</Label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as ElementTypeValue)}
              >
                <SelectTrigger id="node-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLASS_ELEMENT_TYPES.map((t) => {
                    const info = getElementTypeInfo(t);
                    return (
                      <SelectItem key={t} value={t}>
                        {info.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="node-desc">Description (optional)</Label>
            <Textarea
              id="node-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            {mode === "edit" ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
