'use client';

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/25">
              <span className="text-white font-bold text-sm">26</span>
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">
              KICKNOW<span className="text-red-400">26</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/40 hidden sm:block">
              FIFA World Cup 2026
            </span>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-green-400 text-xs font-medium">LIVE</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
