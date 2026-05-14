import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import { User } from "../../domain/entities/user";
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

export class GetMeUseCase implements IUseCase<GetMePayload, GetMeResponse> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(payload: GetMePayload): Promise<GetMeResponse> {
    try {
      const response = await this.userRepository.getMe({
        token: payload.token,
      });

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
