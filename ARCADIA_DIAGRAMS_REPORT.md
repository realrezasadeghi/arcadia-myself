# ARCADIA Methodology — Sequence & Class Diagrams Report

**Date:** 2026-06-26
**Purpose:** Understanding how "sequence diagrams" and "class diagrams" map to ARCADIA methodology

---

## 1. Key Insight: ARCADIA ≠ UML

ARCADIA is a **systems engineering methodology** (developed by Thales, standardized as AFNOR XP Z67-140). It uses its own **domain-specific language (DSL)** — NOT UML/SysML.

| Concept | UML/SysML | ARCADIA/Capella |
|---------|-----------|-----------------|
| Sequence Diagram | UML Sequence Diagram | **Scenario** (OIS, SS, LS, PS) |
| Class Diagram | UML Class Diagram | **Breakdown Diagram** (OEB, OAB, SAB, LAB, PAB) + **Architecture Blank** |

**ARCADIA deliberately avoids UML** to be accessible to non-software stakeholders (systems engineers, hardware engineers, operational analysts).

---

## 2. Sequence Diagrams in ARCADIA → Scenarios

In ARCADIA, "sequence diagrams" are called **Scenarios**. They show temporal interaction sequences between actors/components.

### 2.1 Scenario Types by Layer

| Layer | Scenario Code | Full Name | What it Shows |
|-------|--------------|-----------|---------------|
| **OA** | `OIS` | Operational Interaction Scenario | How operational actors interact to achieve missions |
| **SA** | `SS` | System Scenario | How system functions exchange data with actors |
| **LA** | `LS` | Logical Scenario | How logical components interact |
| **PA** | `PS` | Physical Scenario | How physical components interact at implementation level |

### 2.2 Scenario Elements

Each scenario contains:

```
Scenario
├── Instance Roles (lifelines)
│   ├── Operational Actor
│   ├── Operational Entity
│   ├── System Actor
│   ├── System Component
│   ├── Logical Component
│   └── Physical Component
│
├── Messages (arrows between lifelines)
│   ├── Functional Exchange (data flow)
│   ├── Operational Exchange
│   └── Sequence Message (temporal ordering)
│
└── Fragments (optional)
    ├── alt (alternative)
    ├── loop (iteration)
    └── break
```

### 2.3 Example: OIS (Operational Interaction Scenario)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Pilot      │     │  ATC Tower  │     │  Aircraft   │
│  (Actor)    │     │  (Entity)   │     │  (Entity)   │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │──Request Takeoff──▶│                   │
       │                   │──Clear Takeoff────▶│
       │                   │                   │──Execute Takeoff
       │◀──Status Update───│◀──Takeoff Complete─│
       │                   │                   │
```

This is your `OIS` diagram type — it's the ARCADIA equivalent of a UML sequence diagram.

---

## 3. Class Diagrams in ARCADIA → Breakdown & Architecture Blanks

In ARCADIA, "class diagrams" are split into two concepts:

### 3.1 Breakdown Diagrams (Hierarchy/Decomposition)

These show **hierarchical structure** — like a class diagram's inheritance/composition tree.

| Layer | Code | Full Name | Shows |
|-------|------|-----------|-------|
| **OA** | `OEB` | Operational Entity Breakdown | Hierarchy of operational entities |
| **OA** | `OAB` | Operational Activity Breakdown | Hierarchy of operational activities |
| **SA** | (part of SAB) | — | System function hierarchy |
| **LA** | `LCB` | Logical Component Breakdown | Logical component tree |
| **PA** | `PCB` | Physical Component Breakdown | Physical component tree |

### 3.2 Architecture Blanks (Main Diagrams)

These are the **primary diagrams** — equivalent to a UML class diagram showing components + relationships.

| Layer | Code | Full Name | Shows |
|-------|------|-----------|-------|
| **SA** | `SAB` | System Architecture Blank | System functions + actors + exchanges |
| **LA** | `LAB` | Logical Architecture Blank | Logical components + functions + allocations |
| **PA** | `PAB` | Physical Architecture Blank | Physical components + nodes + allocations |

### 3.3 Architecture Blank Elements

```
Architecture Blank (SAB/LAB/PAB)
├── Components (boxes)
│   ├── System Function (SA)
│   ├── Logical Component (LA)
│   ├── Physical Component (PA)
│   └── Actor (external)
│
├── Ports (on component borders)
│   ├── Input Port
│   ├── Output Port
│   └── Flow Port
│
├── Exchanges (arrows between ports)
│   ├── Functional Exchange
│   ├── Data Flow
│   └── Component Exchange
│
└── Allocations (dashed lines)
    ├── Function Allocation → Component
    └── Component Allocation → Node
