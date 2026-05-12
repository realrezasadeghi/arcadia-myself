export type RegisterDTOProps = {
  name: string;
  username: string;
  password: string;
};

export class RegisterDTO {
  public readonly name: string;
  public readonly username: string;
  public readonly password: string;

  private constructor(props: RegisterDTO) {
    this.name = props.name;
    this.username = props.username;
    this.password = props.password;
  }

  static create(data: {
    name: string;
    username: string;
    password: string;
  }): RegisterDTO {
    const name = RegisterDTO.validateName(data.name);
    const username = RegisterDTO.validateUsername(data.username);
    const password = RegisterDTO.validatePassword(data.password);

    return new RegisterDTO({ name, username, password });
  }

  private static validateName(name: string): string {
    const trimmed = name.trim();

    if (!trimmed) {
      throw new Error("Name is required.");
    }

    return name.trim();
  }

  private static validateUsername(username: string): string {
    const trimmed = username?.trim();

    if (!trimmed) {
      throw new Error("Username cannot be empty");
    }

    // Only English letters, digits, underscore and dot are allowed
    if (!/^[a-zA-Z0-9._]+$/.test(trimmed)) {
      throw new Error(
        "Username can only contain English letters, numbers, underscores, and dots",
      );
    }

    return trimmed;
  }

  private static validatePassword(password: string): string {
    if (!password || password.length < 8) {
      throw new Error("Password must be more than 8 characters");
    }
    return password;
  }
}
