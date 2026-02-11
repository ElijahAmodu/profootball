"use client";

import { MatchEvent } from "@/utils/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDot, AlertCircle, UserX, Users, Activity } from "lucide-react";

interface MatchTimelineProps {
  events: MatchEvent[];
  homeTeamName: string;
  awayTeamName: string;
}

export function MatchTimeline({
  events,
  homeTeamName,
  awayTeamName,
}: MatchTimelineProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case "GOAL":
        return <CircleDot className="w-4 h-4 text-emerald-500" />;
      case "YELLOW_CARD":
        return <div className="w-4 h-5 bg-yellow-500 rounded-sm" />;
      case "RED_CARD":
        return <div className="w-4 h-5 bg-red-500 rounded-sm" />;
      case "SUBSTITUTION":
        return <Users className="w-4 h-4 text-blue-500" />;
      case "FOUL":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const sortedEvents = [...events].sort((a, b) => b.minute - a.minute);

  return (
    <Card className="border-zinc-800">
      <CardHeader>
        <CardTitle className="text-lg">Match Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No events yet
            </p>
          ) : (
            sortedEvents.map((event) => (
              <div
                key={event.id}
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  event.team === "home" ? "bg-zinc-900" : "bg-zinc-900"
                }`}
              >
                <div className="flex items-center gap-2 min-w-[3rem]">
                  <span className="text-xs font-medium text-muted-foreground">
                    {event.minute}'
                  </span>
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{event.player}</p>
                  {event.assistPlayer && (
                    <p className="text-xs text-muted-foreground">
                      Assist: {event.assistPlayer}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {event.team === "home" ? homeTeamName : awayTeamName}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
