import type { Match } from '@/types';

const API_BASE = 'https://worldcup26.ir';

interface ApiGame {
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_team_name_en: string;
  away_team_name_en: string;
  home_score: string;
  away_score: string;
  home_scorers: string;
  away_scorers: string;
  group: string;
  matchday: string;
  local_date: string;
  finished: string;
  time_elapsed: string;
  type: string;
}

interface ApiTeam {
  id: string;
  name_en: string;
  flag: string;
  groups: string;
}

export async function fetchTeams(): Promise<Map<string, string>> {
  const res = await fetch(`${API_BASE}/get/teams`, {
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`Teams fetch failed: ${res.status}`);
  const data = await res.json();
  const map = new Map<string, string>();
  for (const team of data.teams as ApiTeam[]) {
    map.set(team.id, team.flag);
  }
  return map;
}

export async function fetchGames(): Promise<ApiGame[]> {
  const res = await fetch(`${API_BASE}/get/games`, {
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Games fetch failed: ${res.status}`);
  const data = await res.json();
  return data.games as ApiGame[];
}

function toStatus(finished: string, timeElapsed: string): 'upcoming' | 'live' | 'finished' {
  if (finished === 'TRUE') return 'finished';
  if (timeElapsed !== 'notstarted') return 'live';
  return 'upcoming';
}

function parseDate(localDate: string): { date: string; time: string } {
  const parts = localDate.split(' ');
  if (parts.length >= 2) {
    return { date: parts[0], time: parts[1] };
  }
  return { date: localDate, time: '' };
}

function parseScorers(scorers: string): string[] {
  if (!scorers || scorers === 'null' || scorers.trim() === '') return [];
  let inner = scorers.trim();
  if (inner.startsWith('{') && inner.endsWith('}')) {
    inner = inner.slice(1, -1);
  }
  const names: string[] = [];
  const regex = /"([^"]*?)"|“[^”]*?”/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(inner)) !== null) {
    const entry = match[1] || match[0].replace(/[“”]/g, '').trim();
    if (!entry) continue;
    if (entry.includes('(OG)') || entry.includes('(og)')) continue;
    const nameMatch = entry.match(/^(.+?)\s+\d+'/);
    if (nameMatch) {
      names.push(nameMatch[1].trim());
    } else {
      names.push(entry);
    }
  }
  return names;
}

export async function getMatches(): Promise<Match[]> {
  const [games, teamFlagMap] = await Promise.all([fetchGames(), fetchTeams()]);

  return games.map((game) => {
    const { date, time } = parseDate(game.local_date);
    const homeScore = parseInt(game.home_score, 10);
    const awayScore = parseInt(game.away_score, 10);

    return {
      id: game.id,
      homeTeam: game.home_team_name_en,
      awayTeam: game.away_team_name_en,
      homeFlag: teamFlagMap.get(game.home_team_id) || `https://flagcdn.com/w40/${game.home_team_id}.png`,
      awayFlag: teamFlagMap.get(game.away_team_id) || `https://flagcdn.com/w40/${game.away_team_id}.png`,
      date,
      time,
      status: toStatus(game.finished, game.time_elapsed),
      homeScore: isNaN(homeScore) ? undefined : homeScore,
      awayScore: isNaN(awayScore) ? undefined : awayScore,
      stage: game.group,
      timeElapsed: game.time_elapsed,
      homeScorers: parseScorers(game.home_scorers),
      awayScorers: parseScorers(game.away_scorers),
      type: game.type,
    };
  });
}
