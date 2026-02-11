import { useQuery } from "@tanstack/react-query";
import { matchApi } from "@/api/matches";

export const useMatchDetail = (id: string) => {
  return useQuery({
    queryKey: ["matches", id],
    queryFn: () => matchApi.getMatchById(id),
    enabled: !!id,
    refetchInterval: 5000,
  });
};
