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
import { filterAssignableRoles } from "../../domain/services/permissions";
import { canPerform } from "../../domain/services/resource-action";
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
  /** The requesting user, used to block self-removal. */
  currentUserId: number | null;
};

export function MembersView({
  projectId,
  project,
  members,
  roles,
  currentUserId,
}: MembersViewProps) {
  const t = useTranslations("project.members");
  const router = useRouter();

  const canManage = canPerform(project.permissions, "member", "manage");
  const canAdd = canPerform(project.permissions, "member", "create");

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

  // RBAC: how many members can still manage other members. Removing or
  // demoting the last one would lock every remaining member out of the
  // project's member management.
  const managerCount = members.filter((member) =>
    canPerform(member.permissions, "member", "manage"),
  ).length;

  const isSelf = (member: ProjectMemberData) =>
    currentUserId !== null && member.userId === currentUserId;

  const isLastManager = (member: ProjectMemberData) =>
    canPerform(member.permissions, "member", "manage") && managerCount <= 1;

  if (!canManage && !canAdd) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">{t("noAccess")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("backToProject")}
              className="relative size-8 touch-manipulation after:absolute after:-inset-1.5 after:content-['']"
              asChild
            >
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
          <Button
            onClick={() => setAddOpen(true)}
            className="touch-manipulation any-pointer-coarse:min-h-11"
          >
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
              <TableHead className="w-[200px] whitespace-nowrap sm:w-[260px]">
                {t("roleColumn")}
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                {t("joinedAt")}
              </TableHead>
              {canManage && (
                <TableHead className="text-right">{t("actions")}</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => {
              const self = isSelf(member);
              const lastManager = isLastManager(member);
              const canEditMember = canManage && !lastManager;
              const canRemoveMember = canManage && !lastManager && !self;

              return (
                <TableRow key={member.userId}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {member.username}
                  </TableCell>
                  <TableCell className="whitespace-normal align-top">
                    <div className="w-[200px] sm:w-[260px]">
                      <ProjectMemberBadge roles={member.roles} />
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">
                    {member.joinedAt}
                  </TableCell>
                  {canManage && (
                    <TableCell className="text-right">
                      {canEditMember || canRemoveMember ? (
                        <div className="flex flex-wrap justify-end gap-2">
                          {canEditMember && (
                            <Button
                              variant="outline"
                              size="sm"
                              aria-label={`${t("changeRole")} — ${member.name}`}
                              className="touch-manipulation any-pointer-coarse:min-h-11"
                              onClick={() => setEditTarget(member)}
                            >
                              {t("changeRole")}
                            </Button>
                          )}
                          {canRemoveMember && (
                            <Button
                              variant="outline"
                              size="sm"
                              aria-label={`${t("remove")} — ${member.name}`}
                              className="border-destructive/30 text-destructive touch-manipulation any-pointer-coarse:min-h-11 hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
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
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {self ? t("you") : t("lastAdmin")}
                        </span>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}

            {members.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={canManage ? 5 : 4}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-sm font-medium">{t("empty")}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("emptyHint")}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
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
