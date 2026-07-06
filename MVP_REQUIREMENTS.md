# Arcadia Web MVP — Requirements List for Demo

**Purpose:** University final project demo for teachers  
**Current State:** `feature/model-explorer` branch — workbench, explorer, palette, canvas, validation, semantic browser, transition wizard all implemented  
**Target:** Polished demo that showcases Capella-like MBSE capabilities in a web app

---

## Status Legend

- ✅ **DONE** — Already implemented and working
- 🔧 **PARTIAL** — Exists but needs polish/fix
- ❌ **MISSING** — Needs to be built
- 🎯 **DEMO-CRITICAL** — Must work perfectly for teacher demo

---

## 1. PROJECT MANAGEMENT (Demo Entry Point)

| # | Requirement | Status | Priority | Notes |
|---|---|---|---|---|
| 1.1 | Landing page with Arcadia branding | ✅ | 🎯 | Already has hero, layers, features, CTA |
| 1.2 | User registration / login | ✅ | 🎯 | Auth module exists with remote API |
| 1.3 | Project list page | ✅ | 🎯 | Project cards, create/edit/delete |
| 1.4 | Project detail page with models | ✅ | 🎯 | Shows models per project |
| 1.5 | **Sample/seed project with pre-filled data** | 🔧 | 🎯 | IFE seed exists but may need enhancement |
| 1.6 | Language switcher (EN/FA) | ✅ | P1 | Works with next-intl |
| 1.7 | Dark/light theme toggle | ✅ | P1 | Works with next-themes |

---

## 2. WORKBENCH SHELL (Main Editor UI)

| # | Requirement | Status | Priority | Notes |
|---|---|---|---|---|
| 2.1 | Resizable panel layout (Explorer + Canvas + Palette + Properties) | ✅ | 🎯 | Full workbench with resizable panels |
| 2.2 | Panel toggle buttons (Explorer, Properties, Outline, Semantic, Validation) | ✅ | 🎯 | WorkbenchMenuBar with toggle buttons |
| 2.3 | Tab system for multiple diagrams | ✅ | 🎯 | EditorTabs with open/close/rename |
| 2.4 | Project name in header | ✅ | P1 | Shows in WorkbenchMenuBar |
| 2.5 | **Clean, polished header** | 🔧 | 🎯 | Ensure no visual glitches |

---

## 3. LAYER SWITCHER (Arcadia Core)

| # | Requirement | Status | Priority | Notes |
|---|---|---|---|---|
| 3.1 | OA / SA / LA / PA layer tabs | ✅ | 🎯 | LayerSwitcher component |
| 3.2 | Click layer → auto-open first diagram in that layer | ✅ | 🎯 | handleLayerChange function |
| 3.3 | Active layer highlighting | ✅ | 🎯 | Visual indicator of current layer |
| 3.4 | Layer names with labels | ✅ | P1 | Shows layer code + name |
| 3.5 | **Layer description tooltips** | ❌ | P2 | Show what each layer means on hover |

---

## 4. PROJECT EXPLORER (Tree View)

| # | Requirement | Status | Priority | Notes |
|---|---|---|---|---|
| 4.1 | Tree showing all layers → models → elements → diagrams | ✅ | 🎯 | ExplorerTree + ExplorerPanel |
| 4.2 | Click element → open diagram + zoom to element | ✅ | 🎯 | Canvas zoom-to-element implemented |
| 4.3 | Context menu (create, rename, delete) | ✅ | 🎯 | ContextMenu component |
| 4.4 | Create new model dialog | ✅ | P1 | Model creation via server action |
| 4.5 | Create new diagram dialog | ✅ | P1 | DiagramFormDialog |
| 4.6 | **Empty state messages** | 🔧 | 🎯 | Show helpful message when no models/diagrams |
| 4.7 | **Drag-to-reorder elements** | ❌ | P2 | Nice to have, not critical |

---

## 5. DIAGRAM CANVAS (React Flow)

| # | Requirement | Status | Priority | Notes |
|---|---|---|---|---|
| 5.1 | Render elements as nodes (Function, Component, Actor) | ✅ | 🎯 | Custom node types: FunctionNode, ComponentNode, ActorNode |
| 5.2 | Render relationships as edges | ✅ | 🎯 | ArchitectureEdge component |
| 5.3 | Drag nodes to reposition | ✅ | 🎯 | React Flow built-in |
| 5.4 | Auto-save layout on drag end | ✅ | 🎯 | useSaveManager with debounce |
| 5.5 | Zoom/pan controls | ✅ | 🎯 | React Flow built-in |
| 5.6 | **Semantic colormap (consistent colors per type)** | 🔧 | 🎯 | Ensure colors match Capella scheme |
| 5.7 | **Minimap** | ❌ | P1 | React Flow minimap for large diagrams |
| 5.8 | **Fit view on diagram open** | 🔧 | 🎯 | Ensure canvas fits all nodes when opening |
| 5.9 | **Edge labels (relationship names)** | 🔧 | 🎯 | Show relationship type/name on edges |
| 5.10 | **Undo/Redo buttons in toolbar** | 🔧 | P1 | Canvas store has history, need toolbar buttons |

