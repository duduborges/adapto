import { NextResponse } from 'next/server';
import { getBusyRanges, isCalendarConfigured } from '@/lib/booking/google-calendar';
import { computeSlots } from '@/lib/booking/slots';
import { clientIp, rateLimited } from '@/lib/request-guards';

export const dynamic = 'force-dynamic';

// Every request reaches Google Calendar, so it can't be left open. Generous: a
// visitor loads this once per page and once per return to the tab.
const MAX_PER_IP = 60;

/**
 * The bookable times, read fresh on every request and never cached: a time
 * someone just booked must disappear for the next visitor right away.
 */
export async function GET(request: Request) {
  if (rateLimited(`slots-ip:${clientIp(request)}`, MAX_PER_IP)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  if (!isCalendarConfigured()) {
    console.error('[adapto] Google Calendar is not configured');
    return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  }

  try {
    const now = Date.now();
    const slots = computeSlots(now, await getBusyRanges(now));
    return NextResponse.json(
      { slots },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    console.error('[adapto] booking slots error', error);
    return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  }
}
