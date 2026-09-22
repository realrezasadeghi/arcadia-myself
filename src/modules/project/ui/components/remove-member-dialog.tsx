"use client";

import { useTranslations } from "next-intl";
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
            onClick={() => onOpenChange(false)}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={!target}
            onClick={() => {
              if (target) {
                void onConfirm(target.userId).catch(() => {});
              }
            }}
          >
            {t("remove")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