---

## 6. ELEMENT PALETTE

| # | Requirement | Status | Priority | Notes |
|---|---|---|---|---|
| 6.1 | Show valid element types for current diagram | ✅ | 🎯 | DIAGRAM_PALETTE filtering per diagram type |
| 6.2 | Click to add element to canvas | ✅ | 🎯 | PalettePanel component |
| 6.3 | **Visual element type icons** | 🔧 | 🎯 | Ensure each type has distinct icon/shape |
| 6.4 | **Category grouping (Functions, Components, Actors)** | 🔧 | P1 | Group palette items by category |
| 6.5 | **Search/filter in palette** | ❌ | P2 | Nice for large type lists |

---

## 7. PROPERTIES PANEL

| # | Requirement | Status | Priority | Notes |
|---|---|---|---|---|
| 7.1 | Show selected element properties | ✅ | 🎯 | PropertiesPanel component |
| 7.2 | Edit element name | ✅ | 🎯 | Inline editing |
| 7.3 | Edit element description | ✅ | 🎯 | Textarea editing |
| 7.4 | Show element type + layer badge | ✅ | P1 | LayerBadge component |
| 7.5 | **Show element status (DRAFT/VALIDATED/DEPRECATED)** | 🔧 | P1 | Status indicator |
| 7.6 | **Show parent element info** | 🔧 | P2 | Display hierarchy position |

---

## 8. SEMANTIC BROWSER

| # | Requirement | Status | Priority | Notes |
|---|---|---|---|---|
| 8.1 | Show referencing elements (who references this) | ✅ | 🎯 | SemanticBrowserPanel |
| 8.2 | Show referenced elements (what this references) | ✅ | 🎯 | Three-category tree view |
| 8.3 | Click to navigate to related element | ✅ | 🎯 | Navigation links |
| 8.4 | **Show relationship type on each link** | 🔧 | P1 | Label each connection |

---

## 9. OUTLINE PANEL

| # | Requirement | Status | Priority | Notes |
|---|---|---|---|---|
| 9.1 | Show diagram element list | ✅ | P1 | OutlinePanel component |
| 9.2 | Click to select element on canvas | ✅ | P1 | Sync with canvas selection |

---

## 10. VALIDATION

| # | Requirement | Status | Priority | Notes |
|---|---|---|---|---|
| 10.1 | Run validation on model | ✅ | 🎯 | validate-model server action |
| 10.2 | Show validation issues in panel | ✅ | 🎯 | ValidationPanel component |
| 10.3 | Click issue → navigate to element | ✅ | 🎯 | Element navigation |
| 10.4 | **Fix cross-model bug** | 🔧 | 🎯 | Known bug: fetches elements from all models |
| 10.5 | **Validation rules completeness** | 🔧 | P1 | Ensure all Arcadia rules are covered |
| 10.6 | **Visual indicators on invalid elements** | ❌ | P1 | Red border/highlight on canvas |

---

## 11. TRANSITION WIZARD (Layer Transition)

| # | Requirement | Status | Priority | Notes |
|---|---|---|---|---|
| 11.1 | Open transition wizard dialog | ✅ | 🎯 | TransitionWizard component |
| 11.2 | Select source → target layer | ✅ | 🎯 | Layer selection |
| 11.3 | Preview elements to transition | ✅ | 🎯 | Element preview list |
| 11.4 | Execute transition (create elements + trace links) | ✅ | 🎯 | transition-layer server action |
| 11.5 | **Show created elements in explorer after transition** | 🔧 | 🎯 | Ensure tree refreshes |
| 11.6 | **Undo transition** | ❌ | P2 | Nice to have |

---

## 12. TRACEABILITY

| # | Requirement | Status | Priority | Notes |
|---|---|---|---|---|
| 12.1 | Create trace links between layers | ✅ | 🎯 | create-trace-link server action |
| 12.2 | View trace links per element | ✅ | 🎯 | get-trace-links-by-element-id |
| 12.3 | Trace link matrix view | 🔧 | P1 | TraceLayerPair components exist |
| 12.4 | **Trace link type labels** | 🔧 | P1 | Show Realization/Allocation/Deployment |
| 12.5 | **Delete trace links** | ✅ | P1 | remove-trace-link server action |

---

## 13. CONNECTIONS (Same-Layer Relationships)

