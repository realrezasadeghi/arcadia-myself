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
import { useCreateMessage } from "../clients/create-message";
import { getMessagesByScenarioIdKey } from "../clients/get-messages-by-scenario-id";

type Lifeline = {
  id: string;
  name: string;
  representedElementType: string;
};

type CreateMessageDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scenarioId: string;
  lifelines: Lifeline[];
  preselectedSourceId?: string;
  preselectedTargetId?: string;
  nextExecutionOrder: number;
};

const MESSAGE_KIND_OPTIONS = [
  { value: "CALL", label: "Synchronous Call" },
  { value: "CREATE", label: "Create" },
  { value: "DELETE", label: "Delete" },
  { value: "RETURN", label: "Return" },
  { value: "REPLY", label: "Reply" },
  { value: "FOUND", label: "Found (unknown source)" },
  { value: "LOST", label: "Lost (unknown target)" },
];

export function CreateMessageDialog({
  open,
  onOpenChange,
  scenarioId,
  lifelines,
  preselectedSourceId,
  preselectedTargetId,
  nextExecutionOrder,
}: CreateMessageDialogProps) {
  const [name, setName] = useState("");
  const [kind, setKind] = useState("CALL");
  const [sourceLifelineId, setSourceLifelineId] = useState(
    preselectedSourceId ?? "",
  );
  const [targetLifelineId, setTargetLifelineId] = useState(
    preselectedTargetId ?? "",
  );

  const queryClient = useQueryClient();
  const createMessage = useCreateMessage(scenarioId);

  const handleClose = useCallback(() => {
    setName("");
    setKind("CALL");
    setSourceLifelineId("");
    setTargetLifelineId("");
    onOpenChange(false);
  }, [onOpenChange]);

  const isFoundKind = kind === "FOUND";
  const isLostKind = kind === "LOST";

  const handleConfirm = useCallback(() => {
    if (!name.trim()) return;

    // For FOUND: no known source, use any lifeline as placeholder in DB
    // For LOST: no known target, use any lifeline as placeholder in DB
    const srcId = isFoundKind
      ? (lifelines[0]?.id ?? sourceLifelineId)
      : sourceLifelineId;
    const tgtId = isLostKind
      ? (lifelines[0]?.id ?? targetLifelineId)
      : targetLifelineId;

    if (!srcId || !tgtId) return;
    if (isLostKind && srcId === tgtId && lifelines.length > 1) {
      // For LOST, ensure source != target (use second lifeline if available)
      const alt = lifelines.find((l) => l.id !== srcId);
      if (alt) {
        createMessage.mutate(
          {
            name: name.trim(),
            kind,
            sourceLifelineId: alt.id,
            targetLifelineId: tgtId,
            executionOrder: nextExecutionOrder,
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: getMessagesByScenarioIdKey(scenarioId),
              });
              toast.success("Message added");
              handleClose();
            },
            onError: ({ message }) => {
              toast.error(message || "Error creating message");
            },
          },
        );
        return;
      }
    }

    createMessage.mutate(
      {
        name: name.trim(),
        kind,
        sourceLifelineId: srcId,
        targetLifelineId: tgtId,
        executionOrder: nextExecutionOrder,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getMessagesByScenarioIdKey(scenarioId),
          });
          toast.success("Message added");
          handleClose();
        },
        onError: ({ message }) => {
          toast.error(message || "Error creating message");
        },
      },
    );
  }, [
    name,
    kind,
    isFoundKind,
    isLostKind,
    sourceLifelineId,
    targetLifelineId,
    lifelines,
    createMessage,
    queryClient,
    scenarioId,
    handleClose,
    nextExecutionOrder,
  ]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Message</DialogTitle>
          <DialogDescription>
            Create a message between two lifelines
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-1">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="message-name">Name</Label>
            <Input
              id="message-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
              placeholder="Enter message name..."
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Kind</Label>
            <Select value={kind} onValueChange={setKind}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MESSAGE_KIND_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {kind === "CREATE" && (
              <p className="text-[10px] text-amber-600 leading-tight">
                Each lifeline can only be created once. The target lifeline
                header will appear at this message&apos;s position.
              </p>
            )}
            {kind === "DELETE" && (
              <p className="text-[10px] text-amber-600 leading-tight">
                Each lifeline can only be destroyed once. The target lifeline
                ends with a black X at this message.
              </p>
            )}
            {isFoundKind && (
              <p className="text-[10px] text-muted-foreground leading-tight">
                Message originates from an unknown source. A black circle marks
                the source endpoint.
              </p>
            )}
            {isLostKind && (
              <p className="text-[10px] text-muted-foreground leading-tight">
                Message terminates at an unknown target. A black circle marks
                the target endpoint.
              </p>
            )}
          </div>

          {/* Source picker — hidden for FOUND messages */}
          {!isFoundKind && (
            <div className="flex flex-col gap-1.5">
              <Label>Source Lifeline</Label>
              <Select
                value={sourceLifelineId}
                onValueChange={setSourceLifelineId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select source..." />
                </SelectTrigger>
                <SelectContent>
                  {lifelines.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Source placeholder for FOUND */}
          {isFoundKind && (
            <div className="flex items-center gap-2 rounded-md border border-dashed border-muted px-3 py-2.5">
              <div className="size-2.5 rounded-full bg-slate-800" />
              <span className="text-xs text-muted-foreground">
                Unknown source
              </span>
            </div>
          )}

          {/* Target picker — hidden for LOST messages */}
          {!isLostKind && (
            <div className="flex flex-col gap-1.5">
              <Label>Target Lifeline</Label>
              <Select
                value={targetLifelineId}
                onValueChange={setTargetLifelineId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select target..." />
                </SelectTrigger>
                <SelectContent>
                  {lifelines
                    .filter((l) => {
                      const allowSelf =
                        kind === "CALL" ||
                        kind === "RETURN" ||
                        kind === "REPLY";
                      if (l.id === sourceLifelineId)
                        return allowSelf || isFoundKind;
                      return true;
                    })
                    .map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.name}
                        {l.id === sourceLifelineId && !isFoundKind && " (self)"}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Target placeholder for LOST */}
          {isLostKind && (
            <div className="flex items-center gap-2 rounded-md border border-dashed border-muted px-3 py-2.5">
              <div className="size-2.5 rounded-full bg-slate-800" />
              <span className="text-xs text-muted-foreground">
                Unknown target
              </span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={
              !name.trim() ||
              (!isFoundKind && !sourceLifelineId) ||
              (!isLostKind && !targetLifelineId) ||
              createMessage.isPending
            }
          >
            {createMessage.isPending && (
              <Loader2 className="size-3.5 animate-spin mr-1.5" />
            )}
            Add Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
