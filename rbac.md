# RBAC — Role-Based Access Control (arcadia × Capella API)

> Design + implementation notes for RBAC in this Next.js frontend, based on the
> Capella API contract captured in `postman.json`.

---

## 1. Goals

- Update the **legacy role design** (`OWNER / EDITOR / VIEWER`) to the **new
  Capella layer-role design** (11 predefined roles, 14 granular permissions).
- **Single role per member** — no `roles[]` arrays in the frontend domain or UI.
- Enforce permissions in the UI (buttons, layers, member management) while the
  **Laravel backend remains the authorization authority** (all frontend RBAC is
  UX; the client always degrades gracefully on `403`/`409`).
- Provide full **project membership management** UI (list / add / change role /
  remove).

## 2. Roles (single role per member)

A member holds exactly **one** role:

| Role | Permissions |
|---|---|
| `project_viewer` | `viewProject` |
| `oa_viewer` | `viewProject`, `viewOA` |
| `oa_editor` | `viewProject`, `viewOA`, `editOA` |
| `sa_viewer` | `viewProject`, `viewSA` |
| `sa_editor` | `viewProject`, `viewSA`, `editSA` |
| `la_viewer` | `viewProject`, `viewLA` |
| `la_editor` | `viewProject`, `viewLA`, `editLA` |
| `pa_viewer` | `viewProject`, `viewPA` |
| `pa_editor` | `viewProject`, `viewPA`, `editPA` |
| `project_inviter` | `viewProject`, `addMembers` |
| `admin` | all 14 permissions |

**Permissions (14):** `viewProject`, `viewOA`, `editOA`, `viewSA`, `editSA`,
`viewLA`, `editLA`, `viewPA`, `editPA`, `addMembers`, `manageMembers`,
`editProject`, `delete`, `deleteProject`.

**Sources of truth (in order):**

1. API-provided `permissions[]` on project/member responses.
2. The local **role → permission matrix** (`domain/constants/permissions.ts`),
   mirroring `GET /api/project-roles`, used as fallback and for optimistic UI.
## 3. API compatibility (single role ⇄ `roles[]`)

The current Capella API accepts/returns `roles` arrays. The frontend models a
single role and adapts at the boundary:

- **Requests:** the single role is sent wrapped — `{ roles: [role] }` — for
  `POST /projects/{id}/members` and `PATCH /projects/{id}/members/{userId}`.
- **Responses:** the effective role is read as `roles[0] ?? role`
  (`role` alone is the legacy computed value and is ignored when `roles`
  exists). Permissions come from the response `permissions[]` when present.
- **Fallbacks:** if a project payload has neither valid `roles` nor `role`, the
  creator falls back to `admin`, everyone else to `project_viewer`.

## 4. Business rules

- **Creator becomes admin** (API-enforced; mirrored in fallback logic).
- **Inviter ceiling:** a member with `addMembers` may only assign roles whose
  permission set is a subset of their own permissions
  (`filterAssignableRoles`).
- **Admin-only management:** changing a member role or removing a member
  requires `manageMembers`; the complete role set is replaced by the new single
  role.
- **Last-admin protection:** enforced server-side (`409` — `The project must
  retain at least one admin.`); surfaced as a friendly error in the UI.
- **Project access is membership-based**; the API returns `404` for
  non-members (`Project not found.`).
## 5. Error handling

`resolveErrorMessage` already surfaces the API message. Known RBAC errors:

| Status | API message | UI behaviour |
|---|---|---|
| 403 | `Your project role does not allow this action.` | Toast; button hidden beforehand when possible |
| 404 | `Project not found.` | Toast (caller is not a member) |
| 409 | `User is already a project member.` | Toast on add-member |
| 409 | `The project must retain at least one admin.` | Toast on role change/remove |

## 6. Module changes

### `project` module (domain)

- `domain/value-objects/project-role.ts` *(new)* — `ProjectRoleName` union of
  the 11 roles + `isProjectRoleName()` guard.