| # | Requirement | Status | Priority | Notes |
|---|---|---|---|---|
| 13.1 | Create connections between elements | ✅ | 🎯 | connect-elements server action |
| 13.2 | Connection dialog (select type, source, target) | ✅ | 🎯 | ConnectionDialog component |
| 13.3 | ConnectionPolicy enforcement | ✅ | 🎯 | Domain policy validates rules |
| 13.4 | **Visual edge styles per relationship type** | 🔧 | P1 | Different colors/dash patterns |

---

## 14. EXPORT

| # | Requirement | Status | Priority | Notes |
|---|---|---|---|---|
| 14.1 | Export diagram as JSON | ✅ | P1 | useDiagramExport hook |
| 14.2 | Export diagram as PDF | 🔧 | P1 | Hook exists, verify it works |
| 14.3 | **Export full model** | ❌ | P2 | Export all diagrams + elements |

---

## 15. DEMO POLISH (Critical for Teacher Impressions)

| # | Requirement | Status | Priority | Notes |
|---|---|---|---|---|
| 15.1 | **Seed project with realistic data** | 🔧 | 🎯 | IFE seed needs review — ensure all layers populated |
| 15.2 | **No console errors in demo flow** | 🔧 | 🎯 | Test full happy path |
| 15.3 | **Loading states / skeletons** | 🔧 | 🎯 | Skeleton components exist, ensure they work |
| 15.4 | **Empty states with helpful messages** | 🔧 | 🎯 | When no diagrams/elements |
| 15.5 | **Toast notifications for actions** | 🔧 | 🎯 | Sonner toasts for create/update/delete |
| 15.6 | **Smooth animations** | 🔧 | P1 | Canvas transitions, panel open/close |
| 15.7 | **Consistent styling** | 🔧 | 🎯 | No broken layouts, consistent spacing |
| 15.8 | **Responsive (at least not broken on resize)** | 🔧 | P1 | Resizable panels should work |
| 15.9 | **About page / methodology explanation** | ❌ | P2 | Show Arcadia method overview |
| 15.10 | **Demo script / walkthrough** | ❌ | 🎯 | Prepare step-by-step demo flow |

---

## 16. KNOWN BUGS TO FIX BEFORE DEMO

| # | Bug | Severity | Status |
|---|---|---|---|
| 16.1 | validate-model.ts cross-model bug (fetches elements from only current model, but trace links span all models) | 🔴 High | 🔧 Fix needed |
| 16.2 | transitionLayer not atomic (partial failure leaves orphaned elements) | 🟡 Medium | 🔧 Fix needed |
| 16.3 | Duplicate TraceLinkTypeValue in two files | 🟡 Medium | 🔧 Fix needed |
| 16.4 | Pre-existing errors in project drizzle (users undefined) | 🟢 Low | Skip if not in runtime path |

---

## 17. DEMO FLOW (Suggested Script)

### Step 1: Landing Page (30 sec)
- Show the polished landing page with Arcadia branding
- Switch language EN → FA to show i18n
- Toggle dark/light theme

### Step 2: Login & Project List (30 sec)
- Login with demo credentials
- Show project list with cards
- Open the sample/seed project

### Step 3: Workbench Overview (1 min)
- Show the full workbench layout: Explorer | Canvas | Palette | Properties
- Toggle panels on/off to show flexibility
- Show the Layer Switcher bar

### Step 4: OA Layer (1 min)
- Click OA layer → auto-open OA diagram
- Show operational activities, entities, actors on canvas
- Drag a node to show smooth interaction
- Click element → Properties panel shows details

### Step 5: SA Layer (1 min)
- Switch to SA layer
- Show system functions, components, actors
- Show a connection/relationship on canvas

### Step 6: Layer Transition (1 min)
- Open Transition Wizard (OA → SA)
- Show element preview
- Execute transition → new elements created
- Show trace links in Semantic Browser

### Step 7: Validation (30 sec)
- Run validation on model
- Show validation issues in panel
- Click issue → navigate to element

### Step 8: Traceability (30 sec)
- Show trace links between layers
- Semantic Browser navigation

### Step 9: Export (15 sec)
- Export diagram as JSON/PDF

**Total demo time: ~7 minutes**

---

## 18. PRIORITY SUMMARY

### 🎯 Must Work for Demo (24 items)
All items marked 🎯 in the tables above. Focus on:
1. Seed project with good data
2. No console errors
3. Canvas interactions (drag, zoom, select)
4. Layer switching
5. Properties editing
6. Validation
7. Transition wizard
8. Clean UI (no visual glitches)

### 🔧 Should Polish (20+ items)
Items marked 🔧 — fix if time permits, especially:
- Cross-model validation bug
- Edge labels
- Minimap
- Empty states
- Toast notifications

### ❌ Skip for Demo (8 items)
Items marked ❌ — not critical for teacher demo:
- Drag-to-reorder
- Search in palette
- Undo transition
- About page
- Full model export

---

*Generated by MiMoCode Agent — 2026-06-20*
