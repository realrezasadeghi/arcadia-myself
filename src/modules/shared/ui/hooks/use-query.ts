import {
  type QueryKey,
  type UseQueryOptions,
  type UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import type { IRes } from "../../utils/response";

export function useServerQuery<
  TData = unknown,
  TError = IRes,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: Omit<UseQueryOptions<TData, TError, TData, TQueryKey>, "queryFn"> & {
    queryFn: () => Promise<IRes<TData>>;
  },
): UseQueryResult<TData, TError> {
  const { queryFn, ...rest } = options;

  return useQuery<TData, TError, TData, TQueryKey>({
    ...rest,
    queryFn: async () => {
      const res = await queryFn(); // res: IRes<TData>
      if (!res.success) throw res; // triggers onError
      return res.data; // unwrap to TData
    },
  });
}
