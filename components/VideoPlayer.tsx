'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Hls from 'hls.js';
import type { Channel } from '@/types';

interface Props {
  channel: Channel | null;
  onClose: () => void;
}

type PlayerState = 'loading' | 'playing' | 'reconnecting' | 'error';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

function getStreamUrl(url: string): string {
  return `/api/proxy?url=${encodeURIComponent(url)}`;
}

export default function VideoPlayer({ channel, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryRef = useRef(0);
  const urlRef = useRef('');
  const [state, setState] = useState<PlayerState>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    const video = videoRef.current;
    if (video) {
      video.removeAttribute('src');
      video.load();
    }
  }, []);

  const startPlayback = useCallback((url: string) => {
    const video = videoRef.current;
    if (!video) return;

    const isHls = url.includes('.m3u8') || url.includes('.m3u');

    const retry = () => {
      retryRef.current++;
      if (retryRef.current > MAX_RETRIES) {
        setErrorMsg('Stream unavailable after multiple retries.');
        setState('error');
        return;
      }
      setState('reconnecting');
      cleanup();
      setTimeout(() => startPlayback(urlRef.current), RETRY_DELAY);
    };

    const onError = (msg: string) => {
      retry();
    };

    timeoutRef.current = setTimeout(() => {
      retry();
    }, 30000);

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        liveDurationInfinity: true,
        backBufferLength: Infinity,
        maxBufferLength: 60,
        maxMaxBufferLength: 120,
        maxBufferSize: 200 * 1000 * 1000,
        maxBufferHole: 0.5,
        nudgeOffset: 0.3,
        nudgeMaxRetry: 5,
        abrEwmaDefaultEstimate: 2000000,
        abrBandWidthFactor: 0.9,
        abrBandWidthUpFactor: 0.95,
        startLevel: -1,
      });
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);

      video.addEventListener('playing', () => {
        retryRef.current = 0;
        if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
        setState('playing');
      }, { once: true });

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          retry();
        }
      });
    } else if (isHls && video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.addEventListener('playing', () => {
        retryRef.current = 0;
        if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
        setState('playing');
      }, { once: true });
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(() => {});
      }, { once: true });
      video.addEventListener('error', () => onError('Stream format not supported.'), { once: true });
    } else if (!isHls) {
      video.src = url;
      video.addEventListener('playing', () => {
        retryRef.current = 0;
        if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
        setState('playing');
      }, { once: true });
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(() => {});
      }, { once: true });
      video.addEventListener('error', () => onError('Failed to load stream.'), { once: true });
    } else {
      onError('HLS not supported on this browser.');
    }
  }, [cleanup]);

  useEffect(() => {
    if (!channel) return;
    cleanup();
    retryRef.current = 0;
    setState('loading');
    setErrorMsg(null);
    urlRef.current = getStreamUrl(channel.url);

    startPlayback(urlRef.current);

    return cleanup;
  }, [channel, cleanup, startPlayback]);

  if (!channel) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/90">
      <div className="relative w-full max-w-5xl mx-4">
        <div className="absolute -top-10 left-0 right-0 flex items-center justify-between z-40 px-1">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-[10px]">TV</span>
            </div>
            <span className="text-white text-sm font-medium truncate">{channel.name}</span>
          </div>
          <div className="flex items-center gap-2">
            {state === 'loading' && (
              <span className="text-white/40 text-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Loading
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-red-400"
              title="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
          <div className="relative aspect-video bg-black">
            {(state === 'loading' || state === 'reconnecting') && (
              <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                  <span className="text-white/40 text-sm">
                    {state === 'reconnecting' ? 'Reconnecting...' : 'Loading stream...'}
                  </span>
                  {state === 'reconnecting' && (
                    <span className="text-white/20 text-xs">Retry {retryRef.current}/{MAX_RETRIES}</span>
                  )}
                </div>
              </div>
            )}

            {state === 'error' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                <div className="flex flex-col items-center gap-4 px-6 text-center">
                  <svg className="w-12 h-12 text-red-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-white/50 text-sm">{errorMsg}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition-colors">
                      Close
                    </button>
                    <button
                      onClick={() => {
                        retryRef.current = 0;
                        cleanup();
                        setState('loading');
                        setErrorMsg(null);
                        startPlayback(urlRef.current);
                      }}
                      className="px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-500 text-white text-xs transition-colors"
                    >
                      Retry Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              playsInline
              autoPlay
              muted
              controls
              preload="auto"
              disablePictureInPicture
            />
          </div>
        </div>
      </div>
    </div>
  );
}
