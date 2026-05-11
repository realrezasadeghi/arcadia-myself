export type LoginDTOProps = {
  username: string;
  password: string;
};

export class LoginDTO {
  public readonly username: string;
  public readonly password: string;

  private constructor(props: LoginDTOProps) {
    this.username = props.username;
    this.password = props.password;
  }

  static create(props: LoginDTOProps): LoginDTO {
    return new LoginDTO({
      username: LoginDTO.validateUsername(props.username),
      password: LoginDTO.validatePassword(props.password),
    });
  }

  private static validateUsername(username: string): string {
    const trimmed = username.trim();

    if (!trimmed) {
      throw new Error("Username cannot be empty");
    }

    // Only English letters (a-z, A-Z), digits, underscore and dot are allowed
    const allowedPattern = /^[a-zA-Z0-9._]+$/;
    if (!allowedPattern.test(trimmed)) {
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
