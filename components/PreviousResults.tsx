'use client';

import { useState } from 'react';
import type { Match } from '@/types';

interface Props {
  matches: Match[];
}

const INITIAL_SHOW = 10;

export default function PreviousResults({ matches }: Props) {
  const finished = matches.filter((m) => m.status === 'finished');
  const [showAll, setShowAll] = useState(false);

  if (finished.length === 0) return null;

  const sorted = [...finished].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });

  const display = showAll ? sorted : sorted.slice(0, INITIAL_SHOW);

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white text-lg font-bold flex items-center gap-2">
          <span className="w-1 h-5 bg-amber-400 rounded-full"></span>
          Previous Results
          <span className="text-white/20 text-xs font-normal ml-1">({finished.length})</span>
        </h2>
        {finished.length > INITIAL_SHOW && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            {showAll ? 'Show less' : `View all ${finished.length}`}
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin">
        {display.map((match) => {
          const homeWon = (match.homeScore ?? 0) > (match.awayScore ?? 0);
          const awayWon = (match.awayScore ?? 0) > (match.homeScore ?? 0);
          const draw = !homeWon && !awayWon && match.homeScore !== undefined;

          return (
            <div
              key={match.id}
              className="flex-shrink-0 w-44 sm:w-48 bg-white/[0.03] border border-white/5 rounded-xl p-3 snap-start"
            >
              <div className="flex items-center justify-between mb-2">
                {match.stage && (
                  <span className="text-white/20 text-xs uppercase font-medium">{match.stage}</span>
                )}
                <span className="text-white/30 text-xs">{match.date}</span>
              </div>

              <div className="flex items-center gap-2 mb-1.5">
                <img src={match.homeFlag} alt={match.homeTeam} className="w-6 h-4 object-contain rounded flex-shrink-0" />
                <span className={`text-xs font-medium truncate ${homeWon ? 'text-white' : 'text-white/50'}`}>
                  {match.homeTeam}
                </span>
                <span className={`ml-auto text-sm font-bold ${homeWon ? 'text-green-400' : draw ? 'text-white/60' : 'text-white/30'}`}>
                  {match.homeScore}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <img src={match.awayFlag} alt={match.awayTeam} className="w-6 h-4 object-contain rounded flex-shrink-0" />
                <span className={`text-xs font-medium truncate ${awayWon ? 'text-white' : 'text-white/50'}`}>
                  {match.awayTeam}
                </span>
                <span className={`ml-auto text-sm font-bold ${awayWon ? 'text-green-400' : draw ? 'text-white/60' : 'text-white/30'}`}>
                  {match.awayScore}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