- `domain/constants/permissions.ts` *(new)* — `ProjectPermission` union (14),
  `PROJECT_LAYERS` (OA/SA/LA/PA), layer→view/edit permission mapping,
  `ROLE_PERMISSION_MATRIX`, `permissionsForRole()`, `ProjectRoleDefinition`.
- `domain/services/permissions.ts` *(new)* — pure helpers `can`, `canAny`,
  `canViewLayer`, `canEditLayer`, `filterAssignableRoles`, `pickRole`,
  `resolveProjectAccess`.
- `domain/entities/project.ts` *(rewritten)* — single-role `ProjectMember`,
  `createdById`, requesting user role and permissions; creator = `admin`.

### `project` module (application / infrastructure / presentation)

- `application/ports/project.ts` *(rewritten)* — project responses gain
  `created_by`, `role`, `permissions`; new ports: `getRoles`, `getMembers`,
  `addMember`, `updateMemberRole`, `removeMember`.
- Use-cases: `get-all`, `get-by-id`, `create`, `update` rewritten (no more
  hardcoded OWNER); new `get-roles`, `get-members`, `add-member`,
  `update-member-role`, `remove-member`.
- `infrastructure/remote/project.ts` — new endpoints wired
  (`/api/project-roles`, `/api/projects/{id}/members[/{userId}]`).
- New server actions (same `withAuth` pattern + cache tags) and DTOs
  (`add-member`, `update-member-role`).

### `project` module (ui)

- `ui/types/project.ts` *(rewritten)* — `ProjectView` with `role` +
  `permissions`.
- `ui/components/project-member-role.tsx` — new role labels (i18n).
- `ui/components/project-card.tsx` — role badge; Edit/Delete hidden without
  `editProject` / `deleteProject`.
- Members management: page `dashboard/project/[id]/members` (deep link) backed
  by `ui/components/members-panel.tsx`, which also renders inside
  `ui/components/members-sheet.tsx` — opened in place from the project card
  menu and the workbench toolbar (components `add-member-dialog`,
  `edit-member-role-dialog`, `remove-member-dialog`, gated by `addMembers` /
  `manageMembers`, inviter ceiling applied to the role pickers).
- New ui clients + zod schemas (`ui/schemas/member.ts`).

### `model` module (workbench gating)

- `ui/stores/workbench.ts` — new `projectPermissions` state + `setProjectPermissions`
  setter, plus derived RBAC helpers `canEditLayer(layer)`, `canViewLayer(layer)`
  and `visibleLayers()`.
- `ui/components/workbench/workbench.tsx` + `workbench-view.tsx` — receive
  permissions from the fetched project, seed the store, filter the visible
  layers by `view<Layer>` and fall back to a readable layer.
- `ui/components/workbench/layer-switcher.tsx` — accepts an explicit `layers`
  list so only readable layers are offered.
- `ui/components/diagram-toolbar-actions.tsx` — the destructive delete action is
  hidden when the user lacks `edit<Layer>` for the open diagram layer.
- `ui/components/workbench/palette-panel.tsx` — shows a *Read-only layer* notice
  instead of creation tools when `edit<Layer>` is missing.
- **Fail-open rule:** every client-side check treats an empty permission list as
  "unresolved" and allows the action. The UI is UX only — the Laravel API stays
  the authorization authority (canvas drag & drop and panel-internal mutations
  are not individually gated; the API rejects them with `403`).

### Cleanup

- All `OWNER / EDITOR / VIEWER` remnants removed (entity, use-cases, UI types,
  badge, drizzle `project_members.role` enum, `.ai/modules/project.md`).
- i18n: new `project` section in `messages/en.json` + `messages/fa.json`
  (role names, permission labels, member UI strings).

## 7. Verification

- Vitest unit tests for the permission engine (`can`, layer checks, matrix,
  inviter ceiling, access fallbacks).
- `pnpm lint` (biome) + `pnpm build`.
- Manual flow (Postman): admin vs `project_viewer` vs `oa_editor` — verify
  gating, member management, and 403/409 toasts.
