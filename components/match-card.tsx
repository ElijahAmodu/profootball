"use client";

import Link from "next/link";
import { Match } from "@/utils/types";
import { Card } from "@/components/ui/card";
import { cn, getMatchStatusText, isMatchLive } from "@/utils/utils";

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const isLive = isMatchLive(match.status);
  const statusText = getMatchStatusText(match.status, match.minute);

  return (
    <Link href={`/match/${match.id}`}>
      <Card
        className={cn(
          "p-4 hover:bg-accent/50 transition-colors cursor-pointer border-zinc-800",
          isLive && "border-emerald-600/50",
        )}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isLive && (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-emerald-500 text-xs font-medium">
                  LIVE
                </span>
              </div>
            )}
            <span className="text-xs text-muted-foreground">{statusText}</span>
          </div>
          {match.status === "NOT_STARTED" && (
            <span className="text-xs text-muted-foreground">
              {new Date(match.startTime).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </span>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-sm font-medium">{match.homeTeam.name}</span>
            </div>
            <span className="text-xl font-bold min-w-[2rem] text-center">
              {match.homeScore}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-sm font-medium">{match.awayTeam.name}</span>
            </div>
            <span className="text-xl font-bold min-w-[2rem] text-center">
              {match.awayScore}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
