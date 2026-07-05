"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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
  createClassAttribute,
  updateClassAttribute,
} from "../../../presentation/server-actions/class-diagram/manage-attribute";

type AttributeFormProps = {
  open: boolean;
  classElementId: string;
  editAttrId: string | null;
  onClose: () => void;
};

export function AttributeForm({
  open,
  classElementId,
  editAttrId,
  onClose,
}: AttributeFormProps) {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [type, setType] = useState("String");
  const [visibility, setVisibility] = useState("public");
  const [isStatic, setIsStatic] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [defaultValue, setDefaultValue] = useState("");

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editAttrId) {
        return updateClassAttribute({
          id: editAttrId,
          name: name.trim(),
          type: type.trim(),
          visibility: visibility as
            | "public"
            | "private"
            | "protected"
            | "package",
          isStatic,
          isReadOnly,
          defaultValue: defaultValue || null,
        });
      }
      return createClassAttribute({
        classElementId,
        name: name.trim(),
        type: type.trim(),
        visibility: visibility as
          | "public"
          | "private"
          | "protected"
          | "package",
        isStatic,
        isReadOnly,
        defaultValue: defaultValue || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-diagram"] });
      onClose();
    },
  });

  useEffect(() => {
    if (!open) {
      setName("");
      setType("String");
      setVisibility("public");
      setIsStatic(false);
      setIsReadOnly(false);
      setDefaultValue("");
    }
  }, [open]);

  function handleSubmit() {
    if (!name.trim() || !type.trim()) return;
    saveMutation.mutate();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {editAttrId ? "Edit Attribute" : "New Attribute"}
          </DialogTitle>
          <DialogDescription>
            {editAttrId
              ? "Update the attribute properties"
              : "Add a new attribute to this class"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="attr-name">Name</Label>
            <Input
              id="attr-name"
              placeholder="e.g. username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="attr-type">Type</Label>
            <Input
              id="attr-type"
              placeholder="e.g. String"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="attr-visibility">Visibility</Label>
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger id="attr-visibility">
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

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="attr-default">Default Value (optional)</Label>
            <Input
              id="attr-default"
              placeholder="e.g. null"
              value={defaultValue}
              onChange={(e) => setDefaultValue(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="attr-static"
                checked={isStatic}
                onCheckedChange={(v) => setIsStatic(v === true)}
              />
              <Label htmlFor="attr-static" className="text-sm">
                Static
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="attr-readonly"
                checked={isReadOnly}
                onCheckedChange={(v) => setIsReadOnly(v === true)}
              />
              <Label htmlFor="attr-readonly" className="text-sm">
                Read Only
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || !type.trim() || saveMutation.isPending}
          >
            {editAttrId ? "Update" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
