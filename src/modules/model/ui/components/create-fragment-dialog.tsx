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
import { useCreateFragment } from "../clients/create-fragment";
import { getFragmentsByScenarioIdKey } from "../clients/get-fragments-by-scenario-id";

type CreateFragmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scenarioId: string;
  maxRowIndex: number;
  lifelineCount: number;
};

const FRAGMENT_OPERATOR_OPTIONS = [
  { value: "alt", label: "Alternative (if/else)" },
  { value: "opt", label: "Option (if)" },
  { value: "loop", label: "Loop" },
  { value: "break", label: "Break" },
  { value: "par", label: "Parallel" },
  { value: "critical", label: "Critical Region" },
  { value: "assert", label: "Assertion" },
  { value: "neg", label: "Negative" },
  { value: "ignore", label: "Ignore" },
  { value: "consider", label: "Consider" },
  { value: "strict", label: "Strict Sequence" },
  { value: "seq", label: "Weak Sequence" },
];

export function CreateFragmentDialog({
  open,
  onOpenChange,
  scenarioId,
  maxRowIndex,
  lifelineCount,
}: CreateFragmentDialogProps) {
  const [name, setName] = useState("");
  const [operator, setOperator] = useState("alt");
  const [guard, setGuard] = useState("");

  const queryClient = useQueryClient();
  const createFragment = useCreateFragment(scenarioId);

  const handleClose = useCallback(() => {
    setName("");
    setOperator("alt");
    setGuard("");
    onOpenChange(false);
  }, [onOpenChange]);

  const handleConfirm = useCallback(() => {
    if (!name.trim()) return;

    createFragment.mutate(
      {
        name: name.trim(),
        operator,
        guard: guard.trim() || undefined,
        rowIndex: maxRowIndex,
        columnIndex: 0,
        spanColumns: Math.max(lifelineCount, 1),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getFragmentsByScenarioIdKey(scenarioId),
          });
          toast.success("Fragment added");
          handleClose();
        },
        onError: ({ message }) => {
          toast.error(message || "Error creating fragment");
        },
      },
    );
  }, [
    name,
    operator,
    guard,
    createFragment,
    queryClient,
    scenarioId,
    handleClose,
    maxRowIndex,
    lifelineCount,
  ]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Fragment</DialogTitle>
          <DialogDescription>
            Add a UML combined fragment to control message flow
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-1">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fragment-name">Name</Label>
            <Input
              id="fragment-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
              placeholder="Enter fragment name..."
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Operator</Label>
            <Select value={operator} onValueChange={setOperator}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FRAGMENT_OPERATOR_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <span className="font-mono font-bold uppercase mr-2">
                      {opt.value}
                    </span>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fragment-guard">Guard Condition</Label>
            <Input
              id="fragment-guard"
              value={guard}
              onChange={(e) => setGuard(e.target.value)}
              placeholder="[condition] (optional)"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!name.trim() || createFragment.isPending}
          >
            {createFragment.isPending && (
              <Loader2 className="size-3.5 animate-spin mr-1.5" />
            )}
            Add Fragment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
