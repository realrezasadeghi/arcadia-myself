"use client";

import { ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/modules/shared/ui/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/shared/ui/components/ui/table";
import type { ProjectMemberData } from "../../application/ports/project";
import type { ProjectRoleDefinition } from "../../domain/constants/permissions";
import { can, filterAssignableRoles } from "../../domain/services/permissions";
import { useRemoveProjectMember } from "../clients/remove-member";
import { AddMemberDialog } from "../components/add-member-dialog";
import { EditMemberRoleDialog } from "../components/edit-member-role-dialog";
import { ProjectMemberBadge } from "../components/project-member-role";
import {
  RemoveMemberDialog,
  type RemoveMemberDialogData,
} from "../components/remove-member-dialog";
import type { Project } from "../types/project";

type MembersViewProps = {
  projectId: number;
  project: Project;
  members: ProjectMemberData[];
  roles: ProjectRoleDefinition[];
};

export function MembersView({
  projectId,
  project,
  members,
  roles,
}: MembersViewProps) {
  const t = useTranslations("project.members");
  const router = useRouter();

  const canManage = can(project.permissions, "manageMembers");
  const canAdd = can(project.permissions, "addMembers");

  // Inviter ceiling: only roles whose permissions fit within ours.
  const assignableRoles = useMemo(
    () => filterAssignableRoles(project.permissions, roles),
    [project.permissions, roles],
  );

  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ProjectMemberData | null>(null);
  const [removeTarget, setRemoveTarget] =
    useState<RemoveMemberDialogData | null>(null);

  const removeMember = useRemoveProjectMember();

  if (!canManage && !canAdd) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">{t("noAccess")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="size-8" asChild>
              <Link href={`/dashboard/project/${projectId}`}>
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">
              {t("title", { name: project.name })}
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>

        {canAdd && (
          <Button onClick={() => setAddOpen(true)}>
            <UserPlus className="size-4" />
            {t("add")}
          </Button>
        )}
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("username")}</TableHead>
              <TableHead>{t("roleColumn")}</TableHead>
              <TableHead>{t("joinedAt")}</TableHead>
              {canManage && (
                <TableHead className="text-right">{t("actions")}</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.userId}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {member.username}
                </TableCell>
                <TableCell>
                  <ProjectMemberBadge roles={member.roles} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {member.joinedAt}
                </TableCell>
                {canManage && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditTarget(member)}
                      >
                        {t("changeRole")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        disabled={removeMember.isPending}
                        onClick={() =>
                          setRemoveTarget({
                            userId: member.userId,
                            name: member.name,
                          })
                        }
                      >
                        {t("remove")}
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddMemberDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        projectId={projectId}
        assignableRoles={assignableRoles}
        onSuccess={() => router.refresh()}
      />

      <EditMemberRoleDialog
        member={editTarget}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null);
        }}
        projectId={projectId}
        assignableRoles={assignableRoles}
        onSuccess={() => router.refresh()}
      />

      <RemoveMemberDialog
        target={removeTarget}
        onOpenChange={(open) => {
          if (!open) setRemoveTarget(null);
        }}
        onConfirm={(userId) =>
          new Promise<void>((resolve, reject) => {
            removeMember.mutate(
              { projectId, userId },
              {
                onSuccess: (data) => {
                  toast.success(data.message);
                  router.refresh();
                  resolve();
                },
                onError: (error) => {
                  toast.error(error.message);
                  reject(error);
                },
              },
            );
          })
        }
      />
    </div>
  );
}
