"use client";

import type { ReactNode } from "react";
import type { ProjectPermission } from "@/modules/project/domain/constants/permissions";
import { can, canAny } from "@/modules/project/domain/services/permissions";

type CanProps = {
  permissions: readonly string[] | undefined;
  /** Single required permission. */
  permission?: ProjectPermission;
  /** Render if ANY of these permissions is present. */
  any?: readonly ProjectPermission[];
  /** Optional fallback when the check fails. */
  fallback?: ReactNode;
  children: ReactNode;
};

/**
 * Conditional render gate for project permissions.
 * Usage: <Can permissions={project.permissions} permission="editProject">...</Can>
 */
export function Can({
  permissions,
  permission,
  any,
  fallback = null,
  children,
}: CanProps) {
  const allowed = permissions
    ? permission
      ? can(permissions, permission)
      : any
        ? canAny(permissions, any)
        : true
    : false;

  return <>{allowed ? children : fallback}</>;
}
