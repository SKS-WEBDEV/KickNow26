'use client';

import type { Standing } from '@/types';

interface Props {
  groups: Map<string, Standing[]>;
}

function GroupTable({ groupName, standings }: { groupName: string; standings: Standing[] }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5">
        <h3 className="text-white font-bold text-sm">Group {groupName}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/5 text-white/30">
              <th className="text-left px-3 py-2 font-medium w-8">#</th>
              <th className="text-left px-3 py-2 font-medium">Team</th>
              <th className="text-center px-2 py-2 font-medium w-6">P</th>
              <th className="text-center px-2 py-2 font-medium w-6">W</th>
              <th className="text-center px-2 py-2 font-medium w-6">D</th>
              <th className="text-center px-2 py-2 font-medium w-6">L</th>
              <th className="text-center px-2 py-2 font-medium w-8">GD</th>
              <th className="text-center px-3 py-2 font-medium w-8 text-white/60">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s) => (
              <tr key={s.team} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                <td className="px-3 py-2.5 text-white/40 font-mono">{s.position}</td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <img src={s.flag} alt={s.team} className="w-5 h-3.5 object-contain rounded flex-shrink-0" />
                    <span className="text-white text-xs font-medium truncate">{s.team}</span>
                  </div>
                </td>
                <td className="text-center px-2 py-2.5 text-white/60">{s.played}</td>
                <td className="text-center px-2 py-2.5 text-green-400/80">{s.won}</td>
                <td className="text-center px-2 py-2.5 text-white/40">{s.drawn}</td>
                <td className="text-center px-2 py-2.5 text-red-400/60">{s.lost}</td>
                <td className={`text-center px-2 py-2.5 font-mono ${s.goalDifference > 0 ? 'text-green-400' : s.goalDifference < 0 ? 'text-red-400' : 'text-white/40'}`}>
                  {s.goalDifference > 0 ? '+' : ''}{s.goalDifference}
                </td>
                <td className="text-center px-3 py-2.5 font-bold text-white">{s.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function GroupStandings({ groups }: Props) {
  const entries = Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));

  if (entries.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-5 bg-purple-400 rounded-full" />
        <h2 className="text-white text-xl font-bold">Group Standings</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {entries.map(([groupName, standings]) => (
          <GroupTable key={groupName} groupName={groupName} standings={standings} />
        ))}
      </div>
    </section>
  );
}
