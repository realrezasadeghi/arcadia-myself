# Arcadia — Roles, Permissions & Access Control Specification

**Document type:** Requirements & Design Specification
**Scope:** Users, Projects, Models, and access control across the Arcadia web MBSE tool
**Status:** Draft v1 — to be reviewed before implementation
**Date:** 2026-06-24
**Related docs:** `PROJECT_REPORT.md`, `MVP_REQUIREMENTS.md`

---

## 1. Purpose & Background

Arcadia is a web-based MBSE (Model-Based Systems Engineering) tool implementing the **ARCADIA method** with four abstraction layers: Operational Analysis (OA), System Analysis (SA), Logical Architecture (LA), and Physical Architecture (PA).

Today the tool already has the *bones* of access control:

- A 3-tier role enum at the project level — `OWNER`, `EDITOR`, `VIEWER`.
- A `Project` aggregate root that manages membership (`addMember`, `changeMemberRole`, `removeMember`) and exposes permission checks (`canEdit`, `canView`, `isOwner`).
- Persistence in `projects` + `project_members` (junction with role) + `users`.

What is missing is the **complete, written contract**: who can do what, how access flows from project → model → diagram → element, and where the rules are enforced. This document defines that contract so it can be implemented consistently and demonstrated to reviewers.

This design deliberately follows the **Team for Capella / Capella Collaboration Manager** philosophy:

> Keep per-project roles coarse, enforce them at the **server boundary** (never trust the client), let project owners **self-manage** membership, and let model/diagram/element access **inherit** from the project.

**Core architectural principle:** Roles and permissions are **completely decoupled** from all business modules. The `access-control` module is self-contained with zero external dependencies, making it future-proof for database-driven roles or external identity providers.

---

## 2. Glossary & Domain Concepts

| Term | Definition |
|------|------------|
| **User** | An authenticated account (`id`, `username`, `email`). The identity principal of every action. |
| **Project** | The top-level container and **security boundary**. Owns models, members, and roles. Aggregate root. |
| **Member** | A user who has been granted a role on a project. Represented by `(projectId, userId, role)`. |
| **Role** | `OWNER` \| `EDITOR` \| `VIEWER` — the access level a member holds on a project. **Defined exclusively in `access-control` module** — no other module defines or re-exports this type. |
| **Model** | An architecture model bound to **one project** and **one layer** (OA/SA/LA/PA). Inherits the project's access. |
| **Element** | A node inside a model (Function, Component, Actor, Entity, …). |
| **Relationship** | A same-layer connection between two elements. |
| **Diagram** | A visual layout of elements/relationships within a model. |
| **Trace Link** | A cross-layer link between elements (Realization, Allocation, Deployment, …). Belongs to a project. |
| **Permission** | The right to perform a specific action (e.g. `model:edit`). Derived from role, never stored per-user. |
| **Workbench** | The main editor UI (Explorer + Canvas + Palette + Properties). Entered only by project members. |

**Access boundary rule:** *The Project is the only security boundary.* Everything below it (models, elements, relationships, diagrams, trace links) inherits the caller's role on the owning project. There is **no** per-model or per-element ACL in this design (matches Capella's repository-level model).

---

## 3. Actors & Roles

### 3.1 System-level actors

| Actor | Description |
|-------|-------------|
| **Guest / Anonymous** | Not authenticated. Can only see public marketing pages (landing, about) and the login/register screens. |
| **Authenticated User** | Logged in. Can create projects and is a candidate to be invited to others' projects. |
| **(Future) System Administrator** | Platform-wide admin for user management/governance. *Out of MVP scope — see §11.* |

### 3.2 Project-level roles (RBAC)

The `Role` type is defined **exclusively inside the `access-control` module** (`access-control/domain/role.ts`). This is the **single source of truth** for what roles exist in the system.

