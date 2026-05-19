import { useState } from 'react';
import type { TabType } from '@/types';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

interface NavItem {
  id: TabType;
  label: string;
  icon: string;
  filledIcon: string;
}

const navItems: NavItem[] = [
  {
    id: 'explore',
    label: '探索',
    icon: 'travel_explore',
    filledIcon: 'travel_explore'
  },
  {
    id: 'contributions',
    label: '工坊',
    icon: 'palette',
    filledIcon: 'palette'
  },
  {
    id: 'logs',
    label: '日志',
    icon: 'menu_book',
    filledIcon: 'menu_book'
  },
  {
    id: 'profile',
    label: '我的',
    icon: 'person',
    filledIcon: 'person'
  }
];

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const [pressedTab, setPressedTab] = useState<TabType | null>(null);

  const handlePress = (tabId: TabType) => {
    setPressedTab(tabId);
    setTimeout(() => setPressedTab(null), 150);
    onTabChange(tabId);
  };

  return (
    <nav className="w-full z-40 pb-safe">
      <div className="bg-background/92 backdrop-blur-xl border-t border-border/70">
        <div className="mx-auto max-w-[420px] px-3 py-2">
          <div className="flex items-center justify-around gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const isPressed = pressedTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handlePress(item.id)}
                className={`flex flex-col items-center justify-center flex-1 h-14 relative rounded-2xl transition-transform duration-220 ease-kimi ${
                  isPressed ? 'scale-95' : 'scale-100'
                }`}
              >
                {isActive && (
                  <div className="absolute -top-1 left-1/2 h-[3px] w-10 -translate-x-1/2 rounded-full bg-foreground/80" />
                )}

                {/* Icon */}
                <span
                  className={`material-symbols relative z-10 text-2xl mb-1 transition-colors duration-220 ease-kimi ${
                    isActive
                      ? 'material-symbols-filled text-foreground'
                      : 'text-muted-foreground'
                  }`}
                  style={{
                    fontVariationSettings: isActive
                      ? "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24"
                      : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                  }}
                >
                  {isActive ? item.filledIcon : item.icon}
                </span>

                {/* Label */}
                <span
                  className={`relative z-10 text-[11px] transition-colors duration-220 ease-kimi ${
                    isActive
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
          </div>
        </div>
      </div>
    </nav>
  );
}
