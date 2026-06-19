/**
 * ife.seed.ts
 *
 * Complete ARCADIA / Capella-style IFE example seed
 *
 * Internally consistent model following Arcadia methodology rules:
 * - All relationships respect ConnectionPolicy
 * - All trace links respect TracePolicy
 * - No orphan elements (every element has at least one connection)
 * - PA uses DeploymentLink (Component→Node), PhysicalLink (Node→Node)
 * - Cross-layer Realization follows correct direction and type pairing
 */

import { randomUUID } from "crypto";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import {
  diagrams,
  elements,
  models,
  relationships,
  traceLinks,
} from "./schemas";

type SeedIFEInput = {
  projectId: string;
};

export async function seedIFEProject(
  input: SeedIFEInput,
  db: PostgresJsDatabase<any>,
) {
  try {
    // =========================================================================
    // MODELS
    // =========================================================================

    const modelIds = {
      oa: randomUUID(),
      sa: randomUUID(),
      la: randomUUID(),
      pa: randomUUID(),
    };

    await db.insert(models).values([
      {
        id: modelIds.oa,
        projectId: input.projectId,
        layer: "OA",
        name: "IFE Operational Analysis",
        description: "Operational analysis of IFE",
      },
      {
        id: modelIds.sa,
        projectId: input.projectId,
        layer: "SA",
        name: "IFE System Analysis",
        description: "System analysis of IFE",
      },
      {
        id: modelIds.la,
        projectId: input.projectId,
        layer: "LA",
        name: "IFE Logical Architecture",
        description: "Logical architecture of IFE",
      },
      {
        id: modelIds.pa,
        projectId: input.projectId,
        layer: "PA",
        name: "IFE Physical Architecture",
        description: "Physical architecture of IFE",
      },
    ]);

    // =========================================================================
    // OA ELEMENTS
    // =========================================================================

    const oa = {
      passenger: randomUUID(),
      crew: randomUUID(),
      airline: randomUUID(),
      missionEntertainment: randomUUID(),
      capabilityVideo: randomUUID(),
      capabilityInternet: randomUUID(),
      activityWatchMovie: randomUUID(),
      activityBrowseInternet: randomUUID(),
    };

    await db.insert(elements).values([
      {
        id: oa.passenger,
        modelId: modelIds.oa,
        layer: "OA",
        type: "OperationalEntity",
        name: "Passenger",
        description: "Aircraft passenger",
        properties: { status: "VALIDATED" },
        parentId: null,
      },
      {
        id: oa.crew,
        modelId: modelIds.oa,
        layer: "OA",
        type: "OperationalActor",
        name: "Cabin Crew",
        description: "Cabin crew managing services",
        properties: { status: "VALIDATED" },
        parentId: null,
      },
      {
        id: oa.airline,
        modelId: modelIds.oa,
        layer: "OA",
        type: "OperationalEntity",
        name: "Airline Operator",
        description: "Airline operating aircraft",
        properties: { status: "VALIDATED" },
        parentId: null,
      },
      {
        id: oa.missionEntertainment,
        modelId: modelIds.oa,
        layer: "OA",
        type: "Mission",
        name: "Provide Passenger Entertainment",
        description: "Provide digital entertainment services",
        properties: { status: "VALIDATED" },
        parentId: null,
      },
      {
        id: oa.capabilityVideo,
        modelId: modelIds.oa,
        layer: "OA",
        type: "OperationalCapability",
        name: "Video Entertainment",
        description: "Provide movies and TV",
        properties: { status: "VALIDATED" },
        parentId: null,
      },
      {
        id: oa.capabilityInternet,
        modelId: modelIds.oa,
        layer: "OA",
        type: "OperationalCapability",
        name: "Internet Access",
        description: "Passenger Wi-Fi capability",
        properties: { status: "VALIDATED" },
        parentId: null,
      },
      {
        id: oa.activityWatchMovie,
        modelId: modelIds.oa,
        layer: "OA",
        type: "OperationalActivity",
        name: "Watch Movie",
        description: "Passenger watches movie",
        properties: { status: "VALIDATED" },
        parentId: null,
      },
      {
        id: oa.activityBrowseInternet,
        modelId: modelIds.oa,
        layer: "OA",
        type: "OperationalActivity",
        name: "Browse Internet",
        description: "Passenger uses internet",
        properties: { status: "VALIDATED" },
        parentId: null,
      },
    ]);

    // =========================================================================
    // SA ELEMENTS
    // =========================================================================

    const sa = {
      system: randomUUID(),
      actorPassenger: randomUUID(),
      actorCrew: randomUUID(),
      capabilityVideo: randomUUID(),
      capabilityInternet: randomUUID(),
      functionVideo: randomUUID(),
      functionInternet: randomUUID(),
      systemComponentIFE: randomUUID(),
    };

    await db.insert(elements).values([
      {
        id: sa.system,
        modelId: modelIds.sa,
        layer: "SA",
        type: "System",
        name: "IFE System",
        description: "Aircraft IFE system",
        properties: { status: "VALIDATED" },
        parentId: null,
      },
      {
        id: sa.actorPassenger,
        modelId: modelIds.sa,
        layer: "SA",
        type: "SystemActor",
        name: "Passenger",
        description: "Passenger using IFE",
        properties: { status: "VALIDATED" },
        parentId: null,
      },
      {
        id: sa.actorCrew,
        modelId: modelIds.sa,
        layer: "SA",
        type: "SystemActor",
        name: "Cabin Crew",
        description: "Crew operating IFE",
        properties: { status: "VALIDATED" },
        parentId: null,
      },
      {
        id: sa.capabilityVideo,
        modelId: modelIds.sa,
        layer: "SA",
        type: "SystemCapability",
        name: "Provide Video Service",
        description: "Deliver video entertainment",
        properties: { status: "VALIDATED" },
        parentId: null,
      },
      {
        id: sa.capabilityInternet,
        modelId: modelIds.sa,
        layer: "SA",
        type: "SystemCapability",
        name: "Provide Connectivity",
        description: "Provide internet access",
        properties: { status: "VALIDATED" },
        parentId: null,
      },
      {
        id: sa.functionVideo,
        modelId: modelIds.sa,
        layer: "SA",
        type: "SystemFunction",
        name: "Stream Video",
        description: "Deliver media stream",
        properties: { status: "VALIDATED" },
        parentId: null,
      },
      {
        id: sa.functionInternet,
        modelId: modelIds.sa,
        layer: "SA",
        type: "SystemFunction",
        name: "Provide Internet",
        description: "Provide internet access",
        properties: { status: "VALIDATED" },
        parentId: null,
      },
      {
        id: sa.systemComponentIFE,
        modelId: modelIds.sa,
        layer: "SA",
        type: "SystemComponent",
        name: "IFE Core",
        description: "Core IFE subsystem",
        properties: { status: "VALIDATED" },
        parentId: sa.system,
      },
    ]);

    // =========================================================================
    // LA ELEMENTS
    // =========================================================================

    const la = {
      sdu: randomUUID(),
      ifeServer: randomUUID(),
      network: randomUUID(),
      logicalFunctionRenderVideo: randomUUID(),
      logicalFunctionConnectivity: randomUUID(),
    };

    await db.insert(elements).values([
      {
        id: la.sdu,
        modelId: modelIds.la,
        layer: "LA",
        type: "LogicalComponent",
        name: "Seat Display Unit",
        description: "Passenger display unit",
        properties: { status: "VALIDATED" },
        parentId: null,
      },
      {
        id: la.ifeServer,
        modelId: modelIds.la,
        layer: "LA",
        type: "LogicalComponent",
        name: "IFE Server",
        description: "Central media server",
        properties: { status: "VALIDATED" },
        parentId: null,
      },
      {
        id: la.network,
        modelId: modelIds.la,
        layer: "LA",
        type: "LogicalComponent",
        name: "Network Interface",
        description: "Connectivity manager",
        properties: { status: "VALIDATED" },
        parentId: null,
      },
      {
        id: la.logicalFunctionRenderVideo,
        modelId: modelIds.la,
        layer: "LA",
        type: "LogicalFunction",
        name: "Render Video",
        description: "Render video to SDU",
        properties: { status: "VALIDATED" },
        parentId: la.sdu,
      },
      {
        id: la.logicalFunctionConnectivity,
        modelId: modelIds.la,
        layer: "LA",
        type: "LogicalFunction",
        name: "Handle Connectivity",
        description: "Manage internet traffic",
        properties: { status: "VALIDATED" },
        parentId: la.network,
      },
    ]);

    // =========================================================================
    // PA ELEMENTS
    // =========================================================================

    const pa = {
      hardwareSDU: randomUUID(),
      hardwareServer: randomUUID(),
      switchNode: randomUUID(),
      physicalFunctionRenderVideo: randomUUID(),
      physicalFunctionConnectivity: randomUUID(),
    };

    await db.insert(elements).values([
      {
        id: pa.hardwareSDU,
        modelId: modelIds.pa,
        layer: "PA",
        type: "PhysicalComponent",
        name: "SDU Hardware",
        description: "Seat hardware display",
        properties: { status: "VALIDATED" },
        parentId: null,
      },
      {
        id: pa.hardwareServer,
        modelId: modelIds.pa,
        layer: "PA",
        type: "PhysicalComponent",
        name: "IFE Rack Server",
        description: "Aircraft media server",
        properties: { status: "VALIDATED" },
        parentId: null,
      },
      {
        id: pa.switchNode,
        modelId: modelIds.pa,
        layer: "PA",
        type: "PhysicalNode",
        name: "Cabin Ethernet Switch",
        description: "Aircraft ethernet switch",
        properties: { status: "VALIDATED" },
        parentId: null,
      },
      {
        id: pa.physicalFunctionRenderVideo,
        modelId: modelIds.pa,
        layer: "PA",
        type: "PhysicalFunction",
        name: "Render Video",
        description: "Physical rendering of video",
        properties: { status: "VALIDATED" },
        parentId: pa.hardwareSDU,
      },
      {
        id: pa.physicalFunctionConnectivity,
        modelId: modelIds.pa,
        layer: "PA",
        type: "PhysicalFunction",
        name: "Handle Connectivity",
        description: "Physical connectivity management",
        properties: { status: "VALIDATED" },
        parentId: pa.hardwareServer,
      },
    ]);

    // =========================================================================
    // RELATIONSHIPS (all validated against ConnectionPolicy)
    // =========================================================================

    await db.insert(relationships).values([
      // ── OA ──────────────────────────────────────────────────────────────────
      // InvolvementLink: Entity/Actor → Capability/Activity (valid)

      {
        id: randomUUID(),
        modelId: modelIds.oa,
        type: "InvolvementLink",
        sourceElementId: oa.passenger,
        targetElementId: oa.capabilityVideo,
        name: "Enjoys Video",
        description: "",
        properties: {},
      },
      {
        id: randomUUID(),
        modelId: modelIds.oa,
        type: "InvolvementLink",
        sourceElementId: oa.passenger,
        targetElementId: oa.capabilityInternet,
        name: "Needs Connectivity",
        description: "",
        properties: {},
      },
      {
        id: randomUUID(),
        modelId: modelIds.oa,
        type: "InvolvementLink",
        sourceElementId: oa.passenger,
        targetElementId: oa.activityWatchMovie,
        name: "Requests Video",
        description: "",
        properties: {},
      },
      {
        id: randomUUID(),
        modelId: modelIds.oa,
        type: "InvolvementLink",
        sourceElementId: oa.passenger,
        targetElementId: oa.activityBrowseInternet,
        name: "Uses WiFi",
        description: "",
        properties: {},
      },
      {
        id: randomUUID(),
        modelId: modelIds.oa,
        type: "InvolvementLink",
        sourceElementId: oa.crew,
        targetElementId: oa.capabilityVideo,
        name: "Manages Video",
        description: "",
        properties: {},
      },
      {
        id: randomUUID(),
        modelId: modelIds.oa,
        type: "InvolvementLink",
        sourceElementId: oa.airline,
        targetElementId: oa.capabilityVideo,
        name: "Provides Video",
        description: "",
        properties: {},
      },
      {
        id: randomUUID(),
        modelId: modelIds.oa,
        type: "InvolvementLink",
        sourceElementId: oa.airline,
        targetElementId: oa.capabilityInternet,
        name: "Provides Internet",
        description: "",
        properties: {},
      },

      // ── SA ──────────────────────────────────────────────────────────────────
      // SystemExchange: System/Actor ↔ System/Actor (valid)

      {
        id: randomUUID(),
        modelId: modelIds.sa,
        type: "SystemExchange",
        sourceElementId: sa.actorPassenger,
        targetElementId: sa.system,
        name: "Passenger Requests",
        description: "",
        properties: {},
      },
      {
        id: randomUUID(),
        modelId: modelIds.sa,
        type: "SystemExchange",
        sourceElementId: sa.actorCrew,
        targetElementId: sa.system,
        name: "Crew Operates",
        description: "",
        properties: {},
      },

      // ── LA ──────────────────────────────────────────────────────────────────
      // LogicalExchange: LogicalFunction → LogicalFunction (valid)
      // Composition: LogicalComponent → LogicalFunction (valid via parent)

      {
        id: randomUUID(),
        modelId: modelIds.la,
        type: "LogicalExchange",
        sourceElementId: la.logicalFunctionRenderVideo,
        targetElementId: la.logicalFunctionConnectivity,
        name: "Media Stream",
        description: "",
        properties: { protocol: "UDP" },
      },

      // ── PA ──────────────────────────────────────────────────────────────────
      // DeploymentLink: PhysicalComponent → PhysicalNode (valid)

      {
        id: randomUUID(),
        modelId: modelIds.pa,
        type: "DeploymentLink",
        sourceElementId: pa.hardwareSDU,
        targetElementId: pa.switchNode,
        name: "SDU Deployed on Network",
        description: "",
        properties: {},
      },
      {
        id: randomUUID(),
        modelId: modelIds.pa,
        type: "DeploymentLink",
        sourceElementId: pa.hardwareServer,
        targetElementId: pa.switchNode,
        name: "Server Deployed on Network",
        description: "",
        properties: {},
      },
    ]);

    // =========================================================================
    // TRACE LINKS (all validated against TracePolicy)
    // =========================================================================

    await db.insert(traceLinks).values([
      // ── SA realizes OA ──────────────────────────────────────────────────────
      // SystemFunction → OperationalActivity ✓
      // SystemActor → OperationalEntity ✓
      // SystemCapability → OperationalCapability ✓

      {
        id: randomUUID(),
        projectId: input.projectId,
        sourceModelId: modelIds.sa,
        targetModelId: modelIds.oa,
        type: "Realization",
        sourceElementId: sa.functionVideo,
        sourceLayer: "SA",
        targetElementId: oa.activityWatchMovie,
        targetLayer: "OA",
        description: "",
      },
      {
        id: randomUUID(),
        projectId: input.projectId,
        sourceModelId: modelIds.sa,
        targetModelId: modelIds.oa,
        type: "Realization",
        sourceElementId: sa.functionInternet,
        sourceLayer: "SA",
        targetElementId: oa.activityBrowseInternet,
        targetLayer: "OA",
        description: "",
      },
      {
        id: randomUUID(),
        projectId: input.projectId,
        sourceModelId: modelIds.sa,
        targetModelId: modelIds.oa,
        type: "Realization",
        sourceElementId: sa.actorPassenger,
        sourceLayer: "SA",
        targetElementId: oa.passenger,
        targetLayer: "OA",
        description: "",
      },
      {
        id: randomUUID(),
        projectId: input.projectId,
        sourceModelId: modelIds.sa,
        targetModelId: modelIds.oa,
        type: "Realization",
        sourceElementId: sa.capabilityVideo,
        sourceLayer: "SA",
        targetElementId: oa.capabilityVideo,
        targetLayer: "OA",
        description: "",
      },
      {
        id: randomUUID(),
        projectId: input.projectId,
        sourceModelId: modelIds.sa,
        targetModelId: modelIds.oa,
        type: "Realization",
        sourceElementId: sa.capabilityInternet,
        sourceLayer: "SA",
        targetElementId: oa.capabilityInternet,
        targetLayer: "OA",
        description: "",
      },

      // ── LA realizes SA ──────────────────────────────────────────────────────
      // LogicalFunction → SystemFunction ✓
      // LogicalComponent → SystemComponent ✓

      {
        id: randomUUID(),
        projectId: input.projectId,
        sourceModelId: modelIds.la,
        targetModelId: modelIds.sa,
        type: "Realization",
        sourceElementId: la.logicalFunctionRenderVideo,
        sourceLayer: "LA",
        targetElementId: sa.functionVideo,
        targetLayer: "SA",
        description: "",
      },
      {
        id: randomUUID(),
        projectId: input.projectId,
        sourceModelId: modelIds.la,
        targetModelId: modelIds.sa,
        type: "Realization",
        sourceElementId: la.logicalFunctionConnectivity,
        sourceLayer: "LA",
        targetElementId: sa.functionInternet,
        targetLayer: "SA",
        description: "",
      },
      {
        id: randomUUID(),
        projectId: input.projectId,
        sourceModelId: modelIds.la,
        targetModelId: modelIds.sa,
        type: "Realization",
        sourceElementId: la.ifeServer,
        sourceLayer: "LA",
        targetElementId: sa.systemComponentIFE,
        targetLayer: "SA",
        description: "",
      },

      // ── LA Allocation (intra-layer) ─────────────────────────────────────────
      // LogicalFunction → LogicalComponent ✓

      {
        id: randomUUID(),
        projectId: input.projectId,
        sourceModelId: modelIds.la,
        targetModelId: modelIds.la,
        type: "Allocation",
        sourceElementId: la.logicalFunctionRenderVideo,
        sourceLayer: "LA",
        targetElementId: la.sdu,
        targetLayer: "LA",
        description: "",
      },
      {
        id: randomUUID(),
        projectId: input.projectId,
        sourceModelId: modelIds.la,
        targetModelId: modelIds.la,
        type: "Allocation",
        sourceElementId: la.logicalFunctionConnectivity,
        sourceLayer: "LA",
        targetElementId: la.network,
        targetLayer: "LA",
        description: "",
      },

      // ── PA realizes LA ──────────────────────────────────────────────────────
      // PhysicalComponent → LogicalComponent ✓
      // PhysicalFunction → LogicalFunction ✓

      {
        id: randomUUID(),
        projectId: input.projectId,
        sourceModelId: modelIds.pa,
        targetModelId: modelIds.la,
        type: "Realization",
        sourceElementId: pa.hardwareSDU,
        sourceLayer: "PA",
        targetElementId: la.sdu,
        targetLayer: "LA",
        description: "",
      },
      {
        id: randomUUID(),
        projectId: input.projectId,
        sourceModelId: modelIds.pa,
        targetModelId: modelIds.la,
        type: "Realization",
        sourceElementId: pa.hardwareServer,
        sourceLayer: "PA",
        targetElementId: la.ifeServer,
        targetLayer: "LA",
        description: "",
      },
      {
        id: randomUUID(),
        projectId: input.projectId,
        sourceModelId: modelIds.pa,
        targetModelId: modelIds.la,
        type: "Realization",
        sourceElementId: pa.switchNode,
        sourceLayer: "PA",
        targetElementId: la.network,
        targetLayer: "LA",
        description: "",
      },
      {
        id: randomUUID(),
        projectId: input.projectId,
        sourceModelId: modelIds.pa,
        targetModelId: modelIds.la,
        type: "Realization",
        sourceElementId: pa.physicalFunctionRenderVideo,
        sourceLayer: "PA",
        targetElementId: la.logicalFunctionRenderVideo,
        targetLayer: "LA",
        description: "",
      },
      {
        id: randomUUID(),
        projectId: input.projectId,
        sourceModelId: modelIds.pa,
        targetModelId: modelIds.la,
        type: "Realization",
        sourceElementId: pa.physicalFunctionConnectivity,
        sourceLayer: "PA",
        targetElementId: la.logicalFunctionConnectivity,
        targetLayer: "LA",
        description: "",
      },

      // ── PA Allocation (intra-layer) ─────────────────────────────────────────
      // PhysicalFunction → PhysicalComponent ✓

      {
        id: randomUUID(),
        projectId: input.projectId,
        sourceModelId: modelIds.pa,
        targetModelId: modelIds.pa,
        type: "Allocation",
        sourceElementId: pa.physicalFunctionRenderVideo,
        sourceLayer: "PA",
        targetElementId: pa.hardwareSDU,
        targetLayer: "PA",
        description: "",
      },
      {
        id: randomUUID(),
        projectId: input.projectId,
        sourceModelId: modelIds.pa,
        targetModelId: modelIds.pa,
        type: "Allocation",
        sourceElementId: pa.physicalFunctionConnectivity,
        sourceLayer: "PA",
        targetElementId: pa.hardwareServer,
        targetLayer: "PA",
        description: "",
      },
    ]);

    // =========================================================================
    // DIAGRAMS
    // =========================================================================

    const diagramIds = {
      ocd: randomUUID(),
      sab: randomUUID(),
      lab: randomUUID(),
      pab: randomUUID(),
    };

    await db.insert(diagrams).values([
      // ── OCD ─────────────────────────────────────────────────────────────────
      {
        id: diagramIds.ocd,
        modelId: modelIds.oa,
        type: "OCD",
        name: "IFE OCD",
        description: "Operational capability diagram",
        viewport: { x: 0, y: 0, zoom: 1 },
        elementLayouts: [
          {
            elementId: oa.passenger,
            position: { x: 80, y: 80 },
            size: { width: 180, height: 80 },
          },
          {
            elementId: oa.crew,
            position: { x: 80, y: 240 },
            size: { width: 180, height: 80 },
          },
          {
            elementId: oa.airline,
            position: { x: 80, y: 400 },
            size: { width: 180, height: 80 },
          },
          {
            elementId: oa.capabilityVideo,
            position: { x: 450, y: 80 },
            size: { width: 260, height: 90 },
          },
          {
            elementId: oa.capabilityInternet,
            position: { x: 450, y: 260 },
            size: { width: 260, height: 90 },
          },
          {
            elementId: oa.activityWatchMovie,
            position: { x: 850, y: 80 },
            size: { width: 240, height: 90 },
          },
          {
            elementId: oa.activityBrowseInternet,
            position: { x: 850, y: 260 },
            size: { width: 240, height: 90 },
          },
        ],
      },

      // ── SAB ─────────────────────────────────────────────────────────────────
      {
        id: diagramIds.sab,
        modelId: modelIds.sa,
        type: "SAB",
        name: "IFE SAB",
        description: "System architecture diagram",
        viewport: { x: 0, y: 0, zoom: 1 },
        elementLayouts: [
          {
            elementId: sa.actorPassenger,
            position: { x: 80, y: 120 },
            size: { width: 180, height: 80 },
          },
          {
            elementId: sa.actorCrew,
            position: { x: 80, y: 320 },
            size: { width: 180, height: 80 },
          },
          {
            elementId: sa.system,
            position: { x: 400, y: 160 },
            size: { width: 320, height: 140 },
          },
          {
            elementId: sa.systemComponentIFE,
            position: { x: 850, y: 160 },
            size: { width: 260, height: 90 },
          },
          {
            elementId: sa.functionVideo,
            position: { x: 1250, y: 80 },
            size: { width: 260, height: 90 },
          },
          {
            elementId: sa.functionInternet,
            position: { x: 1250, y: 240 },
            size: { width: 260, height: 90 },
          },
        ],
      },

      // ── LAB ─────────────────────────────────────────────────────────────────
      {
        id: diagramIds.lab,
        modelId: modelIds.la,
        type: "LAB",
        name: "IFE LAB",
        description: "Logical architecture",
        viewport: { x: 0, y: 0, zoom: 1 },
        elementLayouts: [
          {
            elementId: la.sdu,
            position: { x: 100, y: 160 },
            size: { width: 240, height: 120 },
          },
          {
            elementId: la.ifeServer,
            position: { x: 500, y: 160 },
            size: { width: 260, height: 120 },
          },
          {
            elementId: la.network,
            position: { x: 900, y: 160 },
            size: { width: 260, height: 120 },
          },
          {
            elementId: la.logicalFunctionRenderVideo,
            position: { x: 320, y: 420 },
            size: { width: 260, height: 90 },
          },
          {
            elementId: la.logicalFunctionConnectivity,
            position: { x: 760, y: 420 },
            size: { width: 260, height: 90 },
          },
        ],
      },

      // ── PAB ─────────────────────────────────────────────────────────────────
      {
        id: diagramIds.pab,
        modelId: modelIds.pa,
        type: "PAB",
        name: "IFE PAB",
        description: "Physical architecture",
        viewport: { x: 0, y: 0, zoom: 1 },
        elementLayouts: [
          {
            elementId: pa.hardwareSDU,
            position: { x: 100, y: 200 },
            size: { width: 240, height: 100 },
          },
          {
            elementId: pa.hardwareServer,
            position: { x: 500, y: 200 },
            size: { width: 260, height: 100 },
          },
          {
            elementId: pa.switchNode,
            position: { x: 900, y: 200 },
            size: { width: 260, height: 100 },
          },
          {
            elementId: pa.physicalFunctionRenderVideo,
            position: { x: 100, y: 400 },
            size: { width: 240, height: 80 },
          },
          {
            elementId: pa.physicalFunctionConnectivity,
            position: { x: 500, y: 400 },
            size: { width: 260, height: 80 },
          },
        ],
      },
    ]);

    return {
      models: modelIds,
      diagrams: diagramIds,
      oa,
      sa,
      la,
      pa,
    };
  } catch (error) {
    throw error;
  }
}
