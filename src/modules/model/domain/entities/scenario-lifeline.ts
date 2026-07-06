import { Entity } from "@/modules/shared/domain/entity";
import { LifelineType } from "../value-objects/lifeline-type";

export interface LifelineLayout {
  position: { x: number; y: number };
  size: { width: number; height: number };
  headPosition: number;
}

interface ScenarioLifelineProps {
  diagramId: string;
  elementId: string;
  type: LifelineType;
  selector?: string;
  decomposed: boolean;
  layout: LifelineLayout;
  createdAt: Date;
  updatedAt: Date;
}

export class ScenarioLifeline extends Entity<string> {
  private readonly _diagramId: string;
  private readonly _elementId: string;
  private readonly _type: LifelineType;
  private _selector?: string;
  private _decomposed: boolean;
  private _layout: LifelineLayout;
  private _updatedAt: Date;
  readonly createdAt: Date;

  private constructor(id: string, props: ScenarioLifelineProps) {
    super(id);
    this._diagramId = props.diagramId;
    this._elementId = props.elementId;
    this._type = props.type;
    this._selector = props.selector;
    this._decomposed = props.decomposed;
    this._layout = props.layout;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    id: string;
    diagramId: string;
    elementId: string;
    type: string;
    selector?: string;
    decomposed?: boolean;
  }): ScenarioLifeline {
    const type = LifelineType.from(props.type);
    const now = new Date();

    return new ScenarioLifeline(props.id, {
      diagramId: props.diagramId,
      elementId: props.elementId,
      type,
      selector: props.selector,
      decomposed: props.decomposed ?? false,
      layout: {
        position: { x: 0, y: 0 },
        size: { width: 120, height: 600 },
        headPosition: 0,
      },
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: {
    id: string;
    diagramId: string;
    elementId: string;
    type: string;
    selector: string | undefined;
    decomposed: boolean;
    layout: LifelineLayout;
    createdAt: string;
    updatedAt: string;
  }): ScenarioLifeline {
    return new ScenarioLifeline(props.id, {
      diagramId: props.diagramId,
      elementId: props.elementId,
      type: LifelineType.from(props.type),
      selector: props.selector,
      decomposed: props.decomposed,
      layout: props.layout,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  get diagramId(): string {
    return this._diagramId;
  }

  get elementId(): string {
    return this._elementId;
  }

  get type(): LifelineType {
    return this._type;
  }

  get selector(): string | undefined {
    return this._selector;
  }

  get decomposed(): boolean {
    return this._decomposed;
  }

  get layout(): Readonly<LifelineLayout> {
    return this._layout;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateSelector(selector: string): void {
    this._selector = selector;
    this._touch();
  }

  setDecomposed(decomposed: boolean): void {
    this._decomposed = decomposed;
    this._touch();
  }

  updateLayout(layout: Partial<LifelineLayout>): void {
    this._layout = { ...this._layout, ...layout };
    this._touch();
  }

  moveHead(headPosition: number): void {
    this._layout = { ...this._layout, headPosition };
    this._touch();
  }

  toJSON() {
    return {
      id: this._id,
      diagramId: this._diagramId,
      elementId: this._elementId,
      type: this._type.value,
      selector: this._selector,
      decomposed: this._decomposed,
      layout: this._layout,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }

  private _touch(): void {
    this._updatedAt = new Date();
  }
}