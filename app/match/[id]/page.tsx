"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/context/SocketContext";
import { useMatchDetail } from "@/hooks/useMatchDetails";
import { useMatchSubscription } from "@/hooks/useMatchSubscription";
import { MatchStats } from "@/components/match-stats";
import { MatchTimeline } from "@/components/match-timeline";
import { MatchChat } from "@/components/match-chat";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getMatchStatusText, isMatchLive } from "@/utils/utils";
import { MatchEvent, MatchStatistics } from "@/utils/types";
import { DebugPanel } from "@/components/debug-panel";

interface MatchDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function MatchDetailPage({ params }: MatchDetailPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { socket, isConnected } = useSocket();
  const { data, isLoading } = useMatchDetail(resolvedParams.id);

  const [liveScore, setLiveScore] = useState({ home: 0, away: 0 });
  const [liveMinute, setLiveMinute] = useState(0);
  const [liveStatus, setLiveStatus] = useState("");
  const [liveEvents, setLiveEvents] = useState<MatchEvent[]>([]);
  const [liveStats, setLiveStats] = useState<MatchStatistics | null>(null);

  useEffect(() => {
    if (data?.data) {
      setLiveScore({ home: data.data.homeScore, away: data.data.awayScore });
      setLiveMinute(data.data.minute);
      setLiveStatus(data.data.status);
      setLiveEvents(data.data.events || []);
      setLiveStats(data.data.statistics);
    }
  }, [data?.data]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.emit("subscribe_match", { matchId: resolvedParams.id });

    const handleScoreUpdate = (update: {
      matchId: string;
      homeScore: number;
      awayScore: number;
    }) => {
      if (update.matchId === resolvedParams.id) {
        setLiveScore({ home: update.homeScore, away: update.awayScore });
      }
    };

    const handleMatchEvent = (event: MatchEvent & { matchId: string }) => {
      if (event.matchId === resolvedParams.id) {
        setLiveEvents((prev) => [...prev, event]);
      }
    };

    const handleStatsUpdate = (update: {
      matchId: string;
      statistics: MatchStatistics;
    }) => {
      if (update.matchId === resolvedParams.id) {
        setLiveStats(update.statistics);
      }
    };

    const handleStatusChange = (update: {
      matchId: string;
      status: string;
      minute: number;
    }) => {
      if (update.matchId === resolvedParams.id) {
        setLiveStatus(update.status);
        setLiveMinute(update.minute);
      }
    };

    socket.on("score_update", handleScoreUpdate);
    socket.on("match_event", handleMatchEvent);
    socket.on("stats_update", handleStatsUpdate);
    socket.on("status_change", handleStatusChange);

    return () => {
      socket.emit("unsubscribe_match", { matchId: resolvedParams.id });
      socket.off("score_update", handleScoreUpdate);
      socket.off("match_event", handleMatchEvent);
      socket.off("stats_update", handleStatsUpdate);
      socket.off("status_change", handleStatusChange);
    };
  }, [socket, isConnected, resolvedParams.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Match not found</h2>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const match = data.data;
  const isLive = isMatchLive(liveStatus as any);
  const statusText = getMatchStatusText(liveStatus as any, liveMinute);

  const homeGoals = liveEvents.filter(
    (event) => event.type.toLowerCase() === "goal" && event.team === "home",
  );
  const awayGoals = liveEvents.filter(
    (event) => event.type.toLowerCase() === "goal" && event.team === "away",
  );
  const homeCards = liveEvents.filter(
    (event) =>
      (event.type.toLowerCase() === "yellow_card" ||
        event.type.toLowerCase() === "red_card") &&
      event.team === "home",
  );
  const awayCards = liveEvents.filter(
    (event) =>
      (event.type.toLowerCase() === "yellow_card" ||
        event.type.toLowerCase() === "red_card") &&
      event.team === "away",
  );

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="bg-card border border-zinc-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              {isLive && (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-emerald-500 text-sm font-medium">
                    LIVE
                  </span>
                </div>
              )}
              <span className="text-sm text-muted-foreground">
                {statusText}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 items-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">{match.homeTeam.name}</h2>
              <div className="text-6xl font-bold">{liveScore.home}</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">VS</div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">{match.awayTeam.name}</h2>
              <div className="text-6xl font-bold">{liveScore.away}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 items-start mt-6 min-h-[60px]">
            <div className="space-y-2">
              {homeGoals.length > 0 ? (
                homeGoals.map((event) => (
                  <div key={event.id} className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-medium">
                        ⚽️ {event.player}
                      </span>
                      <span className="text-muted-foreground">
                        {event.minute}'
                      </span>
                    </div>
                    {event.assistPlayer && (
                      <div className="text-xs text-muted-foreground pl-2">
                        🦶 Assist: {event.assistPlayer}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-xs text-muted-foreground italic">
                  No goals yet
                </div>
              )}
            </div>

            <div />

            <div className="space-y-2 text-right">
              {awayGoals.length > 0 ? (
                awayGoals.map((event) => (
                  <div key={event.id} className="text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-muted-foreground">
                        {event.minute}'
                      </span>
                      <span className="text-emerald-500 font-medium">
                        {event.player} ⚽️
                      </span>
                    </div>
                    {event.assistPlayer && (
                      <div className="text-xs text-muted-foreground pr-2">
                        🦶 Assist: {event.assistPlayer}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-xs text-muted-foreground italic">
                  No goals yet
                </div>
              )}
            </div>
          </div>

          {(homeCards.length > 0 || awayCards.length > 0) && (
            <div className="grid grid-cols-3 gap-8 items-start mt-4 pt-4 border-t border-zinc-800">
              <div className="space-y-1">
                {homeCards.map((event) => (
                  <div
                    key={event.id}
                    className="text-xs flex items-center gap-2"
                  >
                    <div
                      className={`w-3 h-4 rounded-sm ${event.type.toLowerCase() === "yellow_card" ? "bg-yellow-500" : "bg-red-500"}`}
                    />
                    <span className="text-muted-foreground">
                      {event.player}
                    </span>
                    <span className="text-muted-foreground">
                      {event.minute}'
                    </span>
                  </div>
                ))}
              </div>

              <div />

              <div className="space-y-1 text-right">
                {awayCards.map((event) => (
                  <div
                    key={event.id}
                    className="text-xs flex items-center justify-end gap-2"
                  >
                    <span className="text-muted-foreground">
                      {event.minute}'
                    </span>
                    <span className="text-muted-foreground">
                      {event.player}
                    </span>
                    <div
                      className={`w-3 h-4 rounded-sm ${event.type.toLowerCase() === "yellow_card" ? "bg-yellow-500" : "bg-red-500"}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <DebugPanel
              title="Debug: Match Data"
              data={{
                totalEvents: liveEvents.length,
                events: liveEvents,
                homeGoals: homeGoals.length,
                awayGoals: awayGoals.length,
                rawData: data?.data,
              }}
            />
            <MatchTimeline
              events={liveEvents}
              homeTeamName={match.homeTeam.name}
              awayTeamName={match.awayTeam.name}
            />
            {liveStats && <MatchStats statistics={liveStats} />}
          </div>

          <div>
            <MatchChat matchId={resolvedParams.id} />
          </div>
        </div>
      </div>
    </main>
  );
}