**Critical architectural rule — no exceptions:**
- `access-control` defines `Role` with **zero imports** from any other module
- **No other module defines, re-exports, or creates a type alias for roles** — no `ProjectRole`, no `UserRole`, no `MemberRole`
- The `project` module stores role as a **plain string** in `project_members.role` — it never references the `Role` type directly
- At the adapter boundary, the string is validated against allowed values and cast to `Role`
- **If roles move to a database in the future, only `access-control/domain/role.ts` and the adapter change** — zero cascade across the codebase

This decoupling ensures the access-control module can evolve independently (dynamic roles, database-driven, external providers) without touching any business module.

Roles are **per project**. The same user can be OWNER of project A and VIEWER of project B.

| Role | Intent | Capella analog |
|------|--------|----------------|
| **OWNER** | Full control: project settings, membership, all model editing, deletion. Exactly **one** per project (the creator). | Project Administrator |
| **EDITOR** | Can read and modify all models/diagrams/elements, but **cannot** manage membership, rename/delete the project, or change roles. | User (read & write) |
| **VIEWER** | Read-only across the whole project and its models. Cannot mutate anything. | Read-only user |

**Role invariants (already partly enforced in `Project`):**

1. A project has **exactly one OWNER** at all times.
2. The OWNER is set automatically to the project creator and **cannot be removed**.
3. The OWNER's role **cannot be changed** (no demotion of the owner).
4. A user can hold **at most one role** per project (composite PK `(projectId, userId)`).
5. Only OWNER may add/remove members or change roles.
6. (Future) Ownership **transfer** is an explicit OWNER-only action — not in MVP.

---

## 4. Permission Model

### 4.1 Permission catalog

Permissions are named `resource:action`. They are **computed from role**, not persisted.

| Permission | OWNER | EDITOR | VIEWER |
|------------|:-----:|:------:|:------:|
| `project:view` | ✅ | ✅ | ✅ |
| `project:rename` / `project:update` | ✅ | ❌ | ❌ |
| `project:delete` | ✅ | ❌ | ❌ |
| `project:transfer-ownership` *(future)* | ✅ | ❌ | ❌ |
| `member:invite` / `member:add` | ✅ | ❌ | ❌ |
| `member:change-role` | ✅ | ❌ | ❌ |
| `member:remove` | ✅ | ❌ | ❌ |
| `member:list` | ✅ | ✅ | ✅ |
| `model:view` | ✅ | ✅ | ✅ |
| `model:create` | ✅ | ✅ | ❌ |
| `model:update` | ✅ | ✅ | ❌ |
| `model:delete` | ✅ | ✅ | ❌ |
| `element:view` | ✅ | ✅ | ✅ |
| `element:create` / `update` / `delete` | ✅ | ✅ | ❌ |
| `relationship:create` / `update` / `delete` | ✅ | ✅ | ❌ |
| `diagram:view` | ✅ | ✅ | ✅ |
| `diagram:create` / `update` / `delete` | ✅ | ✅ | ❌ |
| `diagram:update-layout` | ✅ | ✅ | ❌ |
| `tracelink:view` | ✅ | ✅ | ✅ |
| `tracelink:create` / `update` / `delete` | ✅ | ✅ | ❌ |
| `model:validate` | ✅ | ✅ | ✅ |
| `model:transition` (layer transition) | ✅ | ✅ | ❌ |
| `diagram:export` | ✅ | ✅ | ✅ |

**Rules of thumb:**
- **VIEWER** = every `*:view`, `*:list`, `validate`, and `export`. Nothing that writes.
- **EDITOR** = VIEWER + every model-content write (`model/element/relationship/diagram/tracelink/transition`).
- **OWNER** = EDITOR + project lifecycle + membership management.

### 4.2 Permission resolution algorithm

```
authorize(userId, permission, projectId):
  1. role = membershipRepo.getRole(projectId, userId)
  2. if role is null            -> DENY  (not a member)
  3. if PERMISSION_MATRIX[role] contains permission -> ALLOW
  4. else                        -> DENY
```

For a resource below the project (model/element/diagram/trace link):

