import { useMutation } from "@tanstack/react-query";
import { create } from "../../presentation/server-actions/create";

export function useCreateProject() {
  return useMutation({
    mutationFn: create,
  });
}
