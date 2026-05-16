import type { ConnectionRule } from "../types/connection";

export const CONNECTION_RULES: ConnectionRule[] = [
  {
    relationshipType: "OperationalExchange",
    allowedSources: ["OperationalActivity"],
    allowedTargets: ["OperationalActivity"],
  },
  {
    relationshipType: "InvolvementLink",
    allowedSources: ["OperationalEntity", "OperationalActor"],
    allowedTargets: [
      "OperationalCapability",
      "OperationalActivity",
      "OperationalProcess",
    ],
  },
  {
    relationshipType: "FunctionalExchange",
    allowedSources: ["SystemFunction"],
    allowedTargets: ["SystemFunction"],
  },
  {
    relationshipType: "SystemExchange",
    allowedSources: ["System", "SystemActor"],
    allowedTargets: ["System", "SystemActor"],
  },
  {
    relationshipType: "LogicalExchange",
    allowedSources: ["LogicalFunction"],
    allowedTargets: ["LogicalFunction"],
  },
  {
    relationshipType: "ComponentExchange",
    allowedSources: ["LogicalComponent", "LogicalActor"],
    allowedTargets: ["LogicalComponent", "LogicalActor"],
  },
  {
    relationshipType: "ProvidedInterface",
    allowedSources: ["LogicalComponent"],
    allowedTargets: ["LogicalComponent"],
  },
  {
    relationshipType: "RequiredInterface",
    allowedSources: ["LogicalComponent"],
    allowedTargets: ["LogicalComponent"],
  },
  {
    relationshipType: "PhysicalExchange",
    allowedSources: ["PhysicalFunction"],
    allowedTargets: ["PhysicalFunction"],
  },
  {
    relationshipType: "PhysicalLink",
    allowedSources: ["PhysicalNode"],
    allowedTargets: ["PhysicalNode"],
  },
  {
    relationshipType: "DeploymentLink",
    allowedSources: ["PhysicalComponent"],
    allowedTargets: ["PhysicalNode"],
  },
];
