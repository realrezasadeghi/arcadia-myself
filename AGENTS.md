<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Arcadia — Agent Instructions

## Project Overview

**Arcadia** is a web-based architecture modeling tool implementing the ARCADIA methodology (Architecture Analysis and Design Integrated Approach) — a systems engineering framework with four abstraction layers (OA, SA, LA, PA).

**Stack:** Next.js 16.2.6 (App Router) + React 19.2.4 + TypeScript 5 + Tailwind CSS v4 + PostgreSQL 16 (Docker) + Drizzle ORM 0.45 + next-intl 4 (EN/FA) + @xyflow/react 12 + Zustand 5 + TanStack Query 5 + React Hook Form + Zod 4 + Biome 2.2

---

## Architecture: Clean Architecture + DDD + Hexagonal

```
src/modules/
├── shared/           # Shared DDD primitives
│   └── domain/
│       ├── entity.ts          # Entity base class (identity + equality)
│       ├── aggregate-root.ts  # AggregateRoot with domain events
│       ├── value-object.ts    # ValueObject base class (structural equality)
│       ├── event.ts           # DomainEvent interface
│       └── error.ts           # Domain error types
└── model/            # Core business module
    ├── domain/
    │   ├── entities/          # Model, ModelElement, Relationship, Diagram, TraceLink
    │   ├── value-objects/     # Layer, ElementType, RelationshipType, TraceLinkType, DiagramType
    │   ├── policies/          # Business rules / invariants
    │   └── types/             # TypeScript type definitions
    ├── application/
    │   └── ports/             # Repository interfaces (driven ports)
    ├── infrastructure/
    │   └── persistence/
    │       └── drizzle/       # Drizzle ORM implementation
    │           ├── client/    # Database client
    │           ├── schemas/   # Table definitions
    │           └── repositories/  # Repository implementations
    └── presentation/
        ├── server-actions/    # Next.js Server Actions (20+)
        ├── dtos/              # Data Transfer Objects
        └── config/            # Visual config (planned)
```

**Dependency Rule:** `domain` → `application` → `infrastructure` → `presentation`. Domain has ZERO external dependencies.

---

## Key Domain Model

### 4 Arcadia Layers (ordered)
| Code | Name (EN) | Name (FA) | Order |
|------|-----------|-----------|-------|
| OA | Operational Analysis | تحلیل عملیاتی | 1 |
| SA | System Analysis | تحلیل سیستم | 2 |
| LA | Logical Architecture | معماری منطقی | 3 |
| PA | Physical Architecture | معماری فیزیکی | 4 |

### Core Entities
- **Model** — Architecture model at a specific layer within a project
- **ModelElement** — Element within a model (Mission, System, LogicalComponent, etc.)
- **Relationship** — Connection between two elements in same model
- **Diagram** — Visual representation/layout of elements (React Flow)
- **TraceLink** — Cross-layer traceability links (Realization, Allocation, Deployment, Involvement, Refinement)

### Value Objects (immutable, structural equality)
`Layer`, `ElementType` (20+ types), `RelationshipType` (12 types), `TraceLinkType` (5 types), `DiagramType`, `Visibility`, `Multiplicity`, `ParameterDirection`, `DiagramLayout`

---

## Commands

| Task | Command |
|------|---------|
| Dev server | `pnpm dev` |
| Build | `pnpm build` |
| Start production | `pnpm start` |
| Lint | `pnpm lint` |
| Format | `pnpm format` |
| DB: Generate migrations | `pnpm db:generate` |
| DB: Run migrations | `pnpm db:migrate` |
| DB: Push schema | `pnpm db:push` |
| DB: Studio | `pnpm db:studio` |

**Order when changing DB schema:** `db:generate` → `db:migrate` (or `db:push` for dev)

---

## Database

- **PostgreSQL 16** via Docker on port **5433** (mapped from 5432)
- **Connection:** `postgresql://user:1234@localhost:5433/mydatabase`
- **Start DB:** `docker-compose up -d`
- **Schemas:** `src/modules/model/infrastructure/persistence/drizzle/schemas/*.ts`
- **Migrations:** `drizzle/migrations/`

---

## Server Actions (API Layer)

All data mutations use **Server Actions** (not API routes). Located in:
`src/modules/model/presentation/server-actions/`

Key actions: `create-model`, `update-model`, `remove-model`, `get-model-by-id`, `get-models-by-project-id`, `create-element`, `update-element`, `remove-element`, `get-element-by-id`, `get-elements-by-model-id`, `connect-elements`, `update-relationship`, `remove-relationship`, `get-relationships-by-model-id`, `create-diagram`, `update-diagram`, `remove-diagram`, `get-diagram-by-id`, `get-diagrams-by-model-id`, `update-diagram-layout`, `create-trace-link`, `update-trace-link`, `remove-trace-link`, `get-trace-links-by-project-id`, `get-trace-links-by-element-id`, `get-element-relations`, `validate-model`, `transition-layer`

---

## Frontend Structure

### Routing (App Router with i18n)
```
src/app/[locale]/
├── layout.tsx              # Root layout (providers, themes, i18n)
├── page.tsx                # Landing page
└── dashboard/
    ├── layout.tsx          # Dashboard layout
    └── project/
        ├── page.tsx        # Project list
        └── [id]/
            ├── layout.tsx  # Project detail layout
            └── page.tsx    # Project detail
```

### Providers (in root layout)
- `NextIntlClientProvider` — i18n (EN/FA)
- `DirectionProvider` — RTL/LTR support
- `ThemeProvider` — Dark/light mode (next-themes)
- `ConfirmProvider` — Confirmation dialogs (sonner)
- `QueryProvider` — TanStack Query (React Query)

