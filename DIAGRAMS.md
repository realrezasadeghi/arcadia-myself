# Arcadia — UML Diagrams (ARCADIA Methodology)

> **Note:** ARCADIA uses its own DSL, not traditional UML. This document maps ARCADIA concepts to standard UML equivalents for documentation purposes.

---

## 1. Class Diagram — ARCADIA Domain Model

```mermaid
classDiagram
    direction TB

    %% ── Shared Domain Primitives ──
    class Entity {
        <<abstract>>
        +UUID id
        +DateTime createdAt
        +DateTime updatedAt
        +equals(other: Entity) bool
    }

    class AggregateRoot {
        <<abstract>>
        +DomainEvent[] events
        +addEvent(event: DomainEvent)
        +pullEvents() DomainEvent[]
    }

    class ValueObject {
        <<abstract>>
        +equals(other: ValueObject) bool
    }

    class DomainEvent {
        <<interface>>
        +UUID eventId
        +DateTime occurredAt
        +string eventType
    }

    Entity <|-- AggregateRoot

    %% ── ARCADIA Value Objects ──
    class Layer {
        <<value object>>
        +string code
        +string nameEN
        +string nameFA
        +int order
        +static OA  "Operational Analysis"
        +static SA  "System Analysis"
        +static LA  "Logical Architecture"
        +static PA  "Physical Architecture"
    }

    class ElementType {
        <<value object>>
        +string code
        +string label
        +Layer layer
    }

    class RelationshipType {
        <<value object>>
        +string code
        +string label
        +ExchangeKind kind
    }

    class ExchangeKind {
        <<enumeration>>
        FLOW
        EVENT
        OPERATION
    }

    class TraceLinkType {
        <<value object>>
        +string code
        +string label
        +static Realization
        +static Allocation
        +static Deployment
        +static Involvement
        +static Refinement
    }

    class DiagramType {
        <<value object>>
        +string code
        +string label
        +Layer layer
        +isScenario() bool
        +isBreakdown() bool
    }

    class ElementStatus {
        <<enumeration>>
        DRAFT
        VALIDATED
        DEPRECATED
    }

    ValueObject <|-- Layer
    ValueObject <|-- ElementType
    ValueObject <|-- RelationshipType
    ValueObject <|-- TraceLinkType
    ValueObject <|-- DiagramType

    %% ── ARCADIA Domain Entities ──
    class Model {
        +UUID id
        +UUID projectId
        +Layer layer
        +string name
        +string description
        +validate() bool
    }

    class ModelElement {
        +UUID id
        +UUID modelId
        +Layer layer
        +ElementType type
        +string name
        +string description
        +JSON properties
        +UUID? parentId
        +ElementStatus status
        +validate() bool
    }

    class Relationship {
        +UUID id
        +UUID modelId
        +RelationshipType type
        +UUID sourceElementId
        +UUID targetElementId
        +string name
        +string description
        +JSON properties
        +validate() bool
    }

    class Diagram {
        +UUID id
        +UUID modelId
        +DiagramType type
        +string name
        +string description
        +Viewport viewport
        +Map~UUID,ElementLayout~ elementLayouts
        +updateLayout(elementId, position)
    }

    class TraceLink {
        +UUID id
        +UUID projectId
        +UUID sourceModelId
        +UUID targetModelId
        +TraceLinkType type
        +UUID sourceElementId
        +Layer sourceLayer
        +UUID targetElementId
        +Layer targetLayer
        +validate() bool
    }

    class Viewport {
        <<value object>>
        +float x
        +float y
        +float zoom
    }

    class ElementLayout {
        <<value object>>
        +float x
        +float y
        +float width
        +float height
    }

    Entity <|-- Model
    Entity <|-- ModelElement
    Entity <|-- Relationship
    Entity <|-- Diagram
    Entity <|-- TraceLink

    Model "1" *-- "0..*" ModelElement : contains
    Model "1" *-- "0..*" Relationship : contains
    Model "1" *-- "0..*" Diagram : contains
    Project "1" *-- "1..*" Model : has
    ModelElement "1" o-- "0..1" ModelElement : parent/child
    Relationship --> ModelElement : source
    Relationship --> ModelElement : target
    Diagram --> ModelElement : displays
    TraceLink --> ModelElement : source element
    TraceLink --> ModelElement : target element
    TraceLink --> Model : source model
    TraceLink --> Model : target model

    %% ── Project ──
    class Project {
        +UUID id
        +string name
        +string description
        +DateTime createdAt
        +DateTime updatedAt
    }

    %% ── Application Ports (Repository Interfaces) ──
    class ModelRepository {
        <<interface>>
        +findById(id: UUID) Model?
        +findByProjectId(projectId: UUID) Model[]
        +save(model: Model) void
        +delete(id: UUID) void
    }

    class ElementRepository {
        <<interface>>
        +findById(id: UUID) ModelElement?
        +findByModelId(modelId: UUID) ModelElement[]
        +findByParentId(parentId: UUID) ModelElement[]
        +save(element: ModelElement) void
        +delete(id: UUID) void
    }

    class RelationshipRepository {
        <<interface>>
        +findById(id: UUID) Relationship?
        +findByModelId(modelId: UUID) Relationship[]
        +findByElementId(elementId: UUID) Relationship[]
        +save(relationship: Relationship) void
        +delete(id: UUID) void
    }

    class DiagramRepository {
        <<interface>>
        +findById(id: UUID) Diagram?
        +findByModelId(modelId: UUID) Diagram[]
        +save(diagram: Diagram) void
        +delete(id: UUID) void
    }

    class TraceLinkRepository {
        <<interface>>
        +findByProjectId(projectId: UUID) TraceLink[]
        +findByElementId(elementId: UUID) TraceLink[]
        +save(traceLink: TraceLink) void
        +delete(id: UUID) void
    }

    %% ── Infrastructure (Drizzle ORM) ──
    class DrizzleModelRepository {
        +client: DrizzleClient
    }

    class DrizzleElementRepository {
        +client: DrizzleClient
    }

    class DrizzleRelationshipRepository {
        +client: DrizzleClient
    }

    class DrizzleDiagramRepository {
        +client: DrizzleClient
    }

    class DrizzleTraceLinkRepository {
        +client: DrizzleClient
    }

    ModelRepository <|.. DrizzleModelRepository
    ElementRepository <|.. DrizzleElementRepository
    RelationshipRepository <|.. DrizzleRelationshipRepository
    DiagramRepository <|.. DrizzleDiagramRepository
    TraceLinkRepository <|.. DrizzleTraceLinkRepository

    %% ── Domain Policies ──
    class ConnectionPolicy {
        +validate(source, target, type) bool
        +isAllowedConnection(sourceType, targetType, relType) bool
    }

    class TransitionPolicy {
        +validateTransition(source, target) bool
        +getValidTransitions(sourceLayer) Layer[]
    }

    ConnectionPolicy --> ElementType
    ConnectionPolicy --> RelationshipType
    TransitionPolicy --> Layer

    %% ── Presentation Layer (Server Actions) ──
    class ServerAction {
        <<abstract>>
        +execute(input) Result
    }

    class CreateModelAction {
        +execute(input: CreateModelDTO) Result~Model~
    }

    class CreateElementAction {
        +execute(input: CreateElementDTO) Result~ModelElement~
    }

    class ConnectElementsAction {
        +execute(input: ConnectDTO) Result~Relationship~
    }

    class ValidateModelAction {
        +execute(input: ValidateDTO) Result~ValidationResult~
    }

    class TransitionLayerAction {
        +execute(input: TransitionDTO) Result~TransitionResult~
    }

    ServerAction <|-- CreateModelAction
    ServerAction <|-- CreateElementAction
    ServerAction <|-- ConnectElementsAction
    ServerAction <|-- ValidateModelAction
    ServerAction <|-- TransitionLayerAction
```

