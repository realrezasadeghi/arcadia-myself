"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/modules/shared/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/modules/shared/ui/components/ui/dialog";

export type RemoveMemberDialogData = {
  userId: number;
  name: string;
};

type RemoveMemberDialogProps = {
  target: RemoveMemberDialogData | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (userId: number) => Promise<void>;
};

export function RemoveMemberDialog({
  target,
  onOpenChange,
  onConfirm,
}: RemoveMemberDialogProps) {
  const t = useTranslations("project.members");
  const [pending, setPending] = useState(false);

  const handleConfirm = async () => {
    if (!target || pending) return;
    setPending(true);
    try {
      await onConfirm(target.userId);
      // Removal succeeded — close instead of leaving a stale dialog open.
      onOpenChange(false);
    } catch {
      // Keep the dialog open so the caller's error toast stays in context.
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={!!target} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {target ? t("removeTitle", { name: target.name }) : ""}
          </DialogTitle>
          <DialogDescription>{t("removeDescription")}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => onOpenChange(false)}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            loading={pending}
            disabled={!target}
            onClick={handleConfirm}
          >
            {t("remove")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
