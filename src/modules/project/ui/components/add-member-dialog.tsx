"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
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
import { Input } from "@/modules/shared/ui/components/ui/input";
import { Label } from "@/modules/shared/ui/components/ui/label";
import type { ProjectRoleDefinition } from "../../domain/constants/permissions";
import type { ProjectRoleName } from "../../domain/value-objects/project-role";
import { useAddProjectMember } from "../clients/add-member";
import { type AddMemberFormValues, addMemberSchema } from "../schemas/member";

type AddMemberDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: number;
  assignableRoles: ProjectRoleDefinition[];
  onSuccess?: () => void;
};

export function AddMemberDialog({
  open,
  onOpenChange,
  projectId,
  assignableRoles,
  onSuccess,
}: AddMemberDialogProps) {
  const t = useTranslations("project.members");
  const tRoles = useTranslations("project.roles");
  const addMember = useAddProjectMember();

  const [username, setUsername] = useState("");
  const [roles, setRoles] = useState<ProjectRoleName[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reset = () => {
    setUsername("");
    setRoles([]);
    setErrors({});
  };

  const close = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const toggleRole = (role: ProjectRoleName) => {
    setRoles((current) =>
      current.includes(role)
        ? current.filter((item) => item !== role)
        : [...current, role],
    );
  };

  const handleSubmit = (values: AddMemberFormValues) => {
    addMember.mutate(
      { projectId, username: values.username, roles: values.roles },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          reset();
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  const submit = () => {
    const parsed = addMemberSchema.safeParse({ username, roles });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as string] ??= issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    handleSubmit(parsed.data);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("add")}</DialogTitle>
          <DialogDescription>{t("addDescription")}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="member-username">{t("username")}</Label>
            <Input
              id="member-username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder={t("usernamePlaceholder")}
            />
            {errors.username && (
              <p className="text-xs text-destructive">{errors.username}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
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
            {errors.roles && (
              <p className="text-xs text-destructive">{errors.roles}</p>
            )}
            {assignableRoles.length === 0 && (
              <p className="text-xs text-muted-foreground">
                {t("noAssignableRoles")}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={addMember.isPending}
            onClick={() => close(false)}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            loading={addMember.isPending}
            disabled={assignableRoles.length === 0 || roles.length === 0}
            onClick={submit}
          >
            {t("add")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
