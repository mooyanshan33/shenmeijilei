import { useEffect, useMemo, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { listAestheticTypes, listAestheticCategories, listAestheticVideos } from '@/supabase/services/aesthetic';
import { listContributions } from '@/supabase/services/contribution';
import { onOverlayTextClass } from '@/lib/overlayTone';
import type { AestheticType, Contribution, AestheticCategory, AestheticVideo } from '@/types';

interface ExplorePageProps {
  onSelectAesthetic: (aesthetic: AestheticType) => void;
}

type SearchHistoryItem = {
  q: string;
  ts: number;
};

function normalizeForSearch(input: string) {
  return (input ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\u3000/g, ' ')
    .toLowerCase()
    .trim();
}

function tokenizeQuery(normalizedQuery: string) {
  return normalizedQuery.split(/\s+/).filter(Boolean);
}

export function ExplorePage({ onSelectAesthetic }: ExplorePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('1');
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const [aestheticTypes, setAestheticTypes] = useState<AestheticType[]>([]);
  const [aestheticCategories, setAestheticCategories] = useState<AestheticCategory[]>([]);
  const [aestheticVideos, setAestheticVideos] = useState<AestheticVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [communityShares, setCommunityShares] = useState<Contribution[]>([]);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadAllData() {
      try {
        setLoading(true);
        const [types, categories, videos, contributions] = await Promise.all([
          listAestheticTypes(),
          listAestheticCategories(),
          listAestheticVideos(),
          listContributions(),
        ]);
        setAestheticTypes(types);
        setAestheticCategories(categories);
        setAestheticVideos(videos);
        setCommunityShares(contributions.slice(0, 6));
      } catch (error) {
        console.error('Failed to load data:', error);
        setAestheticTypes([]);
        setAestheticCategories([]);
        setAestheticVideos([]);
        setCommunityShares([]);
      } finally {
        setLoading(false);
      }
    }
    loadAllData();
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('yy_explore_search_history');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) {
        setSearchHistory(parsed.slice(0, 10).map((q, idx) => ({ q, ts: Date.now() - idx })));
        return;
      }
      if (
        Array.isArray(parsed) &&
        parsed.every(
          (x) =>
            typeof x === 'object' &&
            x !== null &&
            typeof (x as Record<string, unknown>).q === 'string' &&
            typeof (x as Record<string, unknown>).ts === 'number'
        )
      ) {
        setSearchHistory((parsed as SearchHistoryItem[]).slice(0, 10));
      }
    } catch {
      setSearchHistory([]);
    }
  }, []);

  useEffect(() => {
    if (!isHistoryOpen) return;
    const handleDocMouseDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target || !searchBoxRef.current) return;
      if (!searchBoxRef.current.contains(target)) setIsHistoryOpen(false);
    };
    const handleDocKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsHistoryOpen(false);
    };
    document.addEventListener('mousedown', handleDocMouseDown);
    document.addEventListener('keydown', handleDocKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleDocMouseDown);
      document.removeEventListener('keydown', handleDocKeyDown);
    };
  }, [isHistoryOpen]);

  const persistHistory = (next: SearchHistoryItem[]) => {
    setSearchHistory(next);
    try {
      localStorage.setItem('yy_explore_search_history', JSON.stringify(next));
    } catch {
      void 0;
    }
  };

  const addToHistory = (query: string) => {
    const q = query.trim();
    if (!q) return;
    const now = Date.now();
    const next = [{ q, ts: now }, ...searchHistory.filter((x) => x.q !== q)].slice(0, 10);
    persistHistory(next);
  };

  const removeFromHistory = (query: string) => {
    persistHistory(searchHistory.filter((x) => x.q !== query));
  };

  const clearHistory = () => {
    persistHistory([]);
  };

  const normalizedQuery = normalizeForSearch(searchQuery);
  const queryTokens = tokenizeQuery(normalizedQuery);
  const isSearching = normalizedQuery.length > 0;

  const dailyRecommended = useMemo(() => {
    if (!aestheticTypes.length) return [];
    const dateKey = new Date().toISOString().slice(0, 10);
    let seed = 0;
    for (let i = 0; i < dateKey.length; i++) seed = (seed * 31 + dateKey.charCodeAt(i)) >>> 0;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 0xffffffff;
    };
    const copy = [...aestheticTypes];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, 6);
  }, [aestheticTypes]);

  const heroAesthetic = dailyRecommended[0];
  const secondaryRecommendations = dailyRecommended.slice(heroAesthetic ? 1 : 0);

  const filteredAesthetics = useMemo(() => {
    if (!isSearching) return aestheticTypes;
    if (!queryTokens.length) return [];

    const scored = aestheticTypes
      .map((aesthetic) => {
        const name = normalizeForSearch(aesthetic.name);
        const nameEn = normalizeForSearch(aesthetic.nameEn);
        const origin = normalizeForSearch(aesthetic.origin);
        const era = normalizeForSearch(aesthetic.era);
        const desc = normalizeForSearch(aesthetic.description);
        const tags = (aesthetic.tags ?? []).map(normalizeForSearch);
        const features = (aesthetic.features ?? []).map(normalizeForSearch);
        const relatedArtists = (aesthetic.relatedArtists ?? []).map(normalizeForSearch);

        let score = 0;
        for (const token of queryTokens) {
          let matched = false;

          if (name === token) {
            score += 120;
            matched = true;
          } else if (name.startsWith(token)) {
            score += 90;
            matched = true;
          } else if (name.includes(token)) {
            score += 70;
            matched = true;
          }

          if (!matched) {
            if (nameEn === token) {
              score += 90;
              matched = true;
            } else if (nameEn.startsWith(token)) {
              score += 70;
              matched = true;
            } else if (nameEn.includes(token)) {
              score += 50;
              matched = true;
            }
          }

          if (!matched && tags.length) {
            if (tags.some((t) => t === token)) {
              score += 60;
              matched = true;
            } else if (tags.some((t) => t.includes(token))) {
              score += 35;
              matched = true;
            }
          }

          if (!matched && (origin.includes(token) || era.includes(token))) {
            score += 18;
            matched = true;
          }

          if (!matched && features.some((f) => f.includes(token))) {
            score += 22;
            matched = true;
          }

          if (!matched && relatedArtists.some((x) => x.includes(token))) {
            score += 16;
            matched = true;
          }

          if (!matched && desc.includes(token)) {
            score += 12;
            matched = true;
          }

          if (!matched) return null;
        }

        if (score <= 0) return null;
        return { aesthetic, score };
      })
      .filter((x): x is { aesthetic: AestheticType; score: number } => Boolean(x))
      .sort((a, b) => b.score - a.score || a.aesthetic.name.localeCompare(b.aesthetic.name, 'zh-CN'));

    return scored.map((x) => x.aesthetic);
  }, [aestheticTypes, isSearching, queryTokens]);

  const filteredHistory = useMemo(() => {
    if (!normalizedQuery) return searchHistory;
    return searchHistory.filter((x) => normalizeForSearch(x.q).includes(normalizedQuery));
  }, [searchHistory, normalizedQuery]);

  const observeItem = (id: string) => (el: HTMLDivElement | null) => {
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleItems((prev) => new Set([...prev, id]));
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
  };

  if (loading) {
    return (
      <div className="min-h-full pb-20 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neon border-t-transparent" />
      </div>
    );
  }

  const handleBackFromSearch = () => {
    setSearchQuery('');
    setIsHistoryOpen(false);
  };

  const formatHistoryTime = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const sameDay =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();
    if (sameDay) {
      return d.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    }
    return d.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
  };

  const heroOverlayClass = 'absolute inset-0 bg-gradient-to-br from-black/15 via-black/20 to-black/70';
  const dailyOverlayClass = 'absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent';
  const archiveOverlayClass = 'absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent';
  const communityOverlayClass = 'absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent';
  const videoBadgeOverlayBaseClass = 'absolute bottom-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px]';
  const hoverOverlayClass =
    'absolute inset-0 flex items-center justify-center bg-neon/90 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100';

  const onHero = onOverlayTextClass(heroOverlayClass);
  const onDaily = onOverlayTextClass(dailyOverlayClass);
  const onArchive = onOverlayTextClass(archiveOverlayClass);
  const onCommunity = onOverlayTextClass(communityOverlayClass);
  const onVideoBadge = onOverlayTextClass(videoBadgeOverlayBaseClass);
  const onHover = onOverlayTextClass(hoverOverlayClass);

  return (
    <div className="min-h-full pb-24">
      <header className="sticky top-0 z-20 px-4 pt-4">
        <div className="glass-panel rounded-[30px] px-4 py-4">
          <div className="mb-4 flex items-center gap-2">
            {isSearching && (
              <button
                onClick={handleBackFromSearch}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/55 btn-press dark:bg-white/5"
                aria-label="Back"
              >
                <span className="material-symbols text-foreground">arrow_back</span>
              </button>
            )}
            <div className="min-w-0 flex-1">
              <div className="section-kicker mb-2">
                <span>Curated</span>
                <span className="soft-divider" />
              </div>
              <h1 className="font-serif text-2xl text-foreground">Aesthetic Explore</h1>
            </div>
            {!isSearching && (
              <div className="hidden h-11 min-w-11 items-center justify-center rounded-2xl bg-neon/15 text-neon min-[360px]:flex">
                <span className="material-symbols">auto_awesome</span>
              </div>
            )}
          </div>

          <div ref={searchBoxRef} className="relative" onMouseDown={() => setIsHistoryOpen(true)}>
            <span className="material-symbols pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              search
            </span>
            <Input
              type="text"
              placeholder="搜索审美风格、标签、年份、地区…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsHistoryOpen(true)}
              onKeyDown={(e) => {
                if ((e.nativeEvent as unknown as { isComposing?: boolean })?.isComposing) return;
                if (e.key === 'Enter') {
                  addToHistory(searchQuery);
                  setIsHistoryOpen(false);
                }
                if (e.key === 'Escape') {
                  setIsHistoryOpen(false);
                }
              }}
              className="h-12 rounded-2xl border-white/30 bg-white/55 py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground shadow-none focus:ring-2 focus:ring-neon/50 dark:border-white/10 dark:bg-white/5"
            />
            {searchQuery.trim().length > 0 && (
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full btn-press text-muted-foreground hover:text-foreground"
                aria-label="清空搜索"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setSearchQuery('');
                  setIsHistoryOpen(true);
                }}
              >
                <span className="material-symbols text-base">close</span>
              </button>
            )}

            {isHistoryOpen && (
              <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border-0 glass-card">
                <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
                  <span className="text-sm text-muted-foreground">搜索记录</span>
                  {filteredHistory.length > 0 && (
                    <button
                      className="text-sm text-neon hover:underline"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={clearHistory}
                    >
                      清空
                    </button>
                  )}
                </div>
                {filteredHistory.length === 0 ? (
                  <div className="px-4 py-4 text-sm text-muted-foreground">暂无搜索记录</div>
                ) : (
                  <div className="max-h-56 overflow-y-auto no-scrollbar">
                    {filteredHistory.map((item) => (
                      <div
                        key={item.q}
                        className="flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary/40"
                      >
                        <button
                          className="min-w-0 flex-1 text-left"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setSearchQuery(item.q);
                            setIsHistoryOpen(false);
                          }}
                        >
                          <div className="truncate text-sm text-foreground">{item.q}</div>
                          <div className="text-xs text-muted-foreground">{formatHistoryTime(item.ts)}</div>
                        </button>
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-full btn-press text-muted-foreground hover:text-foreground"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => removeFromHistory(item.q)}
                          aria-label="Remove search history item"
                        >
                          <span className="material-symbols text-base">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {!isSearching && (
        <div className="space-y-6 px-4 pt-4">
          {heroAesthetic && (
            <section className="overflow-hidden p-4 glass-card">
              <div className="section-kicker mb-3">
                <span>Highlight</span>
                <span className="soft-divider" />
              </div>
              <button onClick={() => onSelectAesthetic(heroAesthetic)} className="group block w-full text-left">
                <div className="relative aspect-[16/11] overflow-hidden rounded-[28px]">
                  <img
                    src={heroAesthetic.coverImage}
                    alt={heroAesthetic.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className={heroOverlayClass} />
                  <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
                    <span
                      className={`rounded-full bg-white/18 px-3 py-1 text-[11px] uppercase tracking-[0.22em] backdrop-blur ${onHero}`}
                    >
                      Editorial Pick
                    </span>
                    <span className={`rounded-full bg-white/18 p-2 backdrop-blur ${onHero}`}>
                      <span className="material-symbols text-base">north_east</span>
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className={`font-serif text-[28px] leading-none ${onHero}`}>{heroAesthetic.name}</p>
                    <p className={`mt-1 text-sm ${onHero}`}>{heroAesthetic.nameEn}</p>
                    <p className={`mt-3 max-w-[16rem] line-clamp-2 text-sm leading-6 ${onHero}`}>
                      {heroAesthetic.description}
                    </p>
                  </div>
                </div>
              </button>
            </section>
          )}

          <section>
            <div className="section-title">
              <div>
                <div className="section-kicker mb-2">
                  <span>Daily</span>
                  <span className="soft-divider w-12" />
                </div>
                <h2 className="font-serif text-lg text-foreground">Daily Picks</h2>
              </div>
              <span className="text-xs text-muted-foreground">6 rotating styles</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {secondaryRecommendations.map((aesthetic) => (
                <button
                  key={aesthetic.id}
                  onClick={() => onSelectAesthetic(aesthetic)}
                  className="overflow-hidden text-left glass-card card-hover group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={aesthetic.coverImage}
                      alt={aesthetic.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className={dailyOverlayClass} />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className={`font-serif text-base leading-tight ${onDaily}`}>{aesthetic.name}</p>
                      <p className={`text-xs ${onDaily}`}>{aesthetic.nameEn}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="section-title">
              <div>
                <div className="section-kicker mb-2">
                  <span>Discover</span>
                  <span className="soft-divider w-14" />
                </div>
                <h2 className="font-serif text-lg text-foreground">Categories</h2>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {aestheticCategories.map((cat) => {
                const selected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm transition-all ${
                      selected
                        ? 'bg-[#535353] text-[#B9B9B9]'
                        : 'glass-panel text-foreground'
                    }`}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setSearchQuery(cat.name);
                      addToHistory(cat.name);
                    }}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <div className="section-title">
              <div>
                <div className="section-kicker mb-2">
                  <span>Community</span>
                  <span className="soft-divider w-14" />
                </div>
                <h2 className="font-serif text-lg text-foreground">Community Shares</h2>
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {communityShares.map((item) => (
                <div key={item.id} className="w-72 flex-shrink-0 overflow-hidden glass-card">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={item.imageUrl} alt={item.caption} className="h-full w-full object-cover" />
                    <div className={communityOverlayClass} />
                    <div
                      className={`absolute bottom-3 right-3 rounded-full bg-white/18 px-2.5 py-1 text-xs backdrop-blur ${onCommunity}`}
                    >
                      {item.likes} likes
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <img
                        src={item.userAvatar}
                        alt={item.userName}
                        className="h-6 w-6 rounded-full bg-secondary"
                      />
                      <span className="text-sm text-foreground">{item.userName}</span>
                      <div className="ml-auto flex items-center gap-1 text-muted-foreground">
                        <span className="material-symbols text-base">favorite</span>
                        <span className="text-xs">{item.likes}</span>
                      </div>
                    </div>
                    <p className="line-clamp-2 text-sm text-foreground">{item.caption}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.tags.slice(0, 3).map((tag) => (
                        <button
                          key={tag}
                          className="rounded-full bg-neon/10 px-2 py-1 text-xs text-neon"
                          onClick={() => {
                            setSearchQuery(tag);
                            addToHistory(tag);
                          }}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="section-title">
              <div>
                <div className="section-kicker mb-2">
                  <span>Motion</span>
                  <span className="soft-divider w-16" />
                </div>
                <h2 className="font-serif text-lg text-foreground">Video Notes</h2>
              </div>
            </div>
            <div className="space-y-3">
              {aestheticVideos.map((v) => (
                <a key={v.id} href={v.videoUrl} className="flex gap-3 overflow-hidden p-3 glass-card card-hover">
                  <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl">
                    <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover" />
                    <div className={`${videoBadgeOverlayBaseClass} ${onVideoBadge}`}>
                      {v.duration}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm text-foreground">{v.title}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{v.author}</span>
                      <span>•</span>
                      <span>{v.views}</span>
                      <span>•</span>
                      <span className="text-neon">{v.category}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>
      )}

      <div className="px-4 pt-4">
        {isSearching && filteredAesthetics.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <span className="material-symbols mb-3 text-5xl">search_off</span>
            <p className="text-base">没有找到匹配结果</p>
            <p className="mt-1 text-sm">试试更短的关键词，或在上方选择一个分类。</p>
          </div>
        ) : (
          <div className="columns-2 gap-4 space-y-4">
            {filteredAesthetics.map((aesthetic, index) => (
              <div
                key={aesthetic.id}
                ref={observeItem(aesthetic.id)}
                onClick={() => onSelectAesthetic(aesthetic)}
                className="group break-inside-avoid cursor-pointer transition-all duration-600"
                style={{
                  transitionDelay: `${(index % 4) * 100}ms`,
                  opacity: visibleItems.has(aesthetic.id) ? 1 : 0,
                  transform: visibleItems.has(aesthetic.id) ? 'translateY(0)' : 'translateY(20px)',
                }}
              >
                <div className="relative overflow-hidden rounded-[26px] glass-card card-hover">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={aesthetic.coverImage}
                      alt={aesthetic.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className={archiveOverlayClass} />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span
                        className={`mb-2 inline-flex rounded-full bg-white/16 px-2.5 py-1 text-[11px] uppercase tracking-[0.22em] backdrop-blur ${onArchive}`}
                      >
                        Archive
                      </span>
                      <h3 className={`mb-0.5 font-serif text-lg ${onArchive}`}>{aesthetic.name}</h3>
                      <p className={`text-xs ${onArchive}`}>{aesthetic.nameEn}</p>
                    </div>
                  </div>

                  <div className={hoverOverlayClass}>
                    <div className="text-center">
                      <p className={`mb-2 font-serif text-xl ${onHover}`}>{aesthetic.name}</p>
                      <p className={`line-clamp-3 text-sm ${onHover}`}>{aesthetic.description.slice(0, 60)}...</p>
                      <div className={`mt-4 flex items-center justify-center gap-1 ${onHover}`}>
                        <span className="text-sm">Read more</span>
                        <span className="material-symbols text-sm">arrow_forward</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
