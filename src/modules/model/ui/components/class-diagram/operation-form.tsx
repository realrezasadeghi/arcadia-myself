"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/modules/shared/ui/components/ui/button";
import { Checkbox } from "@/modules/shared/ui/components/ui/checkbox";
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
import {
  createClassOperation,
  updateClassOperation,
} from "../../../presentation/server-actions/class-diagram/manage-operation";

type OpParam = { name: string; type: string; direction: string };

type OperationFormProps = {
  open: boolean;
  classElementId: string;
  editOpId: string | null;
  onClose: () => void;
};

export function OperationForm({
  open,
  classElementId,
  editOpId,
  onClose,
}: OperationFormProps) {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [returnType, setReturnType] = useState("void");
  const [visibility, setVisibility] = useState("public");
  const [isStatic, setIsStatic] = useState(false);
  const [isAbstract, setIsAbstract] = useState(false);
  const [parameters, setParameters] = useState<OpParam[]>([]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        classElementId,
        name: name.trim(),
        returnType: returnType.trim() || "void",
        visibility: visibility as
          | "public"
          | "private"
          | "protected"
          | "package",
        isStatic,
        isAbstract,
        parameters: parameters.map((p) => ({
          ...p,
          direction: p.direction as "in" | "out" | "inout" | "return",
        })),
      };
      if (editOpId) {
        return updateClassOperation({ id: editOpId, ...payload });
      }
      return createClassOperation(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-diagram"] });
      onClose();
    },
  });

  useEffect(() => {
    if (!open) {
      setName("");
      setReturnType("void");
      setVisibility("public");
      setIsStatic(false);
      setIsAbstract(false);
      setParameters([]);
    }
  }, [open]);

  const addParam = useCallback(() => {
    setParameters((prev) => [
      ...prev,
      { name: "", type: "String", direction: "in" },
    ]);
  }, []);

  const removeParam = useCallback((index: number) => {
    setParameters((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateParam = useCallback(
    (index: number, field: keyof OpParam, value: string) => {
      setParameters((prev) =>
        prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
      );
    },
    [],
  );

  function handleSubmit() {
    if (!name.trim()) return;
    saveMutation.mutate();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editOpId ? "Edit Operation" : "New Operation"}
          </DialogTitle>
          <DialogDescription>
            {editOpId
              ? "Update the operation properties"
              : "Add a new operation to this class"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="op-name">Name</Label>
            <Input
              id="op-name"
              placeholder="e.g. login"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="op-return">Return Type</Label>
            <Input
              id="op-return"
              placeholder="e.g. void, boolean"
              value={returnType}
              onChange={(e) => setReturnType(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="op-visibility">Visibility</Label>
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger id="op-visibility">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">+ Public</SelectItem>
                <SelectItem value="private">- Private</SelectItem>
                <SelectItem value="protected"># Protected</SelectItem>
                <SelectItem value="package">~ Package</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="op-static"
                checked={isStatic}
                onCheckedChange={(v) => setIsStatic(v === true)}
              />
              <Label htmlFor="op-static" className="text-sm">
                Static
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="op-abstract"
                checked={isAbstract}
                onCheckedChange={(v) => setIsAbstract(v === true)}
              />
              <Label htmlFor="op-abstract" className="text-sm">
                Abstract
              </Label>
            </div>
          </div>

          {/* Parameters */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Parameters</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addParam}
              >
                + Add
              </Button>
            </div>
            {parameters.map((param, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  placeholder="name"
                  value={param.name}
                  onChange={(e) => updateParam(i, "name", e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="type"
                  value={param.type}
                  onChange={(e) => updateParam(i, "type", e.target.value)}
                  className="flex-1"
                />
                <Select
                  value={param.direction}
                  onValueChange={(v) => updateParam(i, "direction", v)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">in</SelectItem>
                    <SelectItem value="out">out</SelectItem>
                    <SelectItem value="inout">inout</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeParam(i)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || saveMutation.isPending}
          >
            {editOpId ? "Update" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
