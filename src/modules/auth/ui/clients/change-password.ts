import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import type { ChangePasswordResponse } from "../../application/use-cases/change-password";
import type { ChangePasswordDTOProps } from "../../presentation/dtos/change-password";
import { changePassword } from "../../presentation/server-action/change-password";

export function useChangePassword() {
  return useServerMutation<ChangePasswordResponse, ChangePasswordDTOProps>({
    mutationFn: changePassword,
  });
}
