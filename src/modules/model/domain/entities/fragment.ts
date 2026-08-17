import { Entity } from "@/modules/shared/domain/entity";
import { FragmentOperator } from "../value-objects/fragment-operator";

interface FragmentProps {
  scenarioId: string;
  name: string;
  operator: FragmentOperator;
  guard: string;
  rowIndex: number;
  columnIndex: number;
  spanColumns: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Fragment — Entity
 *
 * A UML combined fragment in a sequence diagram.
 * Wraps a group of messages with a behavioral operator
 * (alt, opt, loop, break, par, critical, etc.).
 */
export class Fragment extends Entity<string> {
  private _name: string;
  private readonly _scenarioId: string;
  private readonly _operator: FragmentOperator;
  private _guard: string;
  private _rowIndex: number;
  private _columnIndex: number;
  private _spanColumns: number;
  private _updatedAt: Date;
  readonly createdAt: Date;

  private constructor(id: string, props: FragmentProps) {
    super(id);
    this._scenarioId = props.scenarioId;
    this._name = props.name;
    this._operator = props.operator;
    this._guard = props.guard;
    this._rowIndex = props.rowIndex;
    this._columnIndex = props.columnIndex;
    this._spanColumns = props.spanColumns;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    id: string;
    scenarioId: string;
    name: string;
    operator: string;
    guard?: string;
    rowIndex: number;
    columnIndex: number;
    spanColumns?: number;
  }): Fragment {
    if (!props.name.trim()) throw new Error("Fragment name is required");

    return new Fragment(props.id, {
      scenarioId: props.scenarioId,
      name: props.name.trim(),
      operator: FragmentOperator.from(props.operator),
      guard: props.guard ?? "",
      rowIndex: props.rowIndex,
      columnIndex: props.columnIndex,
      spanColumns: props.spanColumns ?? 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: {
    id: string;
    scenarioId: string;
    name: string;
    operator: string;
    guard: string;
    rowIndex: number;
    columnIndex: number;
    spanColumns: number;
    createdAt: string;
    updatedAt: string;
  }): Fragment {
    return new Fragment(props.id, {
      scenarioId: props.scenarioId,
      name: props.name,
      operator: FragmentOperator.from(props.operator),
      guard: props.guard,
      rowIndex: props.rowIndex,
      columnIndex: props.columnIndex,
      spanColumns: props.spanColumns,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  get scenarioId(): string {
    return this._scenarioId;
  }

  get name(): string {
    return this._name;
  }

  get operator(): FragmentOperator {
    return this._operator;
  }

  get guard(): string {
    return this._guard;
  }

  get rowIndex(): number {
    return this._rowIndex;
  }

  get columnIndex(): number {
    return this._columnIndex;
  }

  get spanColumns(): number {
    return this._spanColumns;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  rename(name: string): void {
    if (!name.trim()) throw new Error("Fragment name cannot be empty");
    this._name = name.trim();
    this._touch();
  }

  updateGuard(guard: string): void {
    this._guard = guard;
    this._touch();
  }

  setPosition(rowIndex: number, columnIndex: number): void {
    if (rowIndex < 0) throw new Error("Row index must be non-negative");
    if (columnIndex < 0) throw new Error("Column index must be non-negative");
    this._rowIndex = rowIndex;
    this._columnIndex = columnIndex;
    this._touch();
  }

  setSpanColumns(span: number): void {
    if (span < 1) throw new Error("Span columns must be at least 1");
    this._spanColumns = span;
    this._touch();
  }

  toJSON() {
    return {
      id: this._id,
      scenarioId: this._scenarioId,
      name: this._name,
      operator: this._operator.value,
      guard: this._guard,
      rowIndex: this._rowIndex,
      columnIndex: this._columnIndex,
      spanColumns: this._spanColumns,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }

  private _touch(): void {
    this._updatedAt = new Date();
  }
}
