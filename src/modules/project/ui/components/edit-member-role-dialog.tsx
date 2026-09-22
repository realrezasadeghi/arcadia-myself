"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import { Label } from "@/modules/shared/ui/components/ui/label";
import type { ProjectMemberData } from "../../application/ports/project";
import type { ProjectRoleDefinition } from "../../domain/constants/permissions";
import type { ProjectRoleName } from "../../domain/value-objects/project-role";
import { useUpdateProjectMemberRole } from "../clients/update-member-role";

type EditMemberRoleDialogProps = {
  member: ProjectMemberData | null;
  onOpenChange: (open: boolean) => void;
  projectId: number;
  assignableRoles: ProjectRoleDefinition[];
  onSuccess?: () => void;
};

export function EditMemberRoleDialog({
  member,
  onOpenChange,
  projectId,
  assignableRoles,
  onSuccess,
}: EditMemberRoleDialogProps) {
  const t = useTranslations("project.members");
  const tRoles = useTranslations("project.roles");
  const updateRole = useUpdateProjectMemberRole();

  const [roles, setRoles] = useState<ProjectRoleName[]>([]);

  useEffect(() => {
    if (member) setRoles(member.roles);
  }, [member]);

  const toggleRole = (role: ProjectRoleName) => {
    setRoles((current) =>
      current.includes(role)
        ? current.filter((item) => item !== role)
        : [...current, role],
    );
  };

  const submit = () => {
    if (!member || roles.length === 0) return;
    updateRole.mutate(
      { projectId, userId: member.userId, roles },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <Dialog open={!!member} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {member ? t("changeRoleTitle", { name: member.name }) : ""}
          </DialogTitle>
          <DialogDescription>{t("changeRoleDescription")}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 py-2">
          <Label>{t("rolesColumn")}</Label>
          <div className="flex max-h-48 flex-col gap-2 overflow-y-auto rounded-md border p-3">
            {assignableRoles.map((definition) => (
              <label
                key={definition.role}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <Checkbox
                  checked={roles.includes(definition.role)}
                  onCheckedChange={() => toggleRole(definition.role)}
                />
                {tRoles(definition.role)}
              </label>
            ))}
          </div>
          {assignableRoles.length === 0 && (
            <p className="text-xs text-muted-foreground">
              {t("noAssignableRoles")}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={updateRole.isPending}
            onClick={() => onOpenChange(false)}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            loading={updateRole.isPending}
            disabled={roles.length === 0 || assignableRoles.length === 0}
            onClick={submit}
          >
            {t("saveRole")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
