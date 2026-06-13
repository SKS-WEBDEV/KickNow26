'use client';

import type { TopScorer } from '@/types';

interface Props {
  scorers: TopScorer[];
}

export default function TopScorers({ scorers }: Props) {
  if (scorers.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-5 bg-amber-400 rounded-full" />
        <h2 className="text-white text-xl font-bold">Top Scorers</h2>
        <span className="text-white/20 text-xs font-normal ml-1">({scorers.length} players)</span>
      </div>
      <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5 text-white/30">
                <th className="text-left px-4 py-3 font-medium w-10">#</th>
                <th className="text-left px-4 py-3 font-medium">Player</th>
                <th className="text-left px-4 py-3 font-medium">Team</th>
                <th className="text-center px-4 py-3 font-medium w-8 text-white/60">Goals</th>
              </tr>
            </thead>
            <tbody>
              {scorers.map((scorer) => {
                const medalBg = scorer.position === 1 ? 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/20' :
                  scorer.position === 2 ? 'from-gray-300/20 to-gray-400/10 border-gray-300/20' :
                  scorer.position === 3 ? 'from-amber-600/20 to-amber-700/10 border-amber-600/20' : '';
                return (
                  <tr key={scorer.name} className={`border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors ${medalBg ? `bg-gradient-to-r ${medalBg}` : ''}`}>
                    <td className={`px-4 py-3 font-mono font-bold ${scorer.position <= 3 ? 'text-white' : 'text-white/40'}`}>
                      {scorer.position <= 3 ? ['🥇', '🥈', '🥉'][scorer.position - 1] : scorer.position}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white text-sm font-medium">{scorer.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img src={scorer.flag} alt={scorer.team} className="w-5 h-3.5 object-contain rounded flex-shrink-0" />
                        <span className="text-white/60 text-xs">{scorer.team}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-bold text-white text-sm">{scorer.goals}</span>
                        <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${scorer.position === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-300' : scorer.position === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-200' : scorer.position === 3 ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-white/10'}`}
                            style={{ width: `${Math.min(100, (scorer.goals / (scorers[0]?.goals || 1)) * 100)}%` }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
