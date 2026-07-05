import { Entity } from "@/modules/shared/domain/entity";

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

export interface ElementLayout {
  elementId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface DiagramLayoutProps {
  viewport: Viewport;
  elementPositions: Map<string, ElementLayout>;
}

/**
 * DiagramLayout — Entity
 *
 * Stores visual layout data (viewport, element positions) separately
 * from semantic diagram metadata. Uses diagramId as identity.
 */
export class DiagramLayout extends Entity<string> {
  private _viewport: Viewport;
  private readonly _elementPositions: Map<string, ElementLayout>;

  private constructor(id: string, props: DiagramLayoutProps) {
    super(id);
    this._viewport = { ...props.viewport };
    this._elementPositions = props.elementPositions;
  }

  static create(diagramId: string): DiagramLayout {
    return new DiagramLayout(diagramId, {
      viewport: { x: 0, y: 0, zoom: 1 },
      elementPositions: new Map(),
    });
  }

  static reconstitute(props: {
    diagramId: string;
    viewport: Viewport;
    elementLayouts: ElementLayout[];
  }): DiagramLayout {
    const positions = new Map<string, ElementLayout>();
    for (const l of props.elementLayouts) {
      positions.set(l.elementId, l);
    }
    return new DiagramLayout(props.diagramId, {
      viewport: props.viewport,
      elementPositions: positions,
    });
  }

  get diagramId(): string {
    return this._id;
  }

  get viewport(): Readonly<Viewport> {
    return this._viewport;
  }

  get elementLayouts(): ReadonlyArray<ElementLayout> {
    return Array.from(this._elementPositions.values());
  }

  updateViewport(viewport: Partial<Viewport>): void {
    this._viewport = { ...this._viewport, ...viewport };
  }

  placeElement(
    elementId: string,
    position: { x: number; y: number },
    size?: { width: number; height: number },
  ): void {
    this._elementPositions.set(elementId, {
      elementId,
      position,
      size: size ?? { width: 160, height: 60 },
    });
  }

  moveElement(elementId: string, position: { x: number; y: number }): void {
    const existing = this._elementPositions.get(elementId);
    if (!existing)
      throw new Error(`Element ${elementId} doesn't exist in layout.`);
    this._elementPositions.set(elementId, { ...existing, position });
  }

  removeElement(elementId: string): void {
    this._elementPositions.delete(elementId);
  }

  hasElement(elementId: string): boolean {
    return this._elementPositions.has(elementId);
  }

  getPosition(elementId: string): { x: number; y: number } | null {
    return this._elementPositions.get(elementId)?.position ?? null;
  }

  toJSON() {
    return {
      diagramId: this._id,
      viewport: this._viewport,
      elementLayouts: Array.from(this._elementPositions.values()),
    };
  }
}
