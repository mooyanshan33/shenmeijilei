import { useEffect, useState } from 'react';
import { SplashScreen } from '@/sections/SplashScreen';
import { BottomNavigation } from '@/sections/BottomNavigation';
import { ExplorePage } from '@/sections/ExplorePage';
import { AestheticDetail } from '@/sections/AestheticDetail';
import { Workshop } from '@/workshop';
import { LogsPage } from '@/sections/LogsPage';
import { ProfilePage } from '@/sections/ProfilePage';
import { AuthCallback } from '@/sections/AuthCallback';
import { useTheme } from '@/hooks/useTheme';
import type { TabType, AestheticType, ThemeType } from '@/types';

type BrowseHistoryItem = { aesthetic: { id: string }; ts: number };

function isBrowseHistoryItem(v: unknown): v is BrowseHistoryItem {
  if (!v || typeof v !== 'object') return false;
  const o = v as { aesthetic?: unknown; ts?: unknown };
  if (!o.aesthetic || typeof o.aesthetic !== 'object') return false;
  const a = o.aesthetic as { id?: unknown };
  return typeof a.id === 'string' && typeof o.ts === 'number';
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('explore');
  const [selectedAesthetic, setSelectedAesthetic] = useState<AestheticType | null>(null);
  const { theme, isInitialized, setLightTheme, setDarkTheme } = useTheme();
  const isAuthCallback = typeof window !== 'undefined' && window.location.pathname.startsWith('/auth/callback');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('yy_font_scale');
      const scale = raw === 'sm' ? 0.95 : raw === 'lg' ? 1.05 : 1;
      document.documentElement.style.fontSize = `${Math.round(scale * 100)}%`;
    } catch {
      void 0;
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleSelectAesthetic = (aesthetic: AestheticType) => {
    setSelectedAesthetic(aesthetic);
    try {
      const raw = localStorage.getItem('yy_browse_history');
      const parsed = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) ? (parsed as unknown[]) : [];
      const now = Date.now();
      const next = [
        { aesthetic, ts: now },
        ...list.filter(isBrowseHistoryItem).filter((x) => x.aesthetic.id !== aesthetic.id),
      ].slice(0, 50);
      localStorage.setItem('yy_browse_history', JSON.stringify(next));
    } catch {
      void 0;
    }
  };

  const handleCloseDetail = () => {
    setSelectedAesthetic(null);
  };

  const handleThemeChange = (newTheme: ThemeType) => {
    if (newTheme === 'light') {
      setLightTheme();
    } else {
      setDarkTheme();
    }
  };

  // Render active page content
  const renderContent = () => {
    switch (activeTab) {
      case 'explore':
        return <ExplorePage onSelectAesthetic={handleSelectAesthetic} />;
      case 'contributions':
        return <Workshop />;
      case 'logs':
        return <LogsPage />;
      case 'profile':
        return (
          <ProfilePage
            theme={theme}
            onThemeChange={handleThemeChange}
            onSelectAesthetic={handleSelectAesthetic}
          />
        );
      default:
        return <ExplorePage onSelectAesthetic={handleSelectAesthetic} />;
    }
  };

  // Show loading state while theme initializes
  if (!isInitialized) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-0 sm:p-4">
      {/* Phone Frame Container */}
      <div className="phone-container relative w-full h-screen sm:h-[850px] sm:max-w-[400px] bg-background sm:rounded-[40px] shadow-2xl overflow-hidden border-0 sm:border-8 border-gray-800 dark:border-gray-700">
        {/* Status Bar (visible on desktop) */}
        <div className="hidden sm:flex items-center justify-between px-6 py-2 bg-background">
          <span className="text-xs font-medium text-foreground">9:41</span>
          <div className="flex items-center gap-1">
            <span className="material-symbols text-xs text-foreground">signal_cellular_alt</span>
            <span className="material-symbols text-xs text-foreground">wifi</span>
            <span className="material-symbols text-xs text-foreground">battery_full</span>
          </div>
        </div>

        {/* Notch (visible on desktop) */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-800 dark:bg-gray-700 rounded-b-2xl z-50" />

        {!isAuthCallback && showSplash && <SplashScreen onComplete={handleSplashComplete} />}

        {/* Main Content */}
        {isAuthCallback ? (
          <main className="h-full overflow-y-auto no-scrollbar pt-safe">
            <AuthCallback />
          </main>
        ) : (
          !showSplash && (
          <>
            {/* Page Content */}
            <main className="h-[calc(100%-80px)] sm:h-[calc(100%-120px)] overflow-y-auto no-scrollbar pt-safe">
              {renderContent()}
            </main>

            {/* Bottom Navigation */}
            <div className="absolute bottom-0 left-0 right-0">
              <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
            </div>

            {/* Aesthetic Detail Modal */}
            {selectedAesthetic && (
              <AestheticDetail
                aesthetic={selectedAesthetic}
                onClose={handleCloseDetail}
              />
            )}
          </>
          )
        )}

        {/* Home Indicator (visible on desktop) */}
        <div className="hidden sm:block absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-300 dark:bg-gray-600 rounded-full z-50" />
      </div>
    </div>
  );
}

export default App;
