import { useMutation } from "@tanstack/react-query";
import { updateMe } from "../../presentation/server-action/update-me";

export function useUpdateMe() {
  return useMutation({
    mutationFn: updateMe,
  });
}
