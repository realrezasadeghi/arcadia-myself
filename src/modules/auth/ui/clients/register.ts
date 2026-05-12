// import { useMutation } from "@tanstack/react-query";
import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { register } from "../../presentation/server-action/register";

export function useRegister() {
  return useServerMutation({
    mutationFn: register,
  });
}
