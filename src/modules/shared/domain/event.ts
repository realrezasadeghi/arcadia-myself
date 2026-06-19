/**
 * DomainEvent Base Class — DDD
 *
 * رویدادهایی که در Domain اتفاق می‌افتند و می‌توانند توسط سایر بخش‌ها observe شوند.
 */
export abstract class DomainEvent {
  readonly occurredAt: Date;
  readonly eventName: string;

  protected constructor(eventName: string) {
    this.eventName = eventName;
    this.occurredAt = new Date();
  }
}
