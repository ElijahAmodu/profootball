import { useQuery } from "@tanstack/react-query";
import { matchApi } from "@/api/matches";

export const useMatches = () => {
  return useQuery({
    queryKey: ["matches"],
    queryFn: matchApi.getMatches,
    refetchInterval: 10000,
  });
};
