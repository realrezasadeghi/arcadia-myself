import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../presentation/server-action/change-password";

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}
