# Arcadia — Full Project Report

**Date:** 2026-06-20  
**Path:** `/Users/rezasadeghi/Projects/NextJs/arcadia`

---

## 1. Overview

**Arcadia** is a web-based architecture modeling tool implementing the **ARCADIA methodology** (Architecture Analysis and Design Integrated Approach) — a systems engineering framework with four abstraction layers. The application allows users to create, manage, and visualize architectural models across these layers.

---

## 2. Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16.2.6 (App Router) |
| Language | TypeScript 5 |
| React | React 19.2.4 |
| Styling | Tailwind CSS v4 |
| UI Components | Shadcn | Radix UI, Lucide React, CVA, Tailwind Merge |
| State Management | Zustand 5, React Query (TanStack Query 5) |
| Forms | React Hook Form + Zod 4 |
| Database | PostgreSQL 16 (Docker) |
| ORM | Drizzle ORM 0.45 |
| i18n | next-intl 4 (English + Persian/Farsi) |
| Diagramming | @xyflow/react 12 (React Flow) |
| Linter/Formatter | Biome 2.2 |
| Build | pnpm, React Compiler (babel-plugin-react-compiler) |

---

## 3. Architecture

### 3.1 Clean Architecture / DDD

The project follows **Domain-Driven Design (DDD)** with a **Hexagonal/Clean Architecture** structure. The `src/modules/` directory is organized into layers:

```
src/modules/
├── shared/           # Shared domain primitives
│   └── domain/
│       ├── entity.ts          # Entity base class (identity + equality)
│       ├── aggregate-root.ts  # AggregateRoot with domain events
│       ├── value-object.ts    # ValueObject base class
│       ├── event.ts           # DomainEvent interface
│       └── error.ts           # Domain error types
│
└── model/            # Core business module
    ├── domain/
    │   ├── entities/          # Domain entities
    │   ├── value-objects/     # Value objects
    │   ├── policies/          # Business rules / invariants
    │   └── types/             # TypeScript type definitions
    │
    ├── application/
    │   └── ports/             # Repository interfaces (ports)
    │
    ├── infrastructure/
    │   └── persistence/
    │       └── drizzle/       # Drizzle ORM implementation
    │           ├── client/    # Database client
    │           ├── schemas/   # Table definitions
    │           └── repositories/  # Repository implementations
    │
    └── presentation/
        ├── server-actions/    # Next.js Server Actions
        ├── dtos/              # Data Transfer Objects
        └── config/            # Visual config (planned)
```

### 3.2 Layer Responsibilities

| Layer | Responsibility |
|---|---|
| **domain** | Entities, value objects, business rules, invariants |
| **application** | Port interfaces (repository contracts) |
| **infrastructure** | Drizzle ORM schemas, repository implementations |
| **presentation** | Server Actions, DTOs, UI components |

---

## 4. Domain Model

### 4.1 Arcadia Layers (4 Abstraction Levels)

| Code | Name (EN) | Name (FA) | Order |
|---|---|---|---|
| OA | Operational Analysis | تحلیل عملیاتی | 1 |
| SA | System Analysis | تحلیل سیستم | 2 |
| LA | Logical Architecture | معماری منطقی | 3 |
| PA | Physical Architecture | معماری فیزیکی | 4 |

### 4.2 Entities

#### Model (`domain/entities/model.ts`)
Represents an architecture model at a specific layer within a project.
- **Properties:** projectId, layer, name, description, createdAt, updatedAt
- **Business Rules:** Name required, one model per layer per project

#### ModelElement (`domain/entities/element.ts`)
An element within a model (e.g., Mission, System, LogicalComponent).
- **Properties:** modelId, layer, type, name, description, properties, parentId, status
- **Status:** DRAFT → VALIDATED → DEPRECATED
- **Hierarchy:** parentId supports tree structure (root elements + children)
- **Business Rules:** Element type must match layer, name required