```

### 3.4 Example: LAB (Logical Architecture Blank)

```
┌─────────────────────────────────────────────────────┐
│                System Boundary                       │
│  ┌──────────────┐         ┌──────────────┐          │
│  │ Logical      │────────▶│ Logical      │          │
│  │ Component A  │ Data    │ Component B  │          │
│  │              │ Flow    │              │          │
│  │ ┌──────────┐ │         │ ┌──────────┐ │          │
│  │ │ Function │ │         │ │ Function │ │          │
│  │ │   F1     │ │         │ │   F2     │ │          │
│  │ └──────────┘ │         │ └──────────┘ │          │
│  └──────────────┘         └──────────────┘          │
│         │                        │                   │
│         ▼                        ▼                   │
│  ┌──────────────┐         ┌──────────────┐          │
│  │ Actor        │         │ Actor        │          │
│  │ (External)   │         │ (External)   │          │
│  └──────────────┘         └──────────────┘          │
└─────────────────────────────────────────────────────┘
```

---

## 4. Complete Diagram Matrix

### All 17 Diagram Types in Your Codebase

| Layer | Code | Type | ARCADIA Equivalent | UML Equivalent |
|-------|------|------|-------------------|----------------|
| **OA** | `OEB` | Breakdown | Entity Hierarchy | Class Diagram (composition) |
| **OA** | `OAB` | Breakdown | Activity Hierarchy | Activity Diagram (decomposition) |
| **OA** | `OPD` | Process | Operational Process | Sequence Diagram (flow) |
| **OA** | `OCD` | Capability | Capability Mapping | N/A (ARCADIA-specific) |
| **OA** | `OIS` | Scenario | Interaction Scenario | **Sequence Diagram** |
| **SA** | `SAB` | Architecture | System Architecture | **Class Diagram** (components) |
| **SA** | `SDFB` | Data Flow | Data Flow | Data Flow Diagram |
| **SA** | `SCD` | Capability | System Capabilities | N/A |
| **SA** | `SS` | Scenario | System Scenario | **Sequence Diagram** |
| **LA** | `LAB` | Architecture | Logical Architecture | **Class Diagram** (components) |
| **LA** | `LDFB` | Data Flow | Logical Data Flow | Data Flow Diagram |
| **LA** | `LCB` | Breakdown | Component Hierarchy | Class Diagram (tree) |
| **LA** | `LS` | Scenario | Logical Scenario | **Sequence Diagram** |
| **PA** | `PAB` | Architecture | Physical Architecture | **Class Diagram** (components) |
| **PA** | `PDFB` | Data Flow | Physical Data Flow | Data Flow Diagram |
| **PA** | `PCB` | Breakdown | Component Hierarchy | Class Diagram (tree) |
| **PA** | `PS` | Scenario | Physical Scenario | **Sequence Diagram** |

---

## 5. Mapping to Your Codebase

### Your Current Implementation

```typescript
// src/modules/model/domain/value-objects/diagram-type.ts

// Scenario diagrams (sequence equivalents)
type ScenarioDiagrams = "OIS" | "SS" | "LS" | "PS";

// Architecture blanks (class diagram equivalents)
type ArchitectureDiagrams = "SAB" | "LAB" | "PAB";

// Breakdown diagrams (hierarchy/class tree equivalents)
type BreakdownDiagrams = "OEB" | "OAB" | "LCB" | "PCB";

// Other
type DataFlowDiagrams = "SDFB" | "LDFB" | "PDFB";
type CapabilityDiagrams = "OCD" | "SCD";
type ProcessDiagrams = "OPD";
```

### How Each Maps to React Flow Implementation

| Diagram Type | React Flow Nodes | React Flow Edges |
|--------------|-----------------|-----------------|
| **Scenarios** (OIS, SS, LS, PS) | Lifelines (vertical bars) | Messages (horizontal arrows with sequence) |
| **Architecture Blanks** (SAB, LAB, PAB) | Components (boxes with ports) | Exchanges (arrows between ports) |
| **Breakdowns** (OEB, OAB, LCB, PCB) | Entities/Components (nested boxes) | Composition (tree edges) |
| **Data Flow** (SDFB, LDFB, PDFB) | Functions (rounded boxes) | Data flows (arrows) |

---

## 6. Why ARCADIA Doesn't Use UML

From the official ARCADIA documentation:

> "A domain-specific language (DSL) was preferred in order to ease appropriation by all stakeholders, usually not familiar with general-purpose, generic languages such as UML or SysML."

**Reasons:**
1. **Accessibility** — Non-software engineers (systems, hardware, operational) can understand it
2. **Simplicity** — Fewer concepts than UML/SysML
3. **Tool support** — Capella provides guided editing with validation
4. **Standardization** — AFNOR XP Z67-140 (French national standard)

---

## 7. Recommendations for Your Web App

### Option A: Follow ARCADIA Strictly
- Implement all 17 diagram types as defined
- Use ARCADIA terminology (Scenario, Architecture Blank, Breakdown)
- Match Capella's visual style

### Option B: Hybrid Approach
- Keep ARCADIA diagram types
- Add UML-style visual hints for software developers
- Example: Show "Sequence Diagram" label next to "Scenario"

### Option C: UML Extensions
- Add traditional UML diagram types (Sequence, Class, Component)
- Map them to ARCADIA concepts internally
- Provide both ARCADIA and UML views

**Recommendation:** Option A (strict ARCADIA) — your project is explicitly an ARCADIA tool, and your teachers expect ARCADIA methodology compliance.

---

*Report generated for Arcadia web project*
