import { useMutation } from "@tanstack/react-query";
import { logout } from "../../presentation/server-action/logout";

export function useLogout() {
  return useMutation({
    mutationFn: logout,
  });
}
