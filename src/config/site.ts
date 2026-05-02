// Site was first published October 2025 — drives the volume counter.
const LAUNCH = new Date(2025, 9, 1);

function toRoman(n: number): string {
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ['m', 'cm', 'd', 'cd', 'c', 'xc', 'l', 'xl', 'x', 'ix', 'v', 'iv', 'i'];
  let out = '';
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) { out += syms[i]; n -= vals[i]; }
  }
  return out;
}

function volumeNumber(from: Date, to: Date): number {
  return (to.getFullYear() - from.getFullYear()) * 12
    + (to.getMonth() - from.getMonth()) + 1;
}

function season(month: number): string {
  if (month >= 2 && month <= 4) return 'spring almanac';
  if (month >= 5 && month <= 7) return 'summer almanac';
  if (month >= 8 && month <= 10) return 'autumn almanac';
  return 'winter almanac';
}

function monthYear(date: Date): string {
  const m = date.toLocaleDateString('en-US', { month: 'long' }).toLowerCase();
  const y = String(date.getFullYear()).slice(2);
  return `${m} '${y}`;
}

export function getEyebrow(now = new Date()) {
  const vol = `vol. ${toRoman(volumeNumber(LAUNCH, now))}`;
  const sub = `${season(now.getMonth())} · ${monthYear(now)}`;
  return { vol, sub };
}
