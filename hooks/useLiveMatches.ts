import { useQuery } from "@tanstack/react-query";
import { matchApi } from "@/api/matches";

export const useLiveMatches = () => {
  return useQuery({
    queryKey: ["matches", "live"],
    queryFn: matchApi.getLiveMatches,
    refetchInterval: 5000,
  });
};
