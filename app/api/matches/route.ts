import { NextResponse } from 'next/server';
import { getMatches } from '@/lib/worldcup-api';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET() {
  try {
    const matches = await getMatches();
    return NextResponse.json({ matches, source: 'api' });
  } catch {
    return NextResponse.json({ matches: [], source: 'error' }, { status: 200 });
  }
}