```
authorizeResource(userId, permission, modelId):
  projectId = modelRepo.getProjectId(modelId)   // resolve owning project
  return authorize(userId, permission, projectId)
```

This single funnel is the heart of the spec — **every** server action calls it before touching data.

---

## 5. Business Flows

Narrative end-to-end flows. Each references the use cases in §6.

### 5.1 Onboarding & first project

1. Guest opens landing page → clicks **Register**.
2. User registers (`username`, `email`, `password`) → account created → JWT issued (UC-01).
3. User logs in → lands on **Project List** (only projects they are a member of) (UC-02, UC-10).
4. User clicks **New Project** → enters name + description → project created; creator auto-becomes **OWNER** (UC-11).
5. User opens the project → enters the **Workbench** (UC-20).

### 5.2 Building a model (single user)

1. OWNER/EDITOR selects a layer (OA/SA/LA/PA) in the Layer Switcher.
2. Creates a **Model** for that layer if none exists (UC-30).
3. Adds **Elements** from the Palette onto the Canvas (UC-32).
4. Connects elements with **Relationships** (same-layer) (UC-34).
5. Creates/edits **Diagrams**; drags nodes; layout auto-saves (UC-36, UC-37).
6. Runs **Validation**; fixes flagged issues (UC-40).
7. Runs the **Transition Wizard** OA→SA→LA→PA to seed the next layer + trace links (UC-42).

### 5.3 Collaboration (multi-user) — the core access-control flow

1. **OWNER** opens **Project → Members** (UC-12).
2. OWNER invites a user by `username`/`email`, choosing a role **EDITOR** or **VIEWER** (UC-13).
   - *(MVP simplification: direct add. Future: pending-invitation + accept — see §11.)*
3. Invited user now sees the project in their **Project List** (UC-10).
4. **EDITOR** opens the Workbench and can modify models exactly like the owner, but the **Members** management UI and project **Settings/Delete** are hidden/disabled (UC-20, frontend gating §8).
5. **VIEWER** opens the Workbench in **read-only** mode: Palette add buttons, Properties edit fields, context-menu mutations, transition, and connect are all disabled; validation and export remain available (UC-21).
6. OWNER may **change a member's role** (e.g. promote VIEWER→EDITOR) or **remove** a member at any time (UC-14, UC-15). Effect is immediate on the member's next action (server re-checks every call).

### 5.4 Authorization-failure flow (defense in depth)

1. A VIEWER (or a removed member) crafts/replays a write request directly to a server action.
2. The server action calls `authorizeResource(...)` → role missing or lacks permission → returns a typed **`ForbiddenError`** (HTTP 403 semantics), performs **no** mutation.
3. UI surfaces a toast: *"You don't have permission to do this."*
4. The attempt is written to the **audit log** (§9) as a denied action.

---

## 6. Use Cases

Format: **ID — Name** · Actor(s) · Pre-conditions · Main flow · Post-conditions · Authorization.

### Auth & Identity

**UC-01 — Register**
- Actor: Guest
- Pre: Not authenticated; username/email unique.
- Flow: Submit form → validate → create user → issue JWT.
- Post: Authenticated session.
- Authz: none (public).

**UC-02 — Login**
- Actor: Guest
- Pre: Account exists.
- Flow: Submit credentials → verify → issue JWT (cookie).
- Post: Authenticated session.
- Authz: none (public).

**UC-03 — Get current user (`get-me`)**
- Actor: Authenticated User
- Flow: Read JWT → return profile.
- Authz: valid session required.

**UC-04 — Logout**
- Actor: Authenticated User
- Flow: Clear session cookie.

### Project lifecycle

**UC-10 — List my projects**
- Actor: Authenticated User
- Flow: Return projects where the user is a member (any role).
- Authz: membership filter — **never** list projects the user has no role on.

**UC-11 — Create project**
- Actor: Authenticated User
- Flow: Provide name + description → create project → add creator as **OWNER**.
- Post: Project exists with one OWNER member.
- Authz: any authenticated user.

