"use client";

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
import { cn } from "@/modules/shared/ui/libs/cn";
import { useState } from "react";
import { MessageSort } from "@/modules/model/domain/value-objects/message-sort";
import type { MessageSortValue } from "@/modules/model/domain/value-objects/message-sort";

const ALL_SORTS = MessageSort.all();

const SORT_COLORS: Record<string, string> = {
  sync: "#1E8449",
  async: "#2E86C1",
  reply: "#94A3B8",
  create: "#27AE60",
  destroy: "#E74C3C",
  found: "#7F8C8D",
  lost: "#E74C3C",
};

interface MessageConnectionDialogProps {
  open: boolean;
  allowedTypes: string[];
  onConfirm: (type: string, name: string) => void;
  onOpenChange: (value: boolean) => void;
}

export function MessageConnectionDialog({
  open,
  allowedTypes,
  onConfirm,
  onOpenChange,
}: MessageConnectionDialogProps) {
  const [name, setName] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(
    allowedTypes[0] ?? null,
  );

  function handleConfirm() {
    if (!selectedType) return;
    onConfirm(selectedType, name || selectedType);
    setName("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Select Message Type</DialogTitle>
          <DialogDescription>
            What type of message connects these two lifelines?
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <div className="flex flex-col gap-1">
            {allowedTypes.map((typeValue) => {
              const sort = ALL_SORTS.find((s) => s.value === typeValue);
              if (!sort) return null;
              const isSelected = selectedType === typeValue;
              const color = SORT_COLORS[typeValue] || "#94A3B8";

              return (
                <button
                  type="button"
                  key={typeValue}
                  onClick={() => setSelectedType(typeValue)}
                  className={cn(
                    "flex items-center gap-3 rounded-md border px-3 py-2 text-sm text-left transition-colors",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40 hover:bg-accent",
                  )}
                >
                  <span
                    className="h-1 w-6 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="flex-1 text-left">{sort.label}</span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="msg-name">Message Name</Label>
            <Input
              id="msg-name"
              placeholder="e.g. requestData"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedType}>
            Create Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
