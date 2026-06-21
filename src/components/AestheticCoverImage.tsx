import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { isManagedStorageUrl, resolveStorageImageUrl } from '@/lib/gallery';
import type { ColorPalette } from '@/types';

/** 迁移脚本生成的 SVG 占位图尺寸 */
const MANAGED_PLACEHOLDER_SIZE = 1200;

function buildGradient(palette?: ColorPalette[]): string {
  const c1 = palette?.[0]?.hex ?? '#CBD5E0';
  const c2 = palette?.[1]?.hex ?? '#718096';
  const c3 = palette?.[2]?.hex ?? c1;
  return `linear-gradient(145deg, ${c1} 0%, ${c2} 52%, ${c3} 100%)`;
}

function isManagedPlaceholderImage(url: string, width: number, height: number) {
  return (
    isManagedStorageUrl(url) &&
    width === MANAGED_PLACEHOLDER_SIZE &&
    height === MANAGED_PLACEHOLDER_SIZE
  );
}

interface AestheticCoverImageProps {
  src: string;
  alt: string;
  className?: string;
  colorPalette?: ColorPalette[];
  /** 渐变占位图上显示的标签，通常为风格中文名 */
  label?: string;
}

export function AestheticCoverImage({
  src,
  alt,
  className,
  colorPalette,
  label,
}: AestheticCoverImageProps) {
  const resolvedSrc = resolveStorageImageUrl(src);
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>(() =>
    resolvedSrc ? 'loading' : 'fallback'
  );

  const handleError = useCallback(() => {
    setStatus('fallback');
  }, []);

  const handleLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      const img = event.currentTarget;
      if (isManagedPlaceholderImage(resolvedSrc, img.naturalWidth, img.naturalHeight)) {
        setStatus('fallback');
        return;
      }
      setStatus('ready');
    },
    [resolvedSrc]
  );

  if (status === 'fallback') {
    return (
      <div
        className={cn('relative flex h-full w-full items-center justify-center overflow-hidden', className)}
        style={{ background: buildGradient(colorPalette) }}
        role="img"
        aria-label={alt}
      >
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.45) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10" />
        {label ? (
          <span className="relative z-10 px-4 text-center font-serif text-base leading-snug text-white/95 drop-shadow-md line-clamp-3">
            {label}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={cn(className, status === 'loading' ? 'opacity-0' : 'opacity-100 transition-opacity duration-300')}
      loading="lazy"
      decoding="async"
      onError={handleError}
      onLoad={handleLoad}
    />
  );
}
