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
import type { ClassAssociationType } from "../../../domain/entities/class-association";
import {
  createClassAssociation,
  updateClassAssociation,
} from "../../../presentation/server-actions/class-diagram/manage-association";

const ASSOCIATION_TYPES: Array<{ value: ClassAssociationType; label: string }> =
  [
    { value: "ClassAssociation", label: "Association" },
    { value: "ClassAggregation", label: "Aggregation" },
    { value: "ClassComposition", label: "Composition" },
    { value: "ClassGeneralization", label: "Generalization" },
    { value: "ClassDependency", label: "Dependency" },
    { value: "ClassRealization", label: "Realization" },
  ];

type ClassElement = { id: string; name: string; type: string };

type AssociationFormProps = {
  open: boolean;
  modelId: string;
  editAssocId: string | null;
  pendingConnection: { source: string; target: string } | null;
  existingElements: ClassElement[];
  onClose: () => void;
};

export function AssociationForm({
  open,
  modelId,
  editAssocId,
  pendingConnection,
  existingElements,
  onClose,
}: AssociationFormProps) {
  const queryClient = useQueryClient();

  const [type, setType] = useState<ClassAssociationType>("ClassAssociation");
  const [sourceClassId, setSourceClassId] = useState("");
  const [targetClassId, setTargetClassId] = useState("");
  const [name, setName] = useState("");
  const [sourceMultLower, setSourceMultLower] = useState("1");
  const [sourceMultUpper, setSourceMultUpper] = useState("");
  const [targetMultLower, setTargetMultLower] = useState("1");
  const [targetMultUpper, setTargetMultUpper] = useState("");
  const [sourceRole, setSourceRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [isNavigable, setIsNavigable] = useState(true);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        modelId,
        type,
        sourceClassId,
        targetClassId,
        name: name || null,
        sourceMultiplicityLower: Number.parseInt(sourceMultLower, 10) || 1,
        sourceMultiplicityUpper: sourceMultUpper
          ? Number.parseInt(sourceMultUpper, 10)
          : null,
        targetMultiplicityLower: Number.parseInt(targetMultLower, 10) || 1,
        targetMultiplicityUpper: targetMultUpper
          ? Number.parseInt(targetMultUpper, 10)
          : null,
        sourceRole: sourceRole || null,
        targetRole: targetRole || null,
        isNavigable,
      };
      if (editAssocId) {
        return updateClassAssociation({
          id: editAssocId,
          name: payload.name,
          sourceMultiplicityLower: payload.sourceMultiplicityLower,
          sourceMultiplicityUpper: payload.sourceMultiplicityUpper,
          targetMultiplicityLower: payload.targetMultiplicityLower,
          targetMultiplicityUpper: payload.targetMultiplicityUpper,
          sourceRole: payload.sourceRole,
          targetRole: payload.targetRole,
          isNavigable: payload.isNavigable,
        });
      }
      return createClassAssociation(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-diagram"] });
      onClose();
    },
  });

  useEffect(() => {
    if (open) {
      if (pendingConnection) {
        setSourceClassId(pendingConnection.source);
        setTargetClassId(pendingConnection.target);
      } else {
        setSourceClassId("");
        setTargetClassId("");
      }
      if (!editAssocId) {
        setType("ClassAssociation");
        setName("");
        setSourceMultLower("1");
        setSourceMultUpper("");
        setTargetMultLower("1");
        setTargetMultUpper("");
        setSourceRole("");
        setTargetRole("");
        setIsNavigable(true);
      }
    }
  }, [open, pendingConnection, editAssocId]);

  function handleSubmit() {
    if (!sourceClassId || !targetClassId) return;
    saveMutation.mutate();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editAssocId ? "Edit Association" : "New Association"}
          </DialogTitle>
          <DialogDescription>
            {editAssocId
              ? "Update the association properties"
              : "Define the relationship between two class elements"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <div className="flex flex-col gap-1.5">
            <Label>Association Type</Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as ClassAssociationType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ASSOCIATION_TYPES.map((at) => (
                  <SelectItem key={at.value} value={at.value}>
                    {at.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Source</Label>
            <Select value={sourceClassId} onValueChange={setSourceClassId}>
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                {existingElements.map((el) => (
                  <SelectItem key={el.id} value={el.id}>
                    {el.name} ({el.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Target</Label>
            <Select value={targetClassId} onValueChange={setTargetClassId}>
              <SelectTrigger>
                <SelectValue placeholder="Select target" />
              </SelectTrigger>
              <SelectContent>
                {existingElements.map((el) => (
                  <SelectItem key={el.id} value={el.id}>
                    {el.name} ({el.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="assoc-name">Name (optional)</Label>
            <Input
              id="assoc-name"
              placeholder="e.g. has"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Source Multiplicity</Label>
              <div className="flex gap-1">
                <Input
                  placeholder="min"
                  value={sourceMultLower}
                  onChange={(e) => setSourceMultLower(e.target.value)}
                  className="w-16"
                />
                <span className="self-center">..</span>
                <Input
                  placeholder="max"
                  value={sourceMultUpper}
                  onChange={(e) => setSourceMultUpper(e.target.value)}
                  className="w-16"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Target Multiplicity</Label>
              <div className="flex gap-1">
                <Input
                  placeholder="min"
                  value={targetMultLower}
                  onChange={(e) => setTargetMultLower(e.target.value)}
                  className="w-16"
                />
                <span className="self-center">..</span>
                <Input
                  placeholder="max"
                  value={targetMultUpper}
                  onChange={(e) => setTargetMultUpper(e.target.value)}
                  className="w-16"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="src-role">Source Role</Label>
              <Input
                id="src-role"
                placeholder="e.g. owner"
                value={sourceRole}
                onChange={(e) => setSourceRole(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tgt-role">Target Role</Label>
              <Input
                id="tgt-role"
                placeholder="e.g. item"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="assoc-nav"
              checked={isNavigable}
              onCheckedChange={(v) => setIsNavigable(v === true)}
            />
            <Label htmlFor="assoc-nav" className="text-sm">
              Navigable
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !sourceClassId || !targetClassId || saveMutation.isPending
            }
          >
            {editAssocId ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
