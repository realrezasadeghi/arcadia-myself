import { useMutation } from "@tanstack/react-query";
import { update } from "../../presentation/server-actions/update";

export function useUpdateProject() {
  return useMutation({
    mutationFn: update,
  });
}
