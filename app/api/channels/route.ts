import { NextResponse } from 'next/server';
import { fetchChannels, filterChannels } from '@/lib/m3u-parser';
import type { Channel } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

const KNOWN_CHANNELS: Channel[] = [
  {
    name: 'FIFA+ 720p',
    url: 'https://jmp2.uk/plu-660c29b5aec9680008f5b4a4.m3u8',
    logo: 'https://img.iptv.zone/logo/fifa.png',
    group: 'FIFA World Cup 2026',
  },
  {
    name: 'Sports Grid',
    url: 'https://d35j504z0x2vu2.cloudfront.net/v1/master/0bc8e8376bd8417a1b6761138aa41c26c7309312/sportsgrid/master.m3u8',
    logo: '',
    group: 'Sports',
  },
];

export async function GET() {
  try {
    const allChannels = await fetchChannels();
    const filtered = filterChannels(allChannels);

    const knownUrls = new Set(KNOWN_CHANNELS.map((c) => c.url));
    const deduped = filtered.filter((c) => !knownUrls.has(c.url));

    const combined = [...KNOWN_CHANNELS, ...deduped].slice(0, 50);

    return NextResponse.json({
      total: combined.length,
      channels: combined,
    });
  } catch (error) {
    return NextResponse.json(
      { channels: KNOWN_CHANNELS, total: KNOWN_CHANNELS.length, source: 'fallback' },
      { status: 200 }
    );
  }
}