#### Relationship (`domain/entities/relationship.ts`)
A connection between two elements within the same model.
- **Properties:** modelId, type, sourceElementId, targetElementId, name, description, properties
- **Exchange Kinds:** FLOW, EVENT, OPERATION

#### Diagram (`domain/entities/diagram.ts`)
A visual representation/layout of elements.
- **Properties:** modelId, type, name, description, viewport, elementLayouts
- **Layout:** Each element has position + size within the diagram

#### TraceLink (`domain/entities/trace-link.ts`)
Cross-layer traceability links between elements.
- **Properties:** projectId, sourceModelId, targetModelId, type, sourceElementId, sourceLayer, targetElementId, targetLayer
- **Types:** Realization, Allocation, Deployment, Involvement, Refinement

### 4.3 Value Objects

| Value Object | Values |
|---|---|
| Layer | OA, SA, LA, PA |
| ElementType | 20+ types across all layers (Mission, System, LogicalComponent, PhysicalNode, etc.) |
| RelationshipType | 12 types (OperationalExchange, FunctionalExchange, Composition, etc.) |
| TraceLinkType | 5 types (Realization, Allocation, Deployment, Involvement, Refinement) |
| DiagramType | (defined in diagram-type.ts) |

### 4.4 Element Types by Layer

| Layer | Element Types |
|---|---|
| OA | Mission, OperationalEntity, OperationalActor, OperationalActivity, OperationalCapability, OperationalProcess |
| SA | System, SystemActor, SystemFunction, SystemCapability, SystemComponent, FunctionPort |
| LA | LogicalComponent, LogicalActor, LogicalFunction, FunctionPort |
| PA | PhysicalComponent, PhysicalNode, PhysicalFunction, PhysicalActor, FunctionPort |

---

## 5. Database Schema

PostgreSQL 16 via Drizzle ORM. Tables:

| Table | Key Columns |
|---|---|
| `models` | id (uuid), project_id, layer, name, description |
| `elements` | id (uuid), model_id (FK→models), layer, type, name, description, properties (jsonb), parent_id |
| `relationships` | (defined in schemas/relationship.ts) |
| `trace_links` | (defined in schemas/trace-link.ts) |
| `diagrams` | (defined in schemas/diagram.ts) |

**Connection:** PostgreSQL on port 5433 (Docker), user: `user`, password: `1234`, db: `mydatabase`

---

## 6. Server Actions (API Layer)

20+ server actions in `src/modules/model/presentation/server-actions/`:

| Action | Description |
|---|---|
| `create-model` | Create a new architecture model |
| `update-model` | Update model properties |
| `remove-model` | Delete a model |
| `get-model-by-id` | Fetch single model |
| `get-models-by-project-id` | List models for a project |
| `create-element` | Add element to a model |
| `update-element` | Update element properties |
| `remove-element` | Delete an element |
| `get-element-by-id` | Fetch single element |
| `get-elements-by-model-id` | List elements in a model |
| `connect-elements` | Create relationship between elements |
| `update-relationship` | Update a relationship |
| `remove-relationship` | Delete a relationship |
| `get-relationships-by-model-id` | List relationships in a model |
| `create-diagram` | Create a new diagram |
| `update-diagram` | Update diagram properties |
| `remove-diagram` | Delete a diagram |
| `get-diagram-by-id` | Fetch single diagram |
| `get-diagrams-by-model-id` | List diagrams for a model |
| `update-diagram-layout` | Update element positions in diagram |
| `create-trace-link` | Create cross-layer trace link |
| `update-trace-link` | Update a trace link |
| `remove-trace-link` | Delete a trace link |
| `get-trace-links-by-project-id` | List all trace links for a project |
| `get-trace-links-by-element-id` | List trace links for an element |
| `get-element-relations` | Get all relations for an element |
| `validate-model` | Validate model against business rules |
| `transition-layer` | Transition between layers |

---

## 7. Frontend

