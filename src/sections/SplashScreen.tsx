import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [animationStage, setAnimationStage] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimationStage(1), 60),
      setTimeout(() => setAnimationStage(2), 120),
      setTimeout(() => setAnimationStage(3), 180),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleStart = () => {
    setIsExiting(true);
    setTimeout(onComplete, 240);
  };

  return (
    <div
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-background transition-all duration-240 ease-out ${
        isExiting ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.55] bg-gradient-to-b from-grayWhite-50 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6">
        <div className="overflow-hidden mb-3">
          <h1
            className={`font-serif text-5xl md:text-6xl text-foreground tracking-[0.12em] transition-all duration-240 ease-out ${
              animationStage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`}
          >
            审美积累
          </h1>
        </div>

        <p
          className={`font-serif text-base text-muted-foreground tracking-[0.26em] mb-10 transition-all duration-240 ease-out ${
            animationStage >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
        >
          探索美学的无限可能
        </p>

        <div
          className={`transition-all duration-240 ease-out ${
            animationStage >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
        >
          <Button
            onClick={handleStart}
            className="btn-press px-10 py-6 text-base font-medium rounded-full border border-grayWhite-200/80 bg-grayWhite-white text-[color:var(--c-ink)] hover:bg-grayWhite-50 active:bg-grayWhite-100 transition-colors duration-220 ease-kimi"
          >
            开启审美之旅
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full bg-grayWhite-300 transition-all duration-240 ease-out ${
              animationStage >= 3 ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: `${i * 70}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
