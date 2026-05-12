import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { login } from "../../presentation/server-action/login";

export function useLogin() {
  return useServerMutation({
    mutationFn: login,
  });
}
