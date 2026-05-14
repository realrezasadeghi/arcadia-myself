import { useMutation } from "@tanstack/react-query";
import { remove } from "../../presentation/server-actions/remove";

export function useRemoveProject() {
  return useMutation({
    mutationFn: remove,
  });
}
