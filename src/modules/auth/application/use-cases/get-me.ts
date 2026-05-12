import type { IUseCase } from "@/modules/shared/application/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import { User } from "../../domain/entities/user";
import type { ITokenService } from "../ports/token";
import type { IUserRepository } from "../ports/user";

export type GetMePayload = {
  token: string;
};

export type GetMeResponse = {
  id: number;
  name: string;
  username: string;
  createdAt: string;
  updatedAt: string;
};

export class GetMeUseCase implements IUseCase<void, GetMeResponse> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(): Promise<GetMeResponse> {
    try {
      const token = await this.tokenService.get();

      if (!token) {
        throw new Error("Token is required but now is empty.");
      }

      const response = await this.userRepository.getMe({ token });

      const user = User.reconstitute({
        id: response.id,
        name: response.name,
        username: response.username,
        createdAt: response.created_at.toString(),
        updatedAt: response.updated_at.toString(),
      });

      return user.toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in get me"));
    }
  }
}
