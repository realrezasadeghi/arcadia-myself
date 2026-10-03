import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProjectById } from "@/modules/project/presentation/server-actions/get-by-id";
import { getProjectMembers } from "@/modules/project/presentation/server-actions/get-members";
import { getProjectRoles } from "@/modules/project/presentation/server-actions/get-roles";
import { MembersPanel } from "@/modules/project/ui/components/members-panel";
import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { extractUserIdFromJwt } from "@/modules/shared/libs/extract-jwt";
import { Skeleton } from "@/modules/shared/ui/components/ui/skeleton";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Members",
};

/**
 * Skeleton shown while the RBAC data (project, members, roles) streams in.
 * Kept local because it mirrors the members table layout.
 */
function MembersSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="rounded-xl border bg-card p-2">
        {Array.from({ length: 4 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows
          <div key={i} className="flex items-center justify-between px-3 py-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-6 w-24 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

async function MembersSection({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projectId = Number(id);

  if (!Number.isFinite(projectId) || projectId <= 0) {
    notFound();
  }

  const token = await cookiesStorageService.get("token");
  const currentUserId = token ? extractUserIdFromJwt(token) : null;

  const [projectResult, membersResult, rolesResult] = await Promise.all([
    getProjectById(projectId),
    getProjectMembers({ projectId }),
    getProjectRoles(),
  ]);

  if (!projectResult.success || !projectResult.data) {
    notFound();
  }

  if (!membersResult.success) {
    throw new Error(membersResult.message || "Failed to load project members");
  }

  if (!rolesResult.success) {
    throw new Error(rolesResult.message || "Failed to load project roles");
  }

  return (
    <MembersPanel
      variant="page"
      projectId={projectId}
      projectName={projectResult.data.name}
      permissions={projectResult.data.permissions}
      currentUserId={currentUserId}
      initialMembers={membersResult.data ?? []}
      initialRoles={rolesResult.data ?? []}
    />
  );
}

export default function Page({ params }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<MembersSkeleton />}>
        <MembersSection params={params} />
      </Suspense>
    </div>
  );
}
