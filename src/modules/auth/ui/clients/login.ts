import { useMutation } from "@tanstack/react-query";
import { login } from "../../presentation/server-action/login";

export function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}
