import type { IUseCase } from "@/modules/shared/application/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import { User } from "../../domain/entities/user";
import { LoginDTO, type LoginDTOProps } from "../dtos/login";
import type { IAuthRepository } from "../ports/auth";
import type { ITokenService } from "../ports/token";

type LoginResponse = {
  id: number;
  name: string;
  username: string;
  createdAt: string;
  updatedAt: string;
};

export class LoginUseCase implements IUseCase<LoginDTOProps, LoginResponse> {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(props: LoginDTOProps): Promise<LoginResponse> {
    try {
      const dto = LoginDTO.create(props);

      const response = await this.authRepository.login(dto);

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
      throw new Error(resolveErrorMessage(error, "Error in login"));
    }
  }
}
