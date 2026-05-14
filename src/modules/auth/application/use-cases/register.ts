import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import { User } from "../../domain/entities/user";
import type { IAuthRepository } from "../ports/auth";

export type RegisterPayload = {
  username: string;
  password: string;
  name: string;
};

export type RegisterResponse = {
  user: {
    id: number;
    name: string;
    username: string;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
};

export class RegisterUseCase
  implements IUseCase<RegisterPayload, RegisterResponse>
{
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(payload: RegisterPayload): Promise<RegisterResponse> {
    try {
      const response = await this.authRepository.register(payload);

      const user = User.reconstitute({
        id: response.user.id,
        name: response.user.name,
        username: response.user.username,
        createdAt: response.user.created_at.toString(),
        updatedAt: response.user.updated_at.toString(),
      });

      return {
        token: response.token,
        user: user.toJSON(),
      };
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in register"));
    }
  }
}
