'use client';

import { useState } from 'react';
import type { Channel } from '@/types';

interface Props {
  channels: Channel[];
  currentChannel: Channel | null;
  onSelect: (channel: Channel) => void;
  isLoading: boolean;
}

export default function ChannelSelector({ channels, currentChannel, onSelect, isLoading }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = channels.filter((ch) =>
    ch.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-sm text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
        <span className="hidden sm:inline">{currentChannel?.name || 'Select Channel'}</span>
        <span className="sm:hidden">Channels</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-full mb-2 right-0 w-80 sm:w-96 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl shadow-black/50 z-50 max-h-96 flex flex-col">
            <div className="p-3 border-b border-white/10">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search channels..."
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-red-500/50"
                autoFocus
              />
            </div>
            <div className="overflow-y-auto flex-1">
              {filtered.length === 0 ? (
                <div className="p-4 text-center text-white/30 text-sm">No channels found</div>
              ) : (
                filtered.map((ch, i) => (
                  <button
                    key={`${ch.name}-${i}`}
                    onClick={() => {
                      onSelect(ch);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/5 ${
                      currentChannel?.url === ch.url ? 'bg-red-500/10 border-l-2 border-red-500' : ''
                    }`}
                  >
                    {ch.logo ? (
                      <img src={ch.logo} alt="" className="w-8 h-8 object-contain rounded" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                    ) : (
                      <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-white/40 text-xs">
                        {ch.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{ch.name}</div>
                      <div className="text-white/30 text-xs truncate">{ch.group}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
            <div className="p-2 border-t border-white/10 text-center text-white/20 text-xs">
              {channels.length} channels available
            </div>
          </div>
        </>
      )}
    </div>
  );
}
