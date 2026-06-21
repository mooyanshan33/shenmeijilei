import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AestheticCoverImage } from '@/components/AestheticCoverImage';
import { getSimilarAesthetics } from '@/data/completeDatabase';
import type { AestheticType } from '@/types';

interface AestheticDetailProps {
  aesthetic: AestheticType;
  onClose: () => void;
}

export function AestheticDetail({ aesthetic, onClose }: AestheticDetailProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [favoritesVersion, setFavoritesVersion] = useState(0);
  
  const similarAesthetics = useMemo(() => getSimilarAesthetics(aesthetic.id), [aesthetic.id]);

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
    const text = `${aesthetic.nameCn} / ${aesthetic.nameEn}`;
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
          <AestheticCoverImage
            src={aesthetic.coverImage}
            alt={aesthetic.nameCn}
            label={aesthetic.nameCn}
            colorPalette={aesthetic.colorPalette}
            className="h-full w-full object-cover"
          />
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
            <h1 className="mb-1 font-serif text-3xl text-foreground">{aesthetic.nameCn}</h1>
            <p className="text-lg text-muted-foreground">{aesthetic.nameEn}</p>
          </div>
        </div>

        <div className="h-[calc(100%-18rem)] overflow-y-auto no-scrollbar">
          <div className="space-y-6 p-6">
            {/* 基本信息
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
              <Badge variant="secondary" className="border-0 bg-secondary text-secondary-foreground">
                {aesthetic.region}
              </Badge>
            </div>

            {/* 概述 */}
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
                <p className="text-base leading-8 text-muted-foreground">{aesthetic.summary}</p>
              </div>
            </section>

            {/* 历史 */}
            <section
              className={`transition-all duration-500 ${
                contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: '250ms' }}
            >
              <div className="section-kicker mb-2">
                <span>History</span>
                <span className="soft-divider" />
              </div>
              <h2 className="mb-3 font-serif text-lg text-foreground">History</h2>
              <div className="glass-card p-4">
                <p className="text-base leading-8 text-muted-foreground">{aesthetic.history}</p>
              </div>
            </section>

            {/* 核心特征 */}
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
                  {aesthetic.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-muted-foreground">
                      <span className="material-symbols mt-0.5 text-sm text-neon">check_circle</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 色板 */}
            <section
              className={`transition-all duration-500 ${
                contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: '350ms' }}
            >
              <div className="section-kicker mb-2">
                <span>Color Palette</span>
                <span className="soft-divider" />
              </div>
              <h2 className="mb-3 font-serif text-lg text-foreground">Color Palette</h2>
              <div className="flex gap-2">
                {aesthetic.colorPalette.map((color, index) => (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <div 
                      className="h-12 w-12 rounded-full border-2 border-white/20"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-xs text-muted-foreground">{color.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 代表艺术家 */}
            <section
              className={`transition-all duration-500 ${
                contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <div className="section-kicker mb-2">
                <span>Artists</span>
                <span className="soft-divider" />
              </div>
              <h2 className="mb-3 font-serif text-lg text-foreground">Representative Artists</h2>
              <div className="space-y-3">
                {aesthetic.representativeArtists.map((artist, index) => (
                <div key={index} className="glass-card p-3 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-neon/10 to-neon/5 flex items-center justify-center">
                    <span className="material-symbols text-neon">person</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground">{artist.name}</p>
                    <p className="text-sm text-muted-foreground">{artist.nationality} • {artist.lifespan}</p>
                  </div>
                </div>
                ))}
              </div>
            </section>

            {/* 代表作品 */}
            {aesthetic.representativeWorks.length > 0 && (
            <section
              className={`transition-all duration-500 ${
                contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: '450ms' }}
            >
              <div className="section-kicker mb-2">
                <span>Works</span>
                <span className="soft-divider" />
              </div>
              <h2 className="mb-3 font-serif text-lg text-foreground">Representative Works</h2>
              <div className="space-y-3">
                {aesthetic.representativeWorks.map((work, index) => (
                  <div key={index} className="glass-card p-3">
                    <p className="text-foreground">{work.title}</p>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{work.artist}</span>
                      <span>•</span>
                      <span>{work.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            )}

            {/* 时间线 */}
            {aesthetic.timeline.length > 0 && (
            <section
              className={`transition-all duration-500 ${
                contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: '500ms' }}
            >
              <div className="section-kicker mb-2">
                <span>Timeline</span>
                <span className="soft-divider" />
              </div>
              <h2 className="mb-3 font-serif text-lg text-foreground">Timeline</h2>
              <div className="space-y-3">
                {aesthetic.timeline.map((entry, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-neon" />
                      {index < aesthetic.timeline.length - 1 && (
                        <div className="w-px flex-1 bg-border" />
                      )}
                    </div>
                    <div className="glass-card p-3 flex-1">
                      <p className="text-sm font-medium text-foreground">{entry.year}</p>
                      <p className="text-sm text-muted-foreground">{entry.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            )}

            {/* 关键词 */}
            <section
              className={`transition-all duration-500 ${
                contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: '550ms' }}
            >
              <div className="section-kicker mb-2">
                <span>Tags</span>
                <span className="soft-divider" />
              </div>
              <h2 className="mb-3 font-serif text-lg text-foreground">Keywords</h2>
              <div className="flex flex-wrap gap-2">
                {aesthetic.keywords.map((keyword, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="rounded-full border-border bg-background/60 px-3 py-1.5 text-foreground"
                >
                  {keyword}
                </Badge>
                ))}
              </div>
            </section>

            {/* 操作按钮 */}
            <div
              className={`flex gap-3 pt-2 transition-all duration-500 ${
                contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <Button
                onClick={toggleFavorite}
                className="flex-1 rounded-2xl bg-[#535353] text-[#B9B9B9] hover:bg-[#535353] btn-press [&_.material-symbols]:text-[#B9B9B9]"
              >
                <span className="material-symbols mr-2">{isFavorited ? 'bookmark' : 'bookmark_add'}</span>
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
