import {
  type UseMutationOptions,
  type UseMutationResult,
  useMutation,
} from "@tanstack/react-query";
import type { IRes } from "../../utils/response";

export function useServerMutation<TData = unknown, TVariables = void>(
  options: Omit<
    UseMutationOptions<IRes<TData>, IRes, TVariables>,
    "mutationFn"
  > & {
    mutationFn: (variables: TVariables) => Promise<IRes<TData>>;
  },
): UseMutationResult<IRes<TData>, IRes, TVariables> {
  const { mutationFn, ...rest } = options;

  return useMutation<IRes<TData>, IRes, TVariables>({
    ...rest,
    mutationFn: async (variables: TVariables) => {
      const res = await mutationFn(variables); // ✅ Now strongly typed as IRes<TData>
      if (!res.success) throw res;
      return res;
    },
  });
}
