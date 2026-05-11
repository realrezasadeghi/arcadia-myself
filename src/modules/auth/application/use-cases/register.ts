import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import { User } from "../../domain/entities/user";
import { RegisterDTO, type RegisterDTOProps } from "../dtos/register";
import type { IAuthRepository } from "../ports/auth";
import type { ITokenService } from "../ports/token";

export class RegisterUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(props: RegisterDTOProps) {
    try {
      const dto = RegisterDTO.create(props);

      const response = await this.authRepository.register(dto);

      const user = User.reconstitute({
        id: response.user.id,
        name: response.user.name,
        username: response.user.username,
        createdAt: response.user.created_at.toString(),
        updatedAt: response.user.updated_at.toString(),
      });

      await this.tokenService.save(response.token);

      return user.toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in register"));
    }
  }
}
