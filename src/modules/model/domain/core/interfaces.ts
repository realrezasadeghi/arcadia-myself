import type { ElementType } from "../value-objects/element-type";
import type { Layer } from "../value-objects/layer";

/** Any element with identity */
export interface Identifiable {
  readonly id: string;
}

/** Any element with a human-readable name */
export interface Named {
  readonly name: string;
  readonly description: string | undefined;
}

/** Any element that belongs to a typed category */
export interface Typed {
  readonly type: ElementType;
}

/** Any element that lives in an Arcadia layer */
export interface Layered {
  readonly layer: Layer;
}

/** Any element that exists within a model */
export interface Scoped {
  readonly modelId: string;
}

/** Any element that has temporal metadata */
export interface Timestamped {
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/** Composite: a semantic model element */
export interface SemanticElement
  extends Identifiable,
    Named,
    Typed,
    Layered,
    Scoped,
    Timestamped {}

/** A connection between two semantic elements */
export interface SemanticRelation extends Identifiable, Named, Scoped {
  readonly sourceId: string;
  readonly targetId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/** A cross-layer trace link between elements */
export interface SemanticTraceLink extends Identifiable {
  readonly sourceElementId: string;
  readonly sourceLayer: Layer;
  readonly targetElementId: string;
  readonly targetLayer: Layer;
  readonly description: string | undefined;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
