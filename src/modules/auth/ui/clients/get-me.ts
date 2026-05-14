import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../presentation/server-action/get-me";

export const GET_ME_KEY = ["GET_ME"];

export function useGetMe() {
  return useQuery({
    queryKey: GET_ME_KEY,
    queryFn: () => getMe().then((res) => res.data),
  });
}