**UC-12 — View project / open members list**
- Actor: OWNER, EDITOR, VIEWER
- Authz: `project:view` / `member:list`.

**UC-13 — Add / invite member**
- Actor: OWNER
- Pre: Target user exists; not already a member.
- Flow: Choose user + role (EDITOR/VIEWER) → add member.
- Authz: `member:invite`. Cannot grant OWNER.

**UC-14 — Change member role**
- Actor: OWNER
- Pre: Target is a member, not the owner.
- Flow: Select new role (EDITOR/VIEWER) → update.
- Authz: `member:change-role`. **Cannot** change the OWNER's role.

**UC-15 — Remove member**
- Actor: OWNER
- Pre: Target is a member, not the owner.
- Authz: `member:remove`. **Cannot** remove the OWNER.

**UC-16 — Update project (rename / description)**
- Actor: OWNER
- Authz: `project:update`.

**UC-17 — Delete project**
- Actor: OWNER
- Flow: Cascade-delete models, elements, relationships, diagrams, trace links, members.
- Authz: `project:delete`.

### Workbench access

**UC-20 — Enter workbench (edit-capable)**
- Actor: OWNER, EDITOR
- Flow: Open project → load layers/models/diagrams → full editing UI.
- Authz: `model:view` + write permissions enable edit affordances.

**UC-21 — Enter workbench (read-only)**
- Actor: VIEWER
- Flow: Same load, but all write affordances disabled.
- Authz: `model:view` only.

### Model content (all require an owning project resolved from `modelId`)

**UC-30 — Create model (layer)** · OWNER/EDITOR · `model:create`
**UC-31 — Update / delete model** · OWNER/EDITOR · `model:update` / `model:delete`
**UC-32 — Create element** · OWNER/EDITOR · `element:create`
**UC-33 — Update / delete element** · OWNER/EDITOR · `element:update` / `element:delete`
**UC-34 — Connect elements (relationship)** · OWNER/EDITOR · `relationship:create` (subject to `ConnectionPolicy`)
**UC-35 — Update / delete relationship** · OWNER/EDITOR
**UC-36 — Create / update / delete diagram** · OWNER/EDITOR · `diagram:*`
**UC-37 — Update diagram layout (drag/auto-save)** · OWNER/EDITOR · `diagram:update-layout`
**UC-38 — View model / elements / diagrams** · all roles · `*:view`

### Cross-layer & analysis

**UC-40 — Validate model** · all roles (read-only analysis) · `model:validate`
**UC-41 — View trace links** · all roles · `tracelink:view`
**UC-42 — Run transition wizard (layer→layer)** · OWNER/EDITOR · `model:transition` (creates elements + trace links)
**UC-43 — Create / delete trace link** · OWNER/EDITOR · `tracelink:create` / `delete`
**UC-44 — Export diagram (JSON/PDF)** · all roles · `diagram:export`

---

## 7. Domain Model

### 7.1 Aggregates & boundaries

```
┌─────────────────────────────────────────────────────────┐
│ Project  (Aggregate Root — the security boundary)        │
│  - id, name, description, ownerId                         │
│  - members: Map<userId, { userId, role, joinedAt }>      │
│  - invariants: exactly 1 OWNER, owner immutable,         │
│    one role per user                                     │
│  - methods: addMember, changeMemberRole, removeMember,   │
│             rename, updateDescription                    │
│  - queries: canEdit, canView, isOwner, getMemberRole     │
└───────────────┬─────────────────────────────────────────┘
                │ owns (by projectId, inherits access)
   ┌────────────┼─────────────────────────────┐
   ▼            ▼                              ▼
 Model        TraceLink                      (members → User)
  - layer      - source/target model+element
  - elements   - cross-layer type
  - relationships
  - diagrams
```

- **Project** is the consistency + security boundary. Membership/role changes go **only** through its methods.
- **Model, Element, Relationship, Diagram, TraceLink** are separate aggregates persisted by `projectId`/`modelId`; they hold **no** access data — authorization is always resolved up to the owning Project.
- **User** is referenced by id from Project membership; it is its own aggregate in the auth module.