---

## 2. Sequence Diagrams — ARCADIA Scenarios

### 2.1 OIS — Operational Interaction Scenario (OA Layer)

```mermaid
sequenceDiagram
    actor Pilot as Operational Actor:<br/>Pilot
    participant Tower as Operational Entity:<br/>ATC Tower
    participant Aircraft as Operational Entity:<br/>Aircraft
    participant Runway as Operational Entity:<br/>Runway Control

    Note over Pilot,Runway: Mission: Takeoff Procedure

    Pilot->>Tower: Request Takeoff Clearance
    activate Tower
    Tower->>Aircraft: Verify Flight Plan
    activate Aircraft
    Aircraft-->>Tower: Flight Plan Valid
    deactivate Aircraft

    Tower->>Runway: Check Runway Availability
    activate Runway
    Runway-->>Tower: Runway Clear
    deactivate Runway

    Tower-->>Pilot: Takeoff Cleared
    deactivate Tower

    Pilot->>Aircraft: Execute Takeoff
    activate Aircraft
    Aircraft->>Runway: Enter Runway
    activate Runway
    Runway-->>Aircraft: Runway Entered
    deactivate Runway

    Aircraft->>Aircraft: Accelerate & Lift Off
    Aircraft-->>Tower: Airborne
    deactivate Aircraft

    Tower->>Runway: Runway Released
    activate Runway
    Runway-->>Tower: Confirmed
    deactivate Runway
```

