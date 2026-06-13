export interface Channel {
  name: string;
  url: string;
  logo: string;
  group: string;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  date: string;
  time: string;
  status: 'upcoming' | 'live' | 'finished';
  homeScore?: number;
  awayScore?: number;
  stage?: string;
  timeElapsed?: string;
  homeScorers?: string[];
  awayScorers?: string[];
  type?: string;
}

export interface Standing {
  position: number;
  team: string;
  flag: string;
  group: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface TopScorer {
  position: number;
  name: string;
  team: string;
  flag: string;
  goals: number;
}

export interface PlayerState {
  isPlaying: boolean;
  currentChannel: Channel | null;
  channels: Channel[];
}