### 7.2 Key invariants (authoritative list)

1. Project always has exactly one OWNER (creator).
2. OWNER cannot be removed or demoted.
3. `addMember`/`changeMemberRole` may only assign EDITOR or VIEWER (never OWNER).
4. A user appears at most once in a project's member set.
5. A Model belongs to exactly one Project and one Layer.
6. Authorization for any sub-resource = role on the resolved owning Project.

### 7.3 ⚠️ Required domain fix — identifier type consistency

There is a current inconsistency that **must** be resolved before implementing enforcement:

| Place | Current type |
|-------|--------------|
| `users.id`, `projects.owner_id` (DB) | `uuid` (string) |
| `ProjectMember.userId` (domain) | `number` |
| `Project.canEdit(userId: string)` | string |
| `Project.isOwner(userId: number)` | number |
| member map key | `userId.toString()` |

A string UUID will never `===` a numeric owner id, so `isOwner` / role lookups can silently fail.

**Decision (required): standardize on `string` (UUID) end-to-end** — domain, DTOs, server actions, JWT extraction (`extractUserIdFromJwt`), and DB. This is a prerequisite for §4 to work correctly.

---

## 8. Authorization Enforcement (where the rules live)

Defense in depth — **three** layers, but the server is the source of truth:

### 8.1 Server boundary (authoritative — MUST)

- Introduce a single **authorization service**: `assertPermission(userId, permission, { projectId | modelId })`.
- **Every** server action that mutates or reads project-scoped data calls it **first**, resolving the owning project from the resource id when needed.
- On failure → throw typed `ForbiddenError` (no partial writes). On missing session → `UnauthorizedError`.
- `userId` is taken from the **verified JWT**, never from client input.

### 8.2 Domain (invariants — already present)

- `Project.canEdit/canView/isOwner` + membership methods continue to guard state transitions. The authorization service is built on top of these, not instead of them.

### 8.3 Frontend (affordances — defense in depth, NOT security)

- Compute the caller's role once on workbench load; expose it via context/store.
- VIEWER: hide/disable Palette add, Properties edit, context-menu create/rename/delete, Connect, Transition; keep Validate/Export.
- EDITOR: as VIEWER-write enabled, but hide project **Members**, **Settings**, **Delete**.
- OWNER: everything.
- UI gating is **never** a substitute for §8.1 — it only improves UX.

### 8.4 Use-case level enforcement (business rules, NOT presentation)

**Authorization is a business rule, not a UI concern.** All access checks must happen in the **use-case / application layer**, before any presentation logic.

| Layer | Responsibility | Example |
|-------|----------------|---------|
| **Use-case / Application** | Call `assertPermission()` as the **first action** before any business logic | `CreateModelUseCase.execute(userId, input)` calls `assertPermission(userId, "model:create", { projectId })` before creating the model |
| **Presentation / Server Action** | Extract `userId` from JWT, pass to use-case, handle errors | Server action calls the use-case; catches `ForbiddenError` and returns 403 response |
| **Frontend UI** | Hide/disable affordances based on role (UX only, **never** security) | Palette buttons hidden for VIEWER |

**Rule:** The presentation layer **never** decides what a user can or cannot do. It only:
1. Extracts identity from JWT
2. Calls the use-case
3. Handles success/error responses

The use-case **always** calls `assertPermission()` as its first operation. This ensures:
- Business logic is protected regardless of entry point (API, CLI, future integrations)
- Authorization rules live with the business logic, not scattered across controllers
- The same use-case works identically regardless of how it's invoked

**Example flow:**
```
Server Action (presentation)
  └── extracts userId from JWT
  └── calls CreateModelUseCase.execute(userId, input)
        └── assertPermission(userId, "model:create", { projectId })  ← authorization HERE
        └── business logic (validate, create, persist)
  └── handles ForbiddenError → 403 response
```

