"use client";

import { MatchStatistics } from "@/utils/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MatchStatsProps {
  statistics: MatchStatistics;
}

export function MatchStats({ statistics }: MatchStatsProps) {
  const stats = [
    {
      label: "Possession",
      home: statistics.possession.home,
      away: statistics.possession.away,
      suffix: "%",
    },
    {
      label: "Shots",
      home: statistics.shots.home,
      away: statistics.shots.away,
    },
    {
      label: "Shots on Target",
      home: statistics.shotsOnTarget.home,
      away: statistics.shotsOnTarget.away,
    },
    {
      label: "Corners",
      home: statistics.corners.home,
      away: statistics.corners.away,
    },
    {
      label: "Fouls",
      home: statistics.fouls.home,
      away: statistics.fouls.away,
    },
    {
      label: "Yellow Cards",
      home: statistics.yellowCards.home,
      away: statistics.yellowCards.away,
    },
    {
      label: "Red Cards",
      home: statistics.redCards.home,
      away: statistics.redCards.away,
    },
  ];

  return (
    <Card className="border-zinc-800">
      <CardHeader>
        <CardTitle className="text-lg">Match Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">
                {stat.home}
                {stat.suffix || ""}
              </span>
              <span className="text-muted-foreground">{stat.label}</span>
              <span className="font-medium">
                {stat.away}
                {stat.suffix || ""}
              </span>
            </div>
            <div className="flex gap-1 h-2">
              <div
                className="bg-emerald-600 rounded-l"
                style={{
                  width: `${(stat.home / (stat.home + stat.away || 1)) * 100}%`,
                }}
              />
              <div
                className="bg-red-600 rounded-r"
                style={{
                  width: `${(stat.away / (stat.home + stat.away || 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
