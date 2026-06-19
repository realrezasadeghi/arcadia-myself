/**
 * Entity Base Class — DDD
 *
 * - دارای هویت منحصربه‌فرد (ID)
 * - برابری بر اساس ID
 * - حاوی state قابل تغییر با business rules
 */
export abstract class Entity<TId = string> {
  protected readonly _id: TId;

  protected constructor(id: TId) {
    this._id = id;
  }

  get id(): TId {
    return this._id;
  }

  equals(other: Entity<TId>): boolean {
    if (!(other instanceof this.constructor)) return false;
    return this._id === other._id;
  }
}
