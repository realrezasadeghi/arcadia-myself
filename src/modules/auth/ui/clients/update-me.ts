import { useQueryClient } from "@tanstack/react-query";
import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import type { UpdateMeResponse } from "../../application/use-cases/update-me";
import type { UpdateMeDTOProps } from "../../presentation/dtos/update-me";
import { updateMe } from "../../presentation/server-action/update-me";
import { GET_ME_KEY } from "./get-me";

export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useServerMutation<UpdateMeResponse, UpdateMeDTOProps>({
    mutationFn: updateMe,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: GET_ME_KEY });
    },
  });
}
