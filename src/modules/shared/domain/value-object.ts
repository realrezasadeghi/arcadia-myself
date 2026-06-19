export abstract class ValueObject<TProps extends object> {
  protected readonly props: Readonly<TProps>;

  protected constructor(props: TProps) {
    this.validate(props);
    this.props = Object.freeze({ ...props });
  }

  protected abstract validate(props: TProps): void;

  equals(other: ValueObject<TProps>): boolean {
    if (!(other instanceof this.constructor)) return false;
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }

  toString(): string {
    return JSON.stringify(this.props);
  }
}
