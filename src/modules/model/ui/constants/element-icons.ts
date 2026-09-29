import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Box,
  Boxes,
  Folder,
  FunctionSquare,
  HardDrive,
  LayoutDashboard,
  Link,
  Monitor,
  Package,
  Plug,
  Target,
  User,
  Users,
  Workflow,
} from "lucide-react";
import type { ClassElementTypeValue } from "../types/class-diagram";
import type { ElementTypeValue } from "../types/element";

/**
 * Icon for every element type the domain knows about.
 * Keyed by the domain `ElementTypeValue`, so TypeScript rejects a missing entry.
 */
const DOMAIN_ICONS: Record<ElementTypeValue, LucideIcon> = {
  // ── OA ──
  Mission: Monitor,
  OperationalEntity: Users,
  OperationalActor: User,
  OperationalActivity: Activity,
  OperationalCapability: Target,
  OperationalProcess: Workflow,

  // ── SA ──
  System: Monitor,
  SystemActor: User,
  SystemFunction: FunctionSquare,
  SystemCapability: Target,
  SystemComponent: Box,
  FunctionPort: Plug,

  // ── LA ──
  LogicalComponent: Box,
  LogicalActor: User,
  LogicalFunction: FunctionSquare,

  // ── PA ──
  PhysicalComponent: HardDrive,
  PhysicalNode: HardDrive,
  PhysicalFunction: FunctionSquare,
  PhysicalActor: User,

  // ── EPBS ──
  EPBSArchitecture: LayoutDashboard,
  ConfigurationItem: Package,
  ConfigurationItemPart: Package,
  ConfigurationItemInterface: Plug,
};

const CLASS_ICONS: Record<ClassElementTypeValue, LucideIcon> = {
  CLASS: Box,
  INTERFACE: Link,
  ENUM: Boxes,
  DATA_TYPE: Boxes,
  PRIMITIVE: Boxes,
  COLLECTION: Boxes,
  UNION: Boxes,
  PACKAGE: Folder,
};

/** Values persisted before the type unions were introduced. */
const LEGACY_ICONS: Record<string, LucideIcon> = {
  GROUP: Folder,
};

export function getElementTypeIcon(type: string): LucideIcon {
  if (type in DOMAIN_ICONS) return DOMAIN_ICONS[type as ElementTypeValue];
  if (type in CLASS_ICONS) return CLASS_ICONS[type as ClassElementTypeValue];
  return LEGACY_ICONS[type] ?? Monitor;
}
