function isEDT(date: Date): boolean {
  const y = date.getUTCFullYear();
  const secondSunMar = new Date(Date.UTC(y, 2, 1));
  secondSunMar.setUTCDate(secondSunMar.getUTCDate() + (14 - secondSunMar.getUTCDay()));
  const firstSunNov = new Date(Date.UTC(y, 10, 1));
  firstSunNov.setUTCDate(firstSunNov.getUTCDate() + (7 - firstSunNov.getUTCDay()));
  return date >= secondSunMar && date < firstSunNov;
}

function parseApiDate(dateStr: string, timeStr: string): Date {
  const [m, d, y] = dateStr.split('/').map(Number);
  const [h, mn] = timeStr.split(':').map(Number);
  const utcDate = new Date(Date.UTC(y, m - 1, d, h, mn));
  const offset = isEDT(utcDate) ? '-04:00' : '-05:00';
  const iso = `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:${String(mn).padStart(2, '0')}:00${offset}`;
  return new Date(iso);
}

export function toLocalTime(dateStr: string, timeStr: string): string {
  try {
    const d = parseApiDate(dateStr, timeStr);
    return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  } catch {
    return timeStr;
  }
}

export function toLocalDate(dateStr: string, timeStr: string): string {
  try {
    const d = parseApiDate(dateStr, timeStr);
    return d.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' });
  } catch {
    return dateStr;
  }
}

export function toLocalDateTime(dateStr: string, timeStr: string): string {
  try {
    const d = parseApiDate(dateStr, timeStr);
    return d.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch {
    return `${dateStr} ${timeStr}`;
  }
}
