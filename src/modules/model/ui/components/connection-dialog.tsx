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
import {
  getEdgeVisual,
  getRelationshipTypeInfo,
} from "../helpers/relationship";
import type { RelationshipTypeValue } from "../types/relationship";

interface ConnectionDialogProps {
  open: boolean;
  allowedTypes: RelationshipTypeValue[];
  onConfirm: (type: RelationshipTypeValue, name: string) => void;
  onOpenChange: (value: boolean) => void;
}

export function ConnectionDialog({
  open,
  allowedTypes,
  onConfirm,
  onOpenChange,
}: ConnectionDialogProps) {
  const [name, setName] = useState("");

  const [selectedType, setSelectedType] =
    useState<RelationshipTypeValue | null>(allowedTypes[0] ?? null);

  function handleConfirm() {
    if (!selectedType) return;
    onConfirm(selectedType, name);
    setName("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>نوع رابطه را انتخاب کنید</DialogTitle>
          <DialogDescription>
            بین این دو المنت چه نوع رابطه‌ای برقرار می‌شود؟
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <div className="flex flex-col gap-1">
            {allowedTypes.map((typeValue) => {
              const spec = getEdgeVisual(typeValue);
              const isSelected = selectedType === typeValue;
              const relationshipInfo = getRelationshipTypeInfo(typeValue);
              return (
                <button
                  type="button"
                  key={typeValue}
                  onClick={() => setSelectedType(typeValue)}
                  className={cn(
                    "flex items-center gap-3 rounded-md border px-3 py-2 text-sm text-right transition-colors",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40 hover:bg-accent",
                  )}
                >
                  <span
                    className="h-1 w-6 rounded-full shrink-0"
                    style={{ backgroundColor: spec.strokeColor }}
                  />
                  <span className="flex-1 text-right">
                    {relationshipInfo.labelFa}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rel-name">نام رابطه (اختیاری)</Label>
            <Input
              id="rel-name"
              placeholder="مثال: requestData"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            انصراف
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedType}>
            ایجاد رابطه
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