### 8.4 Bounded-context design — a separate `access-control` module

**Decision:** Authorization is implemented as its **own bounded context** (`src/modules/access-control/`). It is **not** built inside the `project` module and **not** inside `model`. The reasoning:

There are two different things often lumped together as "roles & permissions," and they belong in different places:

| Concept | Example | Nature | Home |
|---------|---------|--------|------|
| **Role assignment (membership)** | "User U is `EDITOR` on project P" | A **core invariant** of a project (one OWNER, owner immutable, one role/user) | Stays **inside the `project` aggregate** — it already lives there |
| **Policy decision (permission)** | "`EDITOR` ⇒ `model:update` = allowed" | A **generic, project-agnostic** rule mapping | The new **`access-control`** module (generic supporting subdomain) |

### 8.5 Zero-dependency design — roles & permissions are self-contained

The `access-control` module is **completely self-contained** with **zero imports** from any other module. This is a deliberate architectural decision — roles and permissions must be fully independent so they can evolve (e.g., move to database) without any cascade changes.

| Principle | Why |
|-----------|-----|
| `access-control` defines its own `Role` type | The **only** place `Role` exists as a type. No `ProjectRole` anywhere else. If roles move to DB, only this module changes. |
| `access-control` owns the `Permission` catalog | The full `resource:action` namespace lives here. |
| `access-control` owns the `Role→Permission` map | The matrix is pure data, no I/O, no external types. |
| `access-control` owns the policy evaluator | `can(role, permission)` is a pure function. |
| `access-control` owns `assertPermission()` | The enforcement funnel. Receives role data via injected port, never imports project/model. |
| Other modules depend on `access-control` | `project` and `model` call `assertPermission()`. They import `access-control`, never the reverse. |
| **Zero reverse dependencies** | `access-control` never imports from `project`, `model`, `auth`, or any other module. It receives data only through injected ports. |

**Future-proofing:** If roles become database-driven, only `access-control/domain/role.ts` changes from a union type to a DB lookup. The port interface, permission map, and evaluator remain identical.

**Dependency direction (arrows point inward):**

```
┌──────────────┐                         ┌──────────────────────────┐
│   auth       │ ── userId (from JWT) ──► │  access-control  (NEW)   │
│ (Identity)   │                          │  ZERO external imports   │
└──────────────┘                          │  - Role (own type)       │
                                          │  - Permission catalog    │
┌──────────────┐  getRole(projectId,userId)│  - Role→Permission map   │
│   project     │ ◄── port (injected) ───►│  - PolicyEvaluator       │
│ owns Members  │                          │  - assertPermission()    │
│ stores role   │                          │  - Forbidden/Unauth err  │
│ as string     │                          └────────────▲─────────────┘
└──────┬────────┘                                       │
       │ owns (projectId)                               │
       ▼                                                │
┌──────────────┐  resolve modelId → projectId → role    │
│   model       │ ───────────────────────────────────────┘
│ (protected)   │  via IAccessQuery port (injected)
└──────────────┘
```

- **`access-control`** knows the **rules** (role → permissions) and nothing about your data — pure and unit-testable.
- **`project`** remains the owner of **who has which role** (existing `Project` aggregate). It stores role as a **plain string** that matches `access-control`'s `Role` type — no type dependency.
- **`model`** is just a *protected resource*: it never imports `Project`; it asks "what is this user's role on the owning project?" through an **injected port**.
- **`access-control`** reaches role data through `IAccessQuery` port — an interface it defines, implemented by an adapter in `project`'s infrastructure. The port returns `Role` (access-control's own type).

### 8.6 Module skeleton

