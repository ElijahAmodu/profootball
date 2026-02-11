"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMatchDetail } from "@/hooks/useMatchDetails";
import { useMatchSubscription } from "@/hooks/useMatchSubscription";
import { MatchStats } from "@/components/match-stats";
import { MatchTimeline } from "@/components/match-timeline";
import { MatchChat } from "@/components/match-chat";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getMatchStatusText, isMatchLive } from "@/utils/utils";

interface MatchDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function MatchDetailPage({ params }: MatchDetailPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data, isLoading } = useMatchDetail(resolvedParams.id);

  const liveData = useMatchSubscription(
    resolvedParams.id,
    data?.data
      ? {
          score: { home: data.data.homeScore, away: data.data.awayScore },
          minute: data.data.minute,
          status: data.data.status,
          events: data.data.events,
          statistics: data.data.statistics,
        }
      : undefined,
  );

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
  const isLive = isMatchLive(liveData.status as any);
  const statusText = getMatchStatusText(
    liveData.status as any,
    liveData.minute,
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
              <div className="text-6xl font-bold">{liveData.score.home}</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">VS</div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">{match.awayTeam.name}</h2>
              <div className="text-6xl font-bold">{liveData.score.away}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <MatchTimeline
              events={liveData.events}
              homeTeamName={match.homeTeam.name}
              awayTeamName={match.awayTeam.name}
            />
            {liveData.statistics && (
              <MatchStats statistics={liveData.statistics} />
            )}
          </div>

          <div>
            <MatchChat matchId={resolvedParams.id} />
          </div>
        </div>
      </div>
    </main>
  );
}
