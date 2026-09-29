import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { logout } from "../../presentation/server-action/logout";

export function useLogout() {
  return useServerMutation<void, void>({ mutationFn: logout });
}