```
src/modules/access-control/
├── domain/
│   ├── role.ts                  # type Role = "OWNER" | "EDITOR" | "VIEWER"  (own type, NOT imported from project)
│   ├── permission.ts            # type Permission = "model:update" | "member:invite" | ...  (the catalog, §4.1)
│   ├── role-permission-map.ts   # Record<Role, ReadonlySet<Permission>>  (the matrix, §4.1)
│   └── policy-evaluator.ts      # can(role, permission): boolean   ← pure function, no I/O
├── application/
│   ├── ports/
│   │   └── access-query.port.ts # IAccessQuery: getRole(projectId,userId), getProjectIdByModelId(modelId)
│   └── authorization.service.ts # assertPermission(userId, permission, { projectId | modelId })
├── infrastructure/
│   └── adapters/
│       └── project-access.adapter.ts  # ACL: implements IAccessQuery by reading project_members
└── presentation/
    └── errors.ts                # ForbiddenError (403), UnauthorizedError (401)
```

**Key design rule:** The `Role` type is defined **exclusively inside** `access-control`. The `project` module stores role as a plain string in `project_members.role`. At the adapter boundary, the string is validated and cast to `Role`. This means:
- If roles become dynamic (DB-driven), only `access-control/domain/role.ts` and the adapter change.
- No other module needs to know what roles exist.
- **`project` module has no `ProjectRole` type** — it uses only plain strings for storage and passes them to the adapter.

### 8.7 Key contracts

**Role type (self-contained in access-control — the ONLY definition):**

```ts
// access-control/domain/role.ts
// This is the SINGLE source of truth for roles in the entire system
// No other module defines, re-exports, or creates aliases for this type
export type Role = "OWNER" | "EDITOR" | "VIEWER";
```

**Port (access-control defines the interface it needs — project implements it):**

```ts
// access-control/application/ports/access-query.port.ts
// access-control receives role data through this port — never imports project/model
export interface IAccessQuery {
  getRole(projectId: string, userId: string): Promise<Role | null>;
  getProjectIdByModelId(modelId: string): Promise<string | null>;
}
```

**The single enforcement funnel every server action calls:**

```ts
// access-control/application/authorization.service.ts
export async function assertPermission(
  userId: string,
  permission: Permission,
  target: { projectId: string } | { modelId: string },
): Promise<void> {
  const projectId =
    "projectId" in target
      ? target.projectId
      : await accessQuery.getProjectIdByModelId(target.modelId);

  if (!projectId) throw new ForbiddenError();
  const role = await accessQuery.getRole(projectId, userId);
  if (!role) throw new ForbiddenError();                       // not a member
  if (!can(role, permission)) throw new ForbiddenError();      // role lacks permission
}
```

**Usage at the boundary — one line at the top of each server action:**

```ts
await assertPermission(userId, "model:update", { modelId });   // model module
await assertPermission(userId, "member:invite", { projectId }); // project module
```

### 8.8 Why this split (benefits)

1. **Membership invariants stay in the aggregate that owns them** — `Project` is not weakened or split.
2. **The matrix is pure and testable in isolation** — `can(role, permission)` needs no DB; ideal for unit tests/demo.
3. **`model` never depends on `project`** — the boundary holds via port + ACL adapter.
4. **Enforcement is a single funnel** — the audit log (§9) and error semantics hook in one place.
5. **Roles are fully decoupled** — if roles move to DB, only `access-control` changes. No cascade across modules.
6. **Zero reverse dependencies** — `access-control` is completely self-contained, importable by any module without coupling.
7. **Authorization lives in business logic** — use-cases call `assertPermission()` as their first action, not presentation layers.
8. Mirrors the **Capella** model: rules are central, the project owns membership, the boundary enforces.

### 8.9 Prerequisites before implementing this module

1. **Unify `userId` to `string` (UUID) end-to-end** (§7.3) — `assertPermission` and `getRole` assume a single id type.
2. **Add `models.project_id → projects.id` FK** (§10) — `getProjectIdByModelId` must be reliable.
3. Expose a **read-only role lookup** from the `project` module (repository method on `project_members`) for the ACL adapter to call.
4. **Remove any `ProjectRole` type** from the `project` module — project uses only plain strings for role storage.

---

## 9. Cross-Cutting Requirements

