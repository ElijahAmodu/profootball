import { apiClient } from "@/lib/axios";
import { ApiResponse, MatchesResponse, MatchDetail } from "@/utils/types";

export const matchApi = {
  getMatches: async (): Promise<ApiResponse<MatchesResponse>> => {
    const response = await apiClient.get("/api/matches");
    return response.data;
  },

  getLiveMatches: async (): Promise<ApiResponse<MatchesResponse>> => {
    const response = await apiClient.get("/api/matches/live");
    return response.data;
  },

  getMatchById: async (id: string): Promise<ApiResponse<MatchDetail>> => {
    const response = await apiClient.get(`/api/matches/${id}`);
    return response.data;
  },

  healthCheck: async (): Promise<ApiResponse<{ status: string }>> => {
    const response = await apiClient.get("/health");
    return response.data;
  },
};
