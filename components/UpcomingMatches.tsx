'use client';

import { useState } from 'react';
import type { Match } from '@/types';

interface Props {
  matches: Match[];
}

const INITIAL_SHOW = 10;

export default function UpcomingMatches({ matches }: Props) {
  const upcoming = matches.filter((m) => m.status === 'upcoming');
  const [showAll, setShowAll] = useState(false);

  if (upcoming.length === 0) return null;

  const display = showAll ? upcoming : upcoming.slice(0, INITIAL_SHOW);

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white text-lg font-bold flex items-center gap-2">
          <span className="w-1 h-5 bg-blue-400 rounded-full"></span>
          Upcoming Matches
          <span className="text-white/20 text-xs font-normal ml-1">({upcoming.length})</span>
        </h2>
        {upcoming.length > INITIAL_SHOW && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            {showAll ? 'Show less' : `View all ${upcoming.length}`}
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin">
        {display.map((match) => (
          <div
            key={match.id}
            className="flex-shrink-0 w-48 sm:w-52 bg-white/[0.03] border border-white/5 rounded-xl p-3 snap-start hover:bg-white/[0.06] transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              {match.stage && (
                <span className="text-white/20 text-xs uppercase font-medium">{match.stage}</span>
              )}
              <span className="text-white/30 text-xs">{match.date}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <img src={match.homeFlag} alt={match.homeTeam} className="w-6 h-4 object-contain rounded flex-shrink-0" />
              <span className="text-white text-xs font-medium truncate">{match.homeTeam}</span>
            </div>
            <div className="flex items-center justify-center gap-1 my-1">
              <span className="text-white/40 text-[10px] font-bold">VS</span>
              <span className="text-white/20 text-[10px]">{match.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <img src={match.awayFlag} alt={match.awayTeam} className="w-6 h-4 object-contain rounded flex-shrink-0" />
              <span className="text-white text-xs font-medium truncate">{match.awayTeam}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
