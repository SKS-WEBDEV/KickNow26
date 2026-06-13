'use client';

import type { Standing } from '@/types';

interface Props {
  standings: Standing[];
}

export default function OverallStandings({ standings }: Props) {
  if (standings.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-5 bg-emerald-400 rounded-full" />
        <h2 className="text-white text-xl font-bold">Overall Standings</h2>
        <span className="text-white/20 text-xs font-normal ml-1">({standings.length} teams)</span>
      </div>
      <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5 text-white/30">
                <th className="text-left px-4 py-3 font-medium w-10">#</th>
                <th className="text-left px-4 py-3 font-medium">Team</th>
                <th className="text-center px-3 py-3 font-medium w-8">Grp</th>
                <th className="text-center px-3 py-3 font-medium w-8">P</th>
                <th className="text-center px-3 py-3 font-medium w-8">W</th>
                <th className="text-center px-3 py-3 font-medium w-8">D</th>
                <th className="text-center px-3 py-3 font-medium w-8">L</th>
                <th className="text-center px-3 py-3 font-medium w-8">GF</th>
                <th className="text-center px-3 py-3 font-medium w-8">GA</th>
                <th className="text-center px-3 py-3 font-medium w-10">GD</th>
                <th className="text-center px-4 py-3 font-medium w-10 text-white/60">Pts</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((s, i) => {
                const medal = i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : '';
                const barWidth = Math.min(100, (s.points / (standings[0]?.points || 1)) * 100);
                return (
                  <tr key={s.team} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className={`px-4 py-3 font-mono font-bold ${medal || 'text-white/40'}`}>
                      {s.position <= 3 ? ['🥇', '🥈', '🥉'][s.position - 1] : s.position}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <img src={s.flag} alt={s.team} className="w-6 h-4 object-contain rounded flex-shrink-0" />
                        <span className="text-white text-sm font-medium truncate">{s.team}</span>
                      </div>
                    </td>
                    <td className="text-center px-3 py-3 text-white/30 font-mono">{s.group}</td>
                    <td className="text-center px-3 py-3 text-white/60">{s.played}</td>
                    <td className="text-center px-3 py-3 text-green-400/80">{s.won}</td>
                    <td className="text-center px-3 py-3 text-white/40">{s.drawn}</td>
                    <td className="text-center px-3 py-3 text-red-400/60">{s.lost}</td>
                    <td className="text-center px-3 py-3 text-white/60">{s.goalsFor}</td>
                    <td className="text-center px-3 py-3 text-white/60">{s.goalsAgainst}</td>
                    <td className={`text-center px-3 py-3 font-mono ${s.goalDifference > 0 ? 'text-green-400' : s.goalDifference < 0 ? 'text-red-400' : 'text-white/40'}`}>
                      {s.goalDifference > 0 ? '+' : ''}{s.goalDifference}
                    </td>
                    <td className="text-center px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="font-bold text-white text-sm">{s.points}</span>
                        <div className="w-12 h-1.5 bg-white/5 rounded-full overflow-hidden hidden sm:block">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all" style={{ width: `${barWidth}%` }} />
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
