'use client';

import type { Match } from '@/types';

interface Props {
  match: Match;
  onWatch: () => void;
}

export default function LiveMatchCard({ match, onWatch }: Props) {
  if (match.status !== 'live') return null;

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 via-red-600 to-red-400 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
      <div className="relative bg-[#111] rounded-2xl border border-white/10 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-red-400 text-xs font-bold uppercase tracking-widest">Live Now</span>
            {match.stage && <span className="text-white/30 text-xs ml-1">{match.stage}</span>}
          </div>
          <span className="text-white/30 text-xs">{match.timeElapsed || match.time}</span>
        </div>

        <div className="flex items-center justify-between gap-4 py-4">
          <div className="flex flex-col items-center gap-2 flex-1">
            <img src={match.homeFlag} alt={match.homeTeam} className="w-12 h-8 object-contain rounded" />
            <span className="text-white font-semibold text-sm text-center">{match.homeTeam}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="text-4xl font-black text-white tracking-wider">
              {match.homeScore} - {match.awayScore}
            </div>
            <span className="text-white/20 text-xs">{match.timeElapsed === 'finished' ? 'FT' : match.timeElapsed || ''}</span>
          </div>
          <div className="flex flex-col items-center gap-2 flex-1">
            <img src={match.awayFlag} alt={match.awayTeam} className="w-12 h-8 object-contain rounded" />
            <span className="text-white font-semibold text-sm text-center">{match.awayTeam}</span>
          </div>
        </div>

        <button
          onClick={onWatch}
          className="w-full mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold text-sm hover:from-red-500 hover:to-red-400 transition-all duration-200 shadow-lg shadow-red-500/25"
        >
          Watch Live Stream
        </button>
      </div>
    </div>
  );
}
