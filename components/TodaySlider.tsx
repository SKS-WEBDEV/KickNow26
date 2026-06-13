'use client';

import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import type { Match } from '@/types';

interface Props {
  matches: Match[];
  onWatch: () => void;
  hasLiveMatch: boolean;
}

function todayStr(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + (m || 0);
}

export default function TodaySlider({ matches, onWatch, hasLiveMatch }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollL, setCanScrollL] = useState(false);
  const [canScrollR, setCanScrollR] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);

  const today = useMemo(() => todayStr(), []);

  const todayMatches = useMemo(() => {
    const todays = matches.filter((m) => m.date === today);
    if (todays.length > 0) return todays;

    const upcoming = matches
      .filter((m) => m.status === 'upcoming')
      .sort((a, b) => {
        const diff = new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime();
        return diff;
      });
    return upcoming.slice(0, 5);
  }, [matches, today]);

  const sorted = useMemo(() => {
    return [...todayMatches].sort((a, b) => {
      const order = { live: 0, upcoming: 1, finished: 2 };
      if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
      return timeToMinutes(a.time) - timeToMinutes(b.time);
    });
  }, [todayMatches]);

  const activeIdxRef = useRef(activeIdx);
  activeIdxRef.current = activeIdx;

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollL(el.scrollLeft > 4);
    setCanScrollR(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  const scrollTo = useCallback((dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardW = 300 + 12;
    const target = dir === 'left' ? el.scrollLeft - cardW : el.scrollLeft + cardW;
    el.scrollTo({ left: target, behavior: 'smooth' });
  }, []);

  const scrollToCard = useCallback((idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cards = el.children;
    if (cards[idx]) {
      (cards[idx] as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => updateScrollButtons();
    el.addEventListener('scroll', handler, { passive: true });
    updateScrollButtons();
    return () => el.removeEventListener('scroll', handler);
  }, [updateScrollButtons]);

  useEffect(() => {
    const liveIdx = sorted.findIndex((m) => m.status === 'live');
    if (liveIdx >= 0) {
      setActiveIdx(liveIdx);
      const t = setTimeout(() => scrollToCard(liveIdx), 300);
      return () => clearTimeout(t);
    }
    const nextIdx = sorted.findIndex((m) => m.status === 'upcoming');
    if (nextIdx >= 0) {
      setActiveIdx(nextIdx);
      const t = setTimeout(() => scrollToCard(nextIdx), 300);
      return () => clearTimeout(t);
    }
  }, [sorted, scrollToCard]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Array.from(el.children).indexOf(entry.target as HTMLElement);
            if (idx >= 0) setActiveIdx(idx);
          }
        }
      },
      { root: el, threshold: 0.5 }
    );
    for (const child of el.children) observer.observe(child);
    return () => observer.disconnect();
  }, [sorted.length]);

  if (sorted.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-1 h-5 bg-red-400 rounded-full" />
          <h2 className="text-white text-xl font-bold">
            {todayMatches.length > 0 ? "Today's Games" : 'Next Games'}
          </h2>
          <span className="text-white/20 text-xs font-normal ml-1">({sorted.length})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scrollTo('left')}
            disabled={!canScrollL}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scrollTo('right')}
            disabled={!canScrollR}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-thin"
        style={{ scrollbarWidth: 'thin' }}
      >
        {sorted.map((match, idx) => {
          const isActive = idx === activeIdx;
          const isLive = match.status === 'live';
          const isFinished = match.status === 'finished';

          return (
            <div
              key={match.id}
              className={`flex-shrink-0 w-[280px] sm:w-[320px] snap-start rounded-xl border transition-all duration-300 ${
                isLive
                  ? 'bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-500/30'
                  : isActive
                  ? 'bg-white/[0.04] border-white/15'
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
              }`}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  {isLive ? (
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                      </span>
                      <span className="text-red-400 text-xs font-bold uppercase tracking-wider">Live</span>
                      <span className="text-white/30 text-xs ml-1">{match.timeElapsed}</span>
                    </div>
                  ) : isFinished ? (
                    <span className="text-white/30 text-xs font-medium uppercase tracking-wider">Finished</span>
                  ) : (
                    <span className="text-white/30 text-xs font-medium uppercase tracking-wider">Upcoming</span>
                  )}
                  <span className={`text-xs ${isLive ? 'text-white/40' : 'text-white/20'}`}>
                    {isLive || isFinished ? match.date : match.time}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                    <img src={match.homeFlag} alt={match.homeTeam} className="w-10 h-7 object-contain rounded" />
                    <span className="text-white text-xs font-semibold text-center truncate w-full">{match.homeTeam}</span>
                  </div>

                  <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                    {isLive || isFinished ? (
                      <span className="text-2xl font-black text-white tracking-wider">
                        {match.homeScore} – {match.awayScore}
                      </span>
                    ) : (
                      <span className="text-white/40 text-lg font-bold">VS</span>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                    <img src={match.awayFlag} alt={match.awayTeam} className="w-10 h-7 object-contain rounded" />
                    <span className="text-white text-xs font-semibold text-center truncate w-full">{match.awayTeam}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {match.stage && (
                    <span className={`text-xs ${isLive ? 'text-white/30' : 'text-white/20'}`}>{match.stage}</span>
                  )}
                  {isLive ? (
                    <button
                      onClick={onWatch}
                      className="ml-auto px-4 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold text-xs hover:from-red-500 hover:to-red-400 transition-all shadow-lg shadow-red-500/20"
                    >
                      Watch
                    </button>
                  ) : !isFinished ? (
                    <span className="ml-auto text-white/20 text-xs">{match.time}</span>
                  ) : null}
                </div>
              </div>

              {isLive && (
                <div className="h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full mx-4 mb-0.5" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
