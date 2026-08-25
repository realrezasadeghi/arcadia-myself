"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
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
import { useCreateLifeline } from "../clients/create-lifeline";
import { getLifelinesByScenarioIdKey } from "../clients/get-lifelines-by-scenario-id";

type CreateLifelineDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scenarioId: string;
  existingLifelineCount: number;
};

const LIFELINE_TYPE_OPTIONS = [
  { value: "ACTOR", label: "Actor" },
  { value: "FUNCTION", label: "Function" },
  { value: "COMPONENT", label: "Component" },
  { value: "CLASS_ELEMENT", label: "Class Element" },
  { value: "EXTERNAL", label: "External" },
];

export function CreateLifelineDialog({
  open,
  onOpenChange,
  scenarioId,
  existingLifelineCount,
}: CreateLifelineDialogProps) {
  const [name, setName] = useState("");
  const [lifelineType, setLifelineType] = useState("COMPONENT");

  const queryClient = useQueryClient();
  const createLifeline = useCreateLifeline(scenarioId);

  const handleClose = useCallback(() => {
    setName("");
    setLifelineType("COMPONENT");
    onOpenChange(false);
  }, [onOpenChange]);

  const handleConfirm = useCallback(() => {
    if (!name.trim()) return;

    createLifeline.mutate(
      {
        name: name.trim(),
        representedElementType: lifelineType,
        columnIndex: existingLifelineCount,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getLifelinesByScenarioIdKey(scenarioId),
          });
          toast.success("Lifeline added");
          handleClose();
        },
        onError: ({ message }) => {
          toast.error(message || "Error creating lifeline");
        },
      },
    );
  }, [
    name,
    lifelineType,
    createLifeline,
    queryClient,
    scenarioId,
    existingLifelineCount,
    handleClose,
  ]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Lifeline</DialogTitle>
          <DialogDescription>
            Add a new participant to the sequence diagram
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-1">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lifeline-name">Name</Label>
            <Input
              id="lifeline-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
              placeholder="Enter lifeline name..."
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Type</Label>
            <Select value={lifelineType} onValueChange={setLifelineType}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LIFELINE_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!name.trim() || createLifeline.isPending}
          >
            {createLifeline.isPending && (
              <Loader2 className="size-3.5 animate-spin mr-1.5" />
            )}
            Add Lifeline
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
