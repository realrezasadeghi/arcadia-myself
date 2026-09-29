import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import type { GetMeResponse } from "../../application/use-cases/get-me";
import { getMe } from "../../presentation/server-action/get-me";

export const GET_ME_KEY = ["GET_ME"];

type UseGetMeOptions = {
  /** Server-prefetched value seeded into the cache so SSR and hydration agree. */
  initialData?: GetMeResponse;
};

export function useGetMe(options?: UseGetMeOptions) {
  return useServerQuery<GetMeResponse>({
    queryKey: GET_ME_KEY,
    queryFn: getMe,
    initialData: options?.initialData,
  });
}
