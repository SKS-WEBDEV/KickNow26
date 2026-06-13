import type { Match, Standing, TopScorer } from '@/types';

interface TeamStats {
  team: string;
  flag: string;
  group: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export function computeGroupStandings(matches: Match[]): Map<string, Standing[]> {
  const groupStats = new Map<string, Map<string, TeamStats>>();

  const groupMatches = matches.filter(
    (m): m is Match & { homeScore: number; awayScore: number } =>
      m.status === 'finished' && m.type === 'group' && m.homeScore !== undefined && m.awayScore !== undefined
  );

  for (const m of groupMatches) {
    const grp = m.stage || 'Unknown';
    if (!groupStats.has(grp)) groupStats.set(grp, new Map());
    const teams = groupStats.get(grp)!;

    if (!teams.has(m.homeTeam)) {
      teams.set(m.homeTeam, { team: m.homeTeam, flag: m.homeFlag, group: grp, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 });
    }
    if (!teams.has(m.awayTeam)) {
      teams.set(m.awayTeam, { team: m.awayTeam, flag: m.awayFlag, group: grp, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 });
    }

    const h = teams.get(m.homeTeam)!;
    const a = teams.get(m.awayTeam)!;
    h.played++;
    a.played++;
    h.goalsFor += m.homeScore;
    h.goalsAgainst += m.awayScore;
    a.goalsFor += m.awayScore;
    a.goalsAgainst += m.homeScore;

    if (m.homeScore > m.awayScore) {
      h.won++;
      h.points += 3;
      a.lost++;
    } else if (m.homeScore < m.awayScore) {
      a.won++;
      a.points += 3;
      h.lost++;
    } else {
      h.drawn++;
      a.drawn++;
      h.points++;
      a.points++;
    }
  }

  const result = new Map<string, Standing[]>();
  for (const [grp, teams] of groupStats) {
    const standings = Array.from(teams.values())
      .map((ts) => ({
        position: 0,
        team: ts.team,
        flag: ts.flag,
        group: ts.group,
        played: ts.played,
        won: ts.won,
        drawn: ts.drawn,
        lost: ts.lost,
        goalsFor: ts.goalsFor,
        goalsAgainst: ts.goalsAgainst,
        goalDifference: ts.goalsFor - ts.goalsAgainst,
        points: ts.points,
      }))
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
      })
      .map((s, i) => ({ ...s, position: i + 1 }));

    result.set(grp, standings);
  }

  return result;
}

export function computeOverallStandings(matches: Match[]): Standing[] {
  const groupStandings = computeGroupStandings(matches);
  const all: Standing[] = [];
  for (const standings of groupStandings.values()) {
    all.push(...standings);
  }
  all.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });
  return all.map((s, i) => ({ ...s, position: i + 1 }));
}

function normalizeName(name: string): string {
  return name.replace(/['']/g, "'").replace(/[“”]/g, '"').trim();
}

export function computeTopScorers(matches: Match[]): TopScorer[] {
  const goalCount = new Map<string, { name: string; team: string; flag: string; goals: number }>();

  const finishedMatches = matches.filter(
    (m) => m.status === 'finished' && m.homeScorers && m.awayScorers
  );

  const addGoals = (names: string[], team: string, flag: string) => {
    for (const raw of names) {
      const name = normalizeName(raw);
      if (!name) continue;
      const key = name.toLowerCase();
      const existing = goalCount.get(key);
      if (existing) {
        existing.goals++;
      } else {
        goalCount.set(key, { name, team, flag, goals: 1 });
      }
    }
  };

  for (const m of finishedMatches) {
    if (m.homeScorers) addGoals(m.homeScorers, m.homeTeam, m.homeFlag);
    if (m.awayScorers) addGoals(m.awayScorers, m.awayTeam, m.awayFlag);
  }

  return Array.from(goalCount.values())
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 30)
    .map((s, i) => ({ position: i + 1, name: s.name, team: s.team, flag: s.flag, goals: s.goals }));
}