### 2.2 SS — System Scenario (SA Layer)

```mermaid
sequenceDiagram
    actor Pilot as System Actor:<br/>Pilot
    participant FMS as System Function:<br/>Flight Management
    participant Nav as System Function:<br/>Navigation System
    participant Comm as System Function:<br/>Communication
    participant Radar as System Function:<br/>Radar Tracking

    Note over Pilot,Radar: System Scenario: Flight Tracking

    Pilot->>FMS: Input Flight Plan
    activate FMS
    FMS->>Nav: Calculate Route
    activate Nav
    Nav-->>FMS: Route Calculated
    deactivate Nav

    FMS->>Comm: Send Flight Plan to ATC
    activate Comm
    Comm-->>FMS: Plan Transmitted
    deactivate Comm

    FMS-->>Pilot: Route Displayed
    deactivate FMS

    loop During Flight
        Radar->>Radar: Track Aircraft Position
        Radar->>Comm: Update Position
        activate Comm
        Comm->>FMS: Position Data
        activate FMS
        FMS->>Nav: Update Navigation
        activate Nav
        Nav-->>FMS: Updated Course
        deactivate Nav
        FMS-->>Pilot: Display Updated Position
        deactivate FMS
        Comm-->>Radar: Acknowledged
        deactivate Comm
    end
```

### 2.3 LS — Logical Scenario (LA Layer)

```mermaid
sequenceDiagram
    participant UI as Logical Component:<br/>User Interface
    participant CTRL as Logical Component:<br/>Controller
    participant PROC as Logical Component:<br/>Processing Unit
    participant DATA as Logical Component:<br/>Data Store
    participant EXT as Logical Actor:<br/>External System

    Note over UI,EXT: Logical Scenario: Data Processing

    UI->>CTRL: User Request
    activate CTRL
    CTRL->>DATA: Query Data
    activate DATA
    DATA-->>CTRL: Raw Data
    deactivate DATA

    CTRL->>PROC: Process Request
    activate PROC
    PROC->>EXT: Fetch External Data
    activate EXT
    EXT-->>PROC: External Response
    deactivate EXT

    PROC->>PROC: Apply Business Logic
    PROC-->>CTRL: Processed Result
    deactivate PROC

    CTRL->>DATA: Store Result
    activate DATA
    DATA-->>CTRL: Stored
    deactivate DATA

    CTRL-->>UI: Response
    deactivate CTRL
```

### 2.4 PS — Physical Scenario (PA Layer)

