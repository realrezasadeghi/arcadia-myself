import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import { User } from "../../domain/entities/user";
import type { IAuthRepository } from "../ports/auth";

export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResponse = {
  user: {
    id: number;
    name: string;
    username: string;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
};

export class LoginUseCase implements IUseCase<LoginPayload, LoginResponse> {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(payload: LoginPayload): Promise<LoginResponse> {
    try {
      const response = await this.authRepository.login(payload);

      const user = User.reconstitute({
        id: response.user.id,
        name: response.user.name,
        username: response.user.username,
        createdAt: response.user.created_at.toString(),
        updatedAt: response.user.updated_at.toString(),
      });

      return {
        user: user.toJSON(),
        token: response.token,
      };
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in login"));
    }
  }
}
