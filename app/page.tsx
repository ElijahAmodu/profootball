"use client";

import { useMatches } from "@/hooks/useMatches";
import { useLiveMatches } from "@/hooks/useLiveMatches";
import { MatchCard } from "@/components/match-card";
import { Activity } from "lucide-react";

export default function Home() {
  const { data: allMatches, isLoading: allLoading } = useMatches();
  const { data: liveMatches, isLoading: liveLoading } = useLiveMatches();

  const loading = allLoading || liveLoading;

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 text-emerald-500" />
            <h1 className="text-3xl font-bold">Live Match Center</h1>
          </div>
          <p className="text-muted-foreground">
            Real-time football match updates and statistics
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {liveMatches?.data.matches &&
              liveMatches.data.matches.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    Live Matches
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {liveMatches.data.matches.map((match) => (
                      <MatchCard key={match.id} match={match} />
                    ))}
                  </div>
                </section>
              )}

            <section>
              <h2 className="text-xl font-semibold mb-4">All Matches</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allMatches?.data.matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