```mermaid
sequenceDiagram
    participant HW_UI as Physical Component:<br/>HMI Panel
    participant HW_CPU as Physical Node:<br/>Main CPU
    participant HW_DB as Physical Node:<br/>Database Server
    participant HW_NET as Physical Node:<br/>Network Switch
    participant HW_EXT as Physical Component:<br/>External API

    Note over HW_UI,HW_EXT: Physical Scenario: System Startup

    HW_UI->>HW_CPU: Power On Signal
    activate HW_CPU
    HW_CPU->>HW_CPU: Boot Sequence
    HW_CPU->>HW_NET: Initialize Network
    activate HW_NET
    HW_NET-->>HW_CPU: Network Ready
    deactivate HW_NET

    HW_CPU->>HW_DB: Connect to Database
    activate HW_DB
    HW_DB-->>HW_CPU: Connection Established
    deactivate HW_DB

    HW_CPU->>HW_NET: Connect to External API
    activate HW_NET
    HW_NET->>HW_EXT: API Handshake
    activate HW_EXT
    HW_EXT-->>HW_NET: API Ready
    deactivate HW_EXT
    HW_NET-->>HW_CPU: External Connected
    deactivate HW_NET

    HW_CPU-->>HW_UI: System Ready
    deactivate HW_CPU
```

---

## 3. Architecture Blank Diagrams — ARCADIA Component Views

### 3.1 SAB — System Architecture Blank (SA Layer)

```mermaid
graph TB
    subgraph "System Boundary"
        subgraph "System Functions"
            SF1["System Function:<br/>Process Navigation Data"]
            SF2["System Function:<br/>Manage Communications"]
            SF3["System Function:<br/>Track Aircraft Position"]
        end

        subgraph "System Components"
            SC1["System Component:<br/>Navigation Module"]
            SC2["System Component:<br/>Communication Module"]
            SC3["System Component:<br/>Radar Module"]
        end
    end

    subgraph "External Actors"
        SA1["System Actor:<br/>Pilot"]
        SA2["System Actor:<br/>ATC"]
        SA3["System Actor:<br/>Ground Control"]
    end

    SF1 -->|"Functional Exchange:<br/>Route Data"| SF2
    SF2 -->|"Functional Exchange:<br/>Position Report"| SF3
    SF3 -->|"Functional Exchange:<br/>Tracking Data"| SF1

    SA1 -->|"Operational Exchange:<br/>Flight Plan"| SF1
    SA2 -->|"Operational Exchange:<br/>Clearance"| SF2
    SA3 -->|"Operational Exchange:<br/>Ground Instructions"| SF3

    SC1 -.->|"Allocation"| SF1
    SC2 -.->|"Allocation"| SF2
    SC3 -.->|"Allocation"| SF3
```

### 3.2 LAB — Logical Architecture Blank (LA Layer)

```mermaid
graph TB
    subgraph "Logical Architecture"
        subgraph "Logical Components"
            LC1["Logical Component:<br/>Navigation Logic"]
            LC2["Logical Component:<br/>Communication Logic"]
            LC3["Logical Component:<br/>Radar Processing"]
            LC4["Logical Component:<br/>Data Management"]
        end

        subgraph "Logical Functions"
            LF1["Logical Function:<br/>Calculate Route"]
            LF2["Logical Function:<br/>Transmit Data"]
            LF3["Logical Function:<br/>Process Echo"]
            LF4["Logical Function:<br/>Store Records"]
        end
    end

    subgraph "Logical Actors"
        LA1["Logical Actor:<br/>Pilot Interface"]
        LA2["Logical Actor:<br/>ATC Interface"]
    end

    LC1 -->|"Component Exchange:<br/>Route Request"| LC2
    LC2 -->|"Component Exchange:<br/>Position Data"| LC3
    LC3 -->|"Component Exchange:<br/>Tracking Info"| LC4
    LC4 -->|"Component Exchange:<br/>History Data"| LC1

    LA1 -->|"Exchange:<br/>Input"| LC1
    LA2 -->|"Exchange:<br/>Output"| LC2

    LC1 -.->|"Function Allocation"| LF1
    LC2 -.->|"Function Allocation"| LF2
    LC3 -.->|"Function Allocation"| LF3
    LC4 -.->|"Function Allocation"| LF4
```

### 3.3 PAB — Physical Architecture Blank (PA Layer)