### UI Components
- **Diagrams:** @xyflow/react (React Flow) — viewport management, drag-and-drop, layout persistence
- **Forms:** React Hook Form + Zod 4
- **UI Primitives:** Radix UI + shadcn/ui patterns + CVA + tailwind-merge
- **State:** Zustand (client) + TanStack Query (server)

---

## Internationalization

- **Languages:** English (en), Persian/Farsi (fa)
- **RTL:** Full RTL support via `DirectionProvider`
- **Fonts:** Inter (EN), Vazirmatn (FA)
- **Messages:** `src/messages/en.json`, `src/messages/fa.json`
- **Routing:** `src/i18n/routing.ts`, `src/i18n/navigation.ts`, `src/i18n/request.ts`

---

## TypeScript & Path Aliases

- **Strict mode:** Enabled
- **Path alias:** `@/*` → `./src/*`
- **Module resolution:** Bundler
- **React Compiler:** Enabled in `next.config.ts` (`reactCompiler: true`)

---

## Code Style & Linting

- **Formatter/Linter:** Biome 2.2 (run `pnpm lint` and `pnpm format`)
- **Indentation:** 2 spaces
- **Import organization:** Auto-organize on save
- **Rules:** Recommended + Next.js + React domains
- **Disabled rules:** `noUnknownAtRules`, `noStaticOnlyClass`, `noStaticElementInteractions`

---

## Critical Conventions & Gotchas

### DDD/Hexagonal Boundaries
- **Domain:** NO external imports (no Drizzle, no React, no Next.js)
- **Application:** Port interfaces only, no implementations
- **Infrastructure:** Drizzle schemas, repository implementations
- **Presentation:** Server Actions, DTOs, UI components

### Value Objects
- All domain types (Layer, ElementType, etc.) are Value Objects with validation in constructor
- Use structural equality (`.equals()`), never reference equality
- Import from `src/modules/model/domain/value-objects/`

### Server Actions
- All mutations go through Server Actions
- Input validation via Zod schemas in DTOs
- Return typed results (success/error)

### React Flow / Diagrams
- Canvas components in `src/modules/model/ui/components/`
- Layout persisted via `update-diagram-layout` server action
- Element types map to specific node/edge components

### i18n
- All user-facing strings in message files
- Use `useTranslations()` hook in client components
- RTL handled via `dir` attribute on HTML

### Database
- UUIDs for all primary keys (generated by DB)
- JSONB for flexible properties on elements/relationships
- Foreign keys with cascade where appropriate

---

## File Structure Reference

```
arcadia/
├── src/
│   ├── app/[locale]/         # Next.js App Router pages
│   ├── i18n/                 # i18n config
│   ├── messages/             # Translations (en.json, fa.json)
│   ├── modules/
│   │   ├── shared/domain/    # Shared DDD primitives
│   │   └── model/            # Core model module
│   │       ├── domain/       # Entities, VOs, policies
│   │       ├── application/  # Repository ports
│   │       ├── infrastructure/persistence/drizzle/
│   │       │   ├── client/   # DB client
│   │       │   ├── schemas/  # Table definitions
│   │       │   └── repositories/  # Repo implementations
│   │       └── presentation/
│   │           ├── server-actions/
│   │           ├── dtos/
│   │           └── ui/       # React components, hooks, helpers
│   └── proxy.ts              # Next.js 16 middleware (was middleware.ts)
├── drizzle/                  # Migrations
├── public/                   # Static assets
├── docker-compose.yml        # PostgreSQL
├── drizzle.config.ts         # Drizzle config
├── biome.json                # Linter config
├── next.config.ts            # Next.js config (reactCompiler, cacheComponents)
├── tsconfig.json
└── package.json
```

---

## Performance Notes (Next.js 16 + React 19)

- **React Compiler:** Enabled (`babel-plugin-react-compiler`)
- **Cache Components:** Enabled in `next.config.ts` (`cacheComponents: true`)
- **PPR (Partial Prerendering):** Available via `use cache` directive
- **Server Actions:** Preferred over API routes for mutations
- **Bundle:** Direct imports (avoid barrel files), dynamic imports for heavy components
- **Fonts:** `next/font` with Inter + Vazirmatn

---

## Testing & Verification

No test framework configured yet. When adding tests:
- Unit test domain logic (pure functions, no infrastructure)
- Integration test repository implementations
- E2E test Server Actions and UI flows

---

## Environment Setup

1. `docker-compose up -d` (starts PostgreSQL on 5433)
2. `pnpm install`
3. `pnpm db:generate` → `pnpm db:migrate`
4. `pnpm dev`

---

## References

- **Project Report:** `PROJECT_REPORT.md` (detailed domain model, schemas, actions)
- **MVP Requirements:** `MVP_REQUIREMENTS.md`
- **Diagram Specs:** `DIAGRAMS.md`, `ARCADIA_DIAGRAMS_REPORT.md`
- **Access Control:** `ACCESS_CONTROL_SPEC.md`

---

## Skills Applied

This project uses patterns from:
- `clean-ddd-hexagonal` — DDD tactical patterns, Hexagonal ports/adapters
- `next-best-practices` — Next.js 16 file conventions, RSC boundaries, async patterns
- `vercel-react-best-practices` — Performance optimization rules (waterfalls, bundle size, SSR)
- `tailwind-design-system` — Tailwind v4 CSS-first config, design tokens