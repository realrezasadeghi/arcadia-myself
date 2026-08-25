import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { setFragmentOperands } from "../../presentation/server-actions/set-fragment-operands";

export function useSetFragmentOperands() {
  return useServerMutation({
    mutationFn: (payload: {
      fragmentId: string;
      operands: { position: number; guard: string }[];
    }) => setFragmentOperands(payload),
  });
}
