import { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketContext";
import { MatchEvent, MatchStatistics } from "@/utils/types";

interface MatchSubscriptionData {
  score: { home: number; away: number };
  minute: number;
  status: string;
  events: MatchEvent[];
  statistics: MatchStatistics | null;
}

export const useMatchSubscription = (
  matchId: string,
  initialData?: MatchSubscriptionData,
) => {
  const { socket, isConnected } = useSocket();
  const [data, setData] = useState<MatchSubscriptionData>(
    initialData || {
      score: { home: 0, away: 0 },
      minute: 0,
      status: "",
      events: [],
      statistics: null,
    },
  );

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (!socket || !isConnected || !matchId) return;

    socket.emit("subscribe_match", { matchId });

    const handleScoreUpdate = (update: {
      matchId: string;
      homeScore: number;
      awayScore: number;
    }) => {
      if (update.matchId === matchId) {
        setData((prev) => ({
          ...prev,
          score: { home: update.homeScore, away: update.awayScore },
        }));
      }
    };

    const handleMatchEvent = (event: MatchEvent & { matchId: string }) => {
      if (event.matchId === matchId) {
        setData((prev) => ({
          ...prev,
          events: [...prev.events, event],
        }));
      }
    };

    const handleStatsUpdate = (update: {
      matchId: string;
      statistics: MatchStatistics;
    }) => {
      if (update.matchId === matchId) {
        setData((prev) => ({
          ...prev,
          statistics: update.statistics,
        }));
      }
    };

    const handleStatusChange = (update: {
      matchId: string;
      status: string;
      minute: number;
    }) => {
      if (update.matchId === matchId) {
        setData((prev) => ({
          ...prev,
          status: update.status,
          minute: update.minute,
        }));
      }
    };

    socket.on("score_update", handleScoreUpdate);
    socket.on("match_event", handleMatchEvent);
    socket.on("stats_update", handleStatsUpdate);
    socket.on("status_change", handleStatusChange);

    return () => {
      socket.emit("unsubscribe_match", { matchId });
      socket.off("score_update", handleScoreUpdate);
      socket.off("match_event", handleMatchEvent);
      socket.off("stats_update", handleStatsUpdate);
      socket.off("status_change", handleStatusChange);
    };
  }, [socket, isConnected, matchId]);

  return data;
};