### 7.1 Routing (App Router with i18n)

```
src/app/[locale]/
├── layout.tsx              # Root layout (providers, themes, i18n)
├── page.tsx                # Landing page / marketing
└── dashboard/
    ├── layout.tsx          # Dashboard layout
    └── project/
        ├── page.tsx        # Project list
        └── [id]/
            ├── layout.tsx  # Project detail layout
            └── page.tsx    # Project detail
```

### 7.2 Providers

- **NextIntlClientProvider** — i18n (English + Persian)
- **DirectionProvider** — RTL/LTR support
- **ThemeProvider** — Dark/light mode (next-themes)
- **ConfirmProvider** — Confirmation dialogs
- **QueryProvider** — TanStack Query (React Query)

### 7.3 Landing Page Features

- Hero section with Arcadia branding
- 4 Arcadia layer cards (OA, SA, LA, PA) with color coding
- Feature highlights (Arcadia Layers, Traceability, Validation, Collaboration)
- CTA section
- Language switcher (EN/FA)
- Theme toggle (dark/light)

### 7.4 Diagram Support

Uses **@xyflow/react** (React Flow) for visual diagram rendering with:
- Viewport management (x, y, zoom)
- Element positioning and layout persistence
- Drag-and-drop element placement

---

## 8. Internationalization

- **Languages:** English (en), Persian/Farsi (fa)
- **RTL Support:** Full right-to-left layout for Persian
- **Fonts:** Inter (EN), Vazirmatn (FA)
- **Messages:** `src/messages/en.json`, `src/messages/fa.json`

---

## 9. Scripts

| Script | Command |
|---|---|
| `dev` | `next dev` |
| `build` | `next build` |
| `start` | `next start` |
| `lint` | `biome check` |
| `format` | `biome format --write` |
| `db:generate` | `drizzle-kit generate` |
| `db:migrate` | `drizzle-kit migrate` |
| `db:push` | `drizzle-kit push` |
| `db:studio` | `drizzle-kit studio` |

---

## 10. Project Structure Summary

```
arcadia/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── i18n/                   # Internationalization config
│   ├── messages/               # Translation files (en, fa)
│   ├── modules/
│   │   ├── shared/             # Shared DDD primitives
│   │   └── model/              # Core model module
│   │       ├── domain/         # Entities, value objects, policies
│   │       ├── application/    # Ports (repository interfaces)
│   │       ├── infrastructure/ # Drizzle ORM implementation
│   │       └── presentation/   # Server actions, DTOs
│   └── proxy.ts
├── drizzle/                    # Database migrations
├── public/                     # Static assets
├── docker-compose.yml          # PostgreSQL container
├── drizzle.config.ts           # Drizzle config
├── biome.json                  # Linter config
├── next.config.ts              # Next.js config
├── tailwind.config.ts          # (via postcss)
├── tsconfig.json
└── package.json
```

---

## 11. Key Design Decisions

1. **DDD with Hexagonal Architecture** — Clean separation between domain, application, infrastructure, and presentation
2. **Value Objects for type safety** — Layer, ElementType, RelationshipType, TraceLinkType are all immutable value objects with validation
3. **Server Actions over API routes** — Using Next.js Server Actions for all data mutations
4. **PostgreSQL + Drizzle** — Type-safe ORM with schema-first approach
5. **i18n first** — Built with bilingual support (EN/FA) from the start
6. **React Flow for diagrams** — Interactive diagram visualization with @xyflow/react
7. **Zustand + React Query** — Client state (Zustand) + server state (React Query) separation

---

## 12. Current Status

- Core domain model is implemented (entities, value objects, policies)
- Database schemas defined for all entities
- Server actions implemented for CRUD operations
- Landing page with marketing content
- Dashboard structure scaffolded
- Diagram support via React Flow
- Bilingual support (EN/FA) with RTL
- Dark/light theme support

---

*Report generated by MiMoCode Agent*
