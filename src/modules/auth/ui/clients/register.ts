import { useMutation } from "@tanstack/react-query";
import { register } from "../../presentation/server-action/register";

export function useRegister() {
  return useMutation({
    mutationFn: register,
  });
}
