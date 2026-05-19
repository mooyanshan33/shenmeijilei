type Tone = 'dark' | 'light';

function maxAlphaFromToken(input: string, token: 'black' | 'white') {
  const re = new RegExp(`${token}\\/(\\d{1,3})`, 'g');
  let max = 0;
  for (const m of input.matchAll(re)) {
    const n = Number(m[1]);
    if (Number.isFinite(n)) max = Math.max(max, n);
  }
  return max;
}

export function toneFromOverlayClassName(className: string): Tone {
  const cn = className ?? '';
  if (cn.includes('bg-neon')) return 'light';
  if (cn.includes('bg-black')) return 'dark';
  if (cn.includes('bg-white')) return 'light';

  const maxBlack = maxAlphaFromToken(cn, 'black');
  const maxWhite = maxAlphaFromToken(cn, 'white');

  if (maxBlack === 0 && maxWhite === 0) return 'light';
  if (maxBlack >= 45) return 'dark';
  if (maxWhite >= 45) return 'light';
  return maxBlack >= maxWhite ? 'dark' : 'light';
}

export function onOverlayTextClass(overlayClassName: string) {
  return toneFromOverlayClassName(overlayClassName) === 'dark'
    ? 'text-[#FFFFFF]'
    : 'text-[#535353]';
}
