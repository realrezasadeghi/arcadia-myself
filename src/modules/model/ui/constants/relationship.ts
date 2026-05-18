import type {
  RelationshipTypeInfo,
  RelationshipTypeValue,
  RelationshipVisualSpec,
} from "../types/relationship";

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
  {
    value: "Composition",
    label: "Composition",
    labelFa: "ترکیب",
    allowedFor: ["OA", "SA", "LA", "PA"],
  },
];

export const RELATIONSHIP_VISUAL: Record<
  RelationshipTypeValue,
  RelationshipVisualSpec
> = {
  OperationalExchange: {
    strokeColor: "#2E86C1",
    strokeWidth: 1.5,
    arrowEnd: "arrow",
  },
  InvolvementLink: {
    strokeColor: "#717D7E",
    strokeWidth: 1,
    arrowEnd: "open-arrow",
    strokeDash: "5,3",
  },
  FunctionalExchange: {
    strokeColor: "#CA6F1E",
    strokeWidth: 1.5,
    arrowEnd: "arrow",
  },
  SystemExchange: { strokeColor: "#1A5276", strokeWidth: 2, arrowEnd: "arrow" },
  LogicalExchange: {
    strokeColor: "#1E8449",
    strokeWidth: 1.5,
    arrowEnd: "arrow",
  },
  ComponentExchange: {
    strokeColor: "#1D8348",
    strokeWidth: 2,
    arrowEnd: "arrow",
  },
  ProvidedInterface: {
    strokeColor: "#1E8449",
    strokeWidth: 1.5,
    arrowEnd: "diamond",
  },
  RequiredInterface: {
    strokeColor: "#922B21",
    strokeWidth: 1.5,
    arrowEnd: "open-arrow",
    strokeDash: "4,2",
  },
  PhysicalExchange: {
    strokeColor: "#6C3483",
    strokeWidth: 1.5,
    arrowEnd: "arrow",
  },
  PhysicalLink: { strokeColor: "#2C3E50", strokeWidth: 2.5, arrowEnd: "none" },
  DeploymentLink: {
    strokeColor: "#7F8C8D",
    strokeWidth: 1,
    arrowEnd: "open-arrow",
    strokeDash: "6,3",
  },
  Composition: {
    strokeColor: "#7D3C98",
    strokeWidth: 1.5,
    arrowEnd: "diamond", // یا "none" بسته به نمایش
    strokeDash: "none",
  },
};