```mermaid
graph TB
    subgraph "Physical Architecture"
        subgraph "Physical Nodes"
            PN1["Physical Node:<br/>Main Computer"]
            PN2["Physical Node:<br/>Communication Server"]
            PN3["Physical Node:<br/>Radar Station"]
        end

        subgraph "Physical Components"
            PC1["Physical Component:<br/>Navigation Software"]
            PC2["Physical Component:<br/>Comm Driver"]
            PC3["Physical Component:<br/>Radar Software"]
            PC4["Physical Component:<br/>Database Service"]
        end
    end

    subgraph "External Systems"
        ES1["Physical Actor:<br/>ATC System"]
        ES2["Physical Actor:<br/>Ground Network"]
    end

    PN1 <-->|"Physical Link:<br/>Ethernet"| PN2
    PN2 <-->|"Physical Link:<br/>Fiber"| PN3

    ES1 -->|"Physical Exchange"| PN2
    ES2 -->|"Physical Exchange"| PN1

    PN1 -.->|"Deployment"| PC1
    PN1 -.->|"Deployment"| PC4
    PN2 -.->|"Deployment"| PC2
    PN3 -.->|"Deployment"| PC3
```

---

## 4. Breakdown Diagrams — ARCADIA Hierarchies

### 4.1 OEB — Operational Entity Breakdown (OA Layer)

```mermaid
graph TB
    root["Operational Entity:<br/>Air Traffic Management"]

    root --> oe1["Operational Entity:<br/>Airports"]
    root --> oe2["Operational Entity:<br/>Aircraft"]
    root --> oe3["Operational Entity:<br/>ATC Centers"]

    oe1 --> oe1a["Operational Entity:<br/>Runway Control"]
    oe1 --> oe1b["Operational Entity:<br/>Terminal Control"]

    oe2 --> oe2a["Operational Entity:<br/>Commercial Aircraft"]
    oe2 --> oe2b["Operational Entity:<br/>Private Aircraft"]

    oe3 --> oe3a["Operational Entity:<br/>Area Control"]
    oe3 --> oe3b["Operational Entity:<br/>Approach Control"]
```

### 4.2 LCB — Logical Component Breakdown (LA Layer)

```mermaid
graph TB
    root["Logical Component:<br/>Flight Management System"]

    root --> lc1["Logical Component:<br/>Navigation Subsystem"]
    root --> lc2["Logical Component:<br/>Communication Subsystem"]
    root --> lc3["Logical Component:<br/>Monitoring Subsystem"]

    lc1 --> lc1a["Logical Component:<br/>Route Calculator"]
    lc1 --> lc1b["Logical Component:<br/>Position Tracker"]

    lc2 --> lc2a["Logical Component:<br/>Voice Handler"]
    lc2 --> lc2b["Logical Component:<br/>Data Link Handler"]

    lc3 --> lc3a["Logical Component:<br/>Radar Processor"]
    lc3 --> lc3b["Logical Component:<br/>Alert Manager"]
```

---

## 5. Traceability — Cross-Layer Links

```mermaid
graph LR
    subgraph "OA Layer"
        OEB["OEB<br/>Entities"]
        OAB["OAB<br/>Activities"]
        OIS["OIS<br/>Scenarios"]
    end

    subgraph "SA Layer"
        SAB["SAB<br/>System Architecture"]
        SS["SS<br/>System Scenarios"]
    end

    subgraph "LA Layer"
        LAB["LAB<br/>Logical Architecture"]
        LS["LS<br/>Logical Scenarios"]
    end

    subgraph "PA Layer"
        PAB["PAB<br/>Physical Architecture"]
        PS["PS<br/>Physical Scenarios"]
    end

    OIS -->|"Realization"| SS
    SS -->|"Realization"| LS
    LS -->|"Realization"| PS

    OAB -->|"Allocation"| SAB
    SAB -->|"Allocation"| LAB
    LAB -->|"Allocation"| PAB

    OEB -->|"Refinement"| SAB
    SAB -->|"Refinement"| LAB
    LAB -->|"Refinement"| PAB
```

---

*Generated for Arcadia web project — 2026-06-26*
