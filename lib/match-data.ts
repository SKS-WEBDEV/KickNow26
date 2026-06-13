import type { Match } from '@/types';
import { getMatches } from './worldcup-api';

const FALLBACK_MATCHES: Match[] = [
  { id: '1', homeTeam: 'Argentina', awayTeam: 'Brazil', homeFlag: 'https://flagcdn.com/w40/ar.png', awayFlag: 'https://flagcdn.com/w40/br.png', date: '06/14/2026', time: '20:00', status: 'live', homeScore: 2, awayScore: 1 },
  { id: '2', homeTeam: 'France', awayTeam: 'Germany', homeFlag: 'https://flagcdn.com/w40/fr.png', awayFlag: 'https://flagcdn.com/w40/de.png', date: '06/14/2026', time: '22:00', status: 'upcoming' },
  { id: '3', homeTeam: 'England', awayTeam: 'Spain', homeFlag: 'https://flagcdn.com/w40/gb-eng.png', awayFlag: 'https://flagcdn.com/w40/es.png', date: '06/15/2026', time: '18:00', status: 'upcoming' },
  { id: '4', homeTeam: 'Portugal', awayTeam: 'Netherlands', homeFlag: 'https://flagcdn.com/w40/pt.png', awayFlag: 'https://flagcdn.com/w40/nl.png', date: '06/15/2026', time: '20:30', status: 'upcoming' },
  { id: '5', homeTeam: 'USA', awayTeam: 'Mexico', homeFlag: 'https://flagcdn.com/w40/us.png', awayFlag: 'https://flagcdn.com/w40/mx.png', date: '06/12/2026', time: '21:00', status: 'finished', homeScore: 3, awayScore: 0 },
  { id: '6', homeTeam: 'Japan', awayTeam: 'South Korea', homeFlag: 'https://flagcdn.com/w40/jp.png', awayFlag: 'https://flagcdn.com/w40/kr.png', date: '06/12/2026', time: '19:00', status: 'finished', homeScore: 1, awayScore: 1 },
];

export async function loadMatches(): Promise<{ matches: Match[]; source: string }> {
  try {
    const matches = await getMatches();
    return { matches, source: 'api' };
  } catch {
    return { matches: FALLBACK_MATCHES, source: 'fallback' };
  }
}

export const worldCupInfo = {
  title: 'FIFA World Cup 2026',
  subtitle: 'United States, Canada, Mexico',
  year: 2026,
};
