import type { RelationshipTypeInfo } from "../types/relationship";

export const RELATIONSHIP_TYPES: RelationshipTypeInfo[] = [
  {
    value: "OperationalExchange",
    label: "Operational Exchange",
    labelFa: "تبادل عملیاتی",
    allowedFor: ["OA"],
  },
  {
    value: "InvolvementLink",
    label: "Involvement Link",
    labelFa: "پیوند مشارکت",
    allowedFor: ["OA"],
  },
  {
    value: "FunctionalExchange",
    label: "Functional Exchange",
    labelFa: "تبادل تابعی",
    allowedFor: ["SA"],
  },
  {
    value: "SystemExchange",
    label: "System Exchange",
    labelFa: "تبادل سیستمی",
    allowedFor: ["SA"],
  },
  {
    value: "LogicalExchange",
    label: "Logical Exchange",
    labelFa: "تبادل منطقی",
    allowedFor: ["LA"],
  },
  {
    value: "ComponentExchange",
    label: "Component Exchange",
    labelFa: "تبادل مؤلفه",
    allowedFor: ["LA"],
  },
  {
    value: "ProvidedInterface",
    label: "Provided Interface",
    labelFa: "رابط ارائه‌شده",
    allowedFor: ["LA"],
  },
  {
    value: "RequiredInterface",
    label: "Required Interface",
    labelFa: "رابط مورد نیاز",
    allowedFor: ["LA"],
  },
  {
    value: "PhysicalExchange",
    label: "Physical Exchange",
    labelFa: "تبادل فیزیکی",
    allowedFor: ["PA"],
  },
  {
    value: "PhysicalLink",
    label: "Physical Link",
    labelFa: "پیوند فیزیکی",
    allowedFor: ["PA"],
  },
  {
    value: "DeploymentLink",
    label: "Deployment Link",
    labelFa: "پیوند استقرار",
    allowedFor: ["PA"],
  },
];
