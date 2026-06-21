const AVATAR_FILES = [
  'avatar-01.jpg',
  'avatar-02.png',
  'avatar-03.jpg',
  'avatar-04.png',
  'avatar-05.png',
  'avatar-06.png',
  'avatar-07.png',
  'avatar-08.jpg',
] as const;

const SUPABASE_PUBLIC_URL =
  import.meta.env.VITE_SUPABASE_URL ?? 'https://tefbzxcdrlepzhgjfpdq.supabase.co';

function hashSeed(seed: string) {
  // FNV-1a 32-bit
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function avatarUrlFromIndex(index: number) {
  const safe = ((index % AVATAR_FILES.length) + AVATAR_FILES.length) % AVATAR_FILES.length;
  try {
    return `${SUPABASE_PUBLIC_URL}/storage/v1/object/public/gallery/avatars/defaults/${AVATAR_FILES[safe]}`;
  } catch {}
  return `${SUPABASE_PUBLIC_URL}/storage/v1/object/public/gallery/avatars/defaults/${AVATAR_FILES[safe]}`;
}

export function avatarUrlFromSeed(seed: string) {
  return avatarUrlFromIndex(hashSeed(seed));
}

export function getOrCreateLocalAvatar(seedKey = 'yy_local_avatar') {
  try {
    const existing = localStorage.getItem(seedKey);
    if (existing) return existing;
    const next = avatarUrlFromIndex(Math.floor(Math.random() * AVATAR_FILES.length));
    localStorage.setItem(seedKey, next);
    return next;
  } catch {
    return avatarUrlFromIndex(Math.floor(Math.random() * AVATAR_FILES.length));
  }
}
