import { ValueObject } from "@/modules/shared/domain/value-object";

interface ProjectNameProps {
  value: string;
}

export class ProjectName extends ValueObject<ProjectNameProps> {
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 100;

  protected validate(props: ProjectNameProps): void {
    const trimmed = props.value.trim();

    if (!trimmed) {
      throw new Error("نام پروژه نمی‌تواند خالی باشد");
    }
    if (trimmed.length < ProjectName.MIN_LENGTH) {
      throw new Error(
        `نام پروژه باید حداقل ${ProjectName.MIN_LENGTH} کاراکتر باشد`,
      );
    }
    if (trimmed.length > ProjectName.MAX_LENGTH) {
      throw new Error(
        `نام پروژه نمی‌تواند بیشتر از ${ProjectName.MAX_LENGTH} کاراکتر باشد`,
      );
    }
  }

  static create(value: string): ProjectName {
    return new ProjectName({ value: value.trim() });
  }

  get value(): string {
    return this.props.value;
  }

  toString(): string {
    return this.props.value;
  }
}
