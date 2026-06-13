'use client';

import { worldCupInfo } from '@/lib/match-data';

export default function HeroSection() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-red-500/5 via-transparent to-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center px-4 py-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-white/60 text-xs font-medium uppercase tracking-widest">Live Streaming</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 tracking-tight">
          {worldCupInfo.title}
        </h1>
        <p className="text-xl md:text-2xl text-white/40 font-light mb-8">
          {worldCupInfo.subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
            <span className="text-white/60 text-sm">48 Teams</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
            <span className="text-white/60 text-sm">104 Matches</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
            <span className="text-white/60 text-sm">16 Host Cities</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent"></div>
    </section>
  );
}
