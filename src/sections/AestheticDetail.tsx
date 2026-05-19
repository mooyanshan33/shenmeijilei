import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { AestheticType } from '@/types';

interface AestheticDetailProps {
  aesthetic: AestheticType;
  onClose: () => void;
}

export function AestheticDetail({ aesthetic, onClose }: AestheticDetailProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [favoritesVersion, setFavoritesVersion] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setContentVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const isFavorited = useMemo(() => {
    try {
      const raw = localStorage.getItem('yy_favorites_aesthetic');
      const parsed = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) ? (parsed as unknown[]) : [];
      return list.some((x) => {
        if (!x || typeof x !== 'object') return false;
        const o = x as { aesthetic?: unknown };
        if (!o.aesthetic || typeof o.aesthetic !== 'object') return false;
        const a = o.aesthetic as { id?: unknown };
        return a.id === aesthetic.id;
      });
    } catch {
      return false;
    }
  }, [aesthetic.id, favoritesVersion]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 400);
  };

  const toggleFavorite = () => {
    try {
      const raw = localStorage.getItem('yy_favorites_aesthetic');
      const parsed = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) ? (parsed as unknown[]) : [];
      const now = Date.now();
      const exists = list.some((x) => {
        if (!x || typeof x !== 'object') return false;
        const o = x as { aesthetic?: unknown };
        if (!o.aesthetic || typeof o.aesthetic !== 'object') return false;
        const a = o.aesthetic as { id?: unknown };
        return a.id === aesthetic.id;
      });
      const next = exists
        ? list.filter((x) => {
            if (!x || typeof x !== 'object') return true;
            const o = x as { aesthetic?: unknown };
            if (!o.aesthetic || typeof o.aesthetic !== 'object') return true;
            const a = o.aesthetic as { id?: unknown };
            return a.id !== aesthetic.id;
          })
        : [{ aesthetic, ts: now }, ...list];
      localStorage.setItem('yy_favorites_aesthetic', JSON.stringify(next.slice(0, 200)));
      setFavoritesVersion((v) => v + 1);
    } catch {
      void 0;
    }
  };

  const shareAesthetic = async () => {
    const url = window.location.href;
    const text = `${aesthetic.name} / ${aesthetic.nameEn}`;
    try {
      const nav = navigator as unknown as { share?: (data: unknown) => Promise<void> };
      if (nav.share) {
        await nav.share({ title: 'Aesthetic Archive', text, url });
        return;
      }
    } catch {
      void 0;
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
    } catch {
      void 0;
    }
  };

  return (
    <div
      className={`absolute inset-0 z-50 transition-transform duration-500 ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.215, 0.610, 0.355, 1)' }}
    >
      <div
        className={`absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      <div className="absolute inset-y-0 right-0 w-full overflow-hidden bg-background shadow-2xl">
        <div className="relative h-72 overflow-hidden">
          <img src={aesthetic.coverImage} alt={aesthetic.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-black/20" />

          <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-11 w-11 rounded-full glass-panel btn-press"
            >
              <span className="material-symbols text-foreground">arrow_back</span>
            </Button>
            <div className="glass-panel rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] text-foreground/70">
              Archive Note
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="section-kicker mb-3 text-white/70">
              <span>{aesthetic.origin}</span>
              <span className="soft-divider bg-gradient-to-r from-white/60 via-white/20 to-transparent" />
            </div>
            <h1 className="mb-1 font-serif text-3xl text-foreground">{aesthetic.name}</h1>
            <p className="text-lg text-muted-foreground">{aesthetic.nameEn}</p>
          </div>
        </div>

        <div className="h-[calc(100%-18rem)] overflow-y-auto no-scrollbar">
          <div className="space-y-6 p-6">
            <div
              className={`flex flex-wrap gap-3 transition-all duration-500 ${
                contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              <Badge variant="secondary" className="border-0 bg-neon/10 text-neon">
                {aesthetic.origin}
              </Badge>
              <Badge variant="secondary" className="border-0 bg-secondary text-secondary-foreground">
                {aesthetic.era}
              </Badge>
            </div>

            <section
              className={`transition-all duration-500 ${
                contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="section-kicker mb-2">
                <span>Overview</span>
                <span className="soft-divider" />
              </div>
              <h2 className="mb-3 font-serif text-lg text-foreground">Description</h2>
              <div className="glass-card p-4">
                <p className="text-base leading-8 text-muted-foreground">{aesthetic.description}</p>
              </div>
            </section>

            <section
              className={`transition-all duration-500 ${
                contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="section-kicker mb-2">
                <span>Traits</span>
                <span className="soft-divider" />
              </div>
              <h2 className="mb-3 font-serif text-lg text-foreground">Core Traits</h2>
              <div className="glass-card p-4">
                <ul className="space-y-3">
                  {aesthetic.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-muted-foreground">
                      <span className="material-symbols mt-0.5 text-sm text-neon">check_circle</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section
              className={`transition-all duration-500 ${
                contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <div className="section-kicker mb-2">
                <span>Figures</span>
                <span className="soft-divider" />
              </div>
              <h2 className="mb-3 font-serif text-lg text-foreground">Related Artists</h2>
              <div className="flex flex-wrap gap-2">
                {aesthetic.relatedArtists.map((artist, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="rounded-full border-border bg-background/60 px-3 py-1.5 text-foreground"
                  >
                    {artist}
                  </Badge>
                ))}
              </div>
            </section>

            <div
              className={`flex gap-3 pt-2 transition-all duration-500 ${
                contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: '500ms' }}
            >
              <Button
                onClick={toggleFavorite}
                className="flex-1 rounded-2xl bg-[#535353] text-[#B9B9B9] hover:bg-[#535353] btn-press [&_.material-symbols]:text-[#B9B9B9]"
              >
                <span className="material-symbols mr-2">bookmark</span>
                {isFavorited ? 'Saved' : 'Save'}
              </Button>
              <Button
                variant="outline"
                onClick={shareAesthetic}
                className="flex-1 rounded-2xl border-border bg-background/60 btn-press"
              >
                <span className="material-symbols mr-2">share</span>
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