| Area | Requirement |
|------|-------------|
| **Authentication** | JWT (current). Future: OIDC/OAuth2 to mirror Team for Capella. Session id is the only trusted source of `userId`. |
| **Audit log** | Record membership changes (add/role-change/remove), project create/delete, and **denied** authorization attempts: `(actorId, action, target, projectId, timestamp, result)`. |
| **Error semantics** | `UnauthorizedError` (401 — no/invalid session) vs `ForbiddenError` (403 — authenticated but lacks permission). Distinct, typed. |
| **List scoping** | All list endpoints filter by membership; a user must never see metadata of projects they aren't a member of. |
| **Atomicity** | Membership and cascade operations are transactional; the layer-transition action must be atomic (no orphaned elements — see `MVP_REQUIREMENTS.md` 16.2). |
| **i18n** | All permission/error messages localized (EN/FA), consistent with next-intl setup. |
| **Performance** | Role lookup is a single indexed read on `project_members (project_id, user_id)`; cache per-request. |

---

## 10. Data Model Impact

Existing tables are largely sufficient:

- `users (id uuid, username, email, password_hash, …)` — ✅
- `projects (id, name, description, owner_id, …)` — ✅
- `project_members (project_id, user_id, role, joined_at)` — ✅ composite PK `(project_id, user_id)`.

**Changes required:**

1. **Type unification** — make `project_members.user_id` and all domain `userId` consistent UUID (§7.3).
2. **FK integrity** — add FKs `project_members.project_id → projects.id` and `project_members.user_id → users.id` (currently relations only).
3. **`models.project_id` FK → `projects.id`** (currently a bare field) so resource→project resolution is reliable.
4. **(New) `audit_log`** table per §9.
5. **(Future) `project_invitations`** table for pending invites (§11).

---

## 11. Out of Scope / Future Decisions

| Topic | Decision needed |
|-------|-----------------|
| **System Administrator** role | Platform-wide governance/user admin (Capella's "System Administrator"). Deferred. |
| **Invitation + accept flow** | MVP does direct add; future adds pending invite via email/username + accept. |
| **Ownership transfer** | OWNER-only transfer to another member; deferred. |
| **Fine-grained / per-model ACL** | Intentionally **not** in scope — Project is the only boundary (matches Capella). |
| **Element-level locking / concurrency** | Capella uses pessimistic per-element locks for simultaneous editing. Deferred; current model is last-write-wins with auto-save. |
| **Public/shared read links** | Capella "Publication" style read-only sharing. Deferred. |
| **Teams / organizations** | Grouping projects under an org. Deferred. |

---

## 12. Acceptance Criteria (for this spec to be "done")

1. Every mutating/reading server action enforces §4 via the §8.1 authorization service.
2. A VIEWER cannot mutate any resource via UI **or** direct server-action call (returns `ForbiddenError`).
3. A non-member cannot view or list a project or any of its models.
4. Only the OWNER can add/remove members, change roles, rename, or delete the project.
5. OWNER cannot be removed or demoted; every project has exactly one OWNER.
6. Identifier types are unified to UUID end-to-end (§7.3) with passing type-checks.
7. Membership changes and denied attempts appear in the audit log.
8. Workbench renders correct affordances per role (OWNER/EDITOR/VIEWER).
9. Authorization lives in a standalone `access-control` module (§8.4–8.10); the `model` module does **not** import `project` internals (access is reached only through `IProjectAccessQuery`).
10. `can(role, permission)` is covered by isolated unit tests (no DB) proving the full §4.1 matrix.
11. **No `ProjectRole` type exists anywhere** — `access-control` is the sole owner of the `Role` type; other modules use only plain strings.
12. **All authorization checks happen in use-cases** (§8.4), not in presentation/server-action layer — server actions only extract identity and delegate to use-cases.
13. **`access-control` has zero imports** from any other module — fully self-contained and future-proof for database-driven roles.

---

*Specification authored for the Arcadia project. Implementation should proceed only after the §7.3 identifier decision and §10 schema changes are agreed.*
