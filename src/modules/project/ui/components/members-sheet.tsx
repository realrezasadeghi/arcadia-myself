"use client";

import { useTranslations } from "next-intl";
import { useGetMe } from "@/modules/auth/ui/clients/get-me";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/modules/shared/ui/components/ui/sheet";
import { MembersPanel } from "./members-panel";

type MembersSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: number;
  projectName: string;
  permissions: readonly string[];
};

export function MembersSheet({
  open,
  onOpenChange,
  projectId,
  projectName,
  permissions,
}: MembersSheetProps) {
  const t = useTranslations("project.members");
  const me = useGetMe();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-2xl">
        <SheetHeader className="border-b pr-12">
          <SheetTitle>{t("title", { name: projectName })}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <MembersPanel
            variant="sheet"
            projectId={projectId}
            projectName={projectName}
            permissions={permissions}
            currentUserId={me.data?.id ?? null}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
