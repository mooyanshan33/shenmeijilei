import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Moon, 
  Type, 
  Palette, 
  Image, 
  Bot, 
  Lock, 
  Bell, 
  Trash2, 
  Info, 
  ChevronRight,
} from 'lucide-react';
import type { ThemeType } from '@/types';

interface SettingsPageProps {
  theme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}

export function SettingsPage({ theme, onThemeChange }: SettingsPageProps) {
  const [fontScale, setFontScale] = useState<'sm' | 'md' | 'lg'>('md');
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  const [autoTaggingEnabled, setAutoTaggingEnabled] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [cacheSize, setCacheSize] = useState('124 MB');

  useEffect(() => {
    // Load font scale from localStorage
    try {
      const raw = localStorage.getItem('yy_font_scale');
      const v = raw === 'sm' || raw === 'md' || raw === 'lg' ? raw : 'md';
      setFontScale(v);
    } catch {
      setFontScale('md');
    }
  }, []);

  useEffect(() => {
    const scale = fontScale === 'sm' ? 0.95 : fontScale === 'lg' ? 1.05 : 1;
    document.documentElement.style.fontSize = `${Math.round(scale * 100)}%`;
    try {
      localStorage.setItem('yy_font_scale', fontScale);
    } catch {
      void 0;
    }
  }, [fontScale]);

  const handleClearCache = () => {
    // Simulate cache clearing
    setCacheSize('0 MB');
    setTimeout(() => {
      setCacheSize('124 MB');
    }, 2000);
  };

  return (
    <div className="px-6 pt-6 pb-6 space-y-6">
        {/* Group 1: Preferences */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden">
          <div className="px-5 py-3">
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">偏好设置</h2>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {/* Dark Mode */}
            <button
              className="w-full flex items-center justify-between px-5 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <div className="flex items-center gap-4">
                <Moon className="w-5 h-5 text-zinc-500" />
                <span className="text-base text-zinc-900 dark:text-zinc-100">深色模式</span>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => onThemeChange(checked ? 'dark' : 'light')}
                className="data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-100"
              />
            </button>

            {/* Font Size */}
            <div className="px-5 py-4">
              <div className="flex items-center gap-4 mb-4">
                <Type className="w-5 h-5 text-zinc-500" />
                <span className="text-base text-zinc-900 dark:text-zinc-100">字体大小</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['sm', 'md', 'lg'] as const).map((size) => (
                  <Button
                    key={size}
                    variant={fontScale === size ? 'default' : 'outline'}
                    className={`rounded-xl h-10 text-sm border-zinc-200 dark:border-zinc-700 ${
                      fontScale === size ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' : 'text-zinc-700 dark:text-zinc-300'
                    }`}
                    onClick={() => setFontScale(size)}
                  >
                    {size === 'sm' ? '小' : size === 'md' ? '标准' : '大'}
                  </Button>
                ))}
              </div>
            </div>

            {/* Content Preferences */}
            <button
              className="w-full flex items-center justify-between px-5 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <div className="flex items-center gap-4">
                <Palette className="w-5 h-5 text-zinc-500" />
                <span className="text-base text-zinc-900 dark:text-zinc-100">内容偏好</span>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Group 2: Creator & AI */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden">
          <div className="px-5 py-3">
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">创作与AI</h2>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {/* Watermark */}
            <button
              className="w-full flex items-center justify-between px-5 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <div className="flex items-center gap-4">
                <Image className="w-5 h-5 text-zinc-500" />
                <span className="text-base text-zinc-900 dark:text-zinc-100">图片水印保护</span>
              </div>
              <Switch
                checked={watermarkEnabled}
                onCheckedChange={setWatermarkEnabled}
                className="data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-100"
              />
            </button>

            {/* AI Auto-Tagging */}
            <button
              className="w-full flex items-center justify-between px-5 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <div className="flex items-center gap-4">
                <Bot className="w-5 h-5 text-zinc-500" />
                <span className="text-base text-zinc-900 dark:text-zinc-100">AI 智能标签</span>
              </div>
              <Switch
                checked={autoTaggingEnabled}
                onCheckedChange={setAutoTaggingEnabled}
                className="data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-100"
              />
            </button>
          </div>
        </div>

        {/* Group 3: Privacy & Notifications */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden">
          <div className="px-5 py-3">
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">隐私与通知</h2>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {/* Private Account */}
            <button
              className="w-full flex items-center justify-between px-5 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <div className="flex items-center gap-4">
                <Lock className="w-5 h-5 text-zinc-500" />
                <span className="text-base text-zinc-900 dark:text-zinc-100">私密账户</span>
              </div>
              <Switch
                checked={privateAccount}
                onCheckedChange={setPrivateAccount}
                className="data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-100"
              />
            </button>

            {/* Notifications */}
            <button
              className="w-full flex items-center justify-between px-5 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <div className="flex items-center gap-4">
                <Bell className="w-5 h-5 text-zinc-500" />
                <span className="text-base text-zinc-900 dark:text-zinc-100">消息通知</span>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Group 4: System */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden">
          <div className="px-5 py-3">
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">系统</h2>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {/* Clear Cache */}
            <button
              onClick={handleClearCache}
              className="w-full flex items-center justify-between px-5 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <div className="flex items-center gap-4">
                <Trash2 className="w-5 h-5 text-zinc-500" />
                <span className="text-base text-zinc-900 dark:text-zinc-100">清理缓存</span>
              </div>
              <span className="text-sm text-zinc-500">{cacheSize}</span>
            </button>

            {/* About */}
            <button
              className="w-full flex items-center justify-between px-5 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <div className="flex items-center gap-4">
                <Info className="w-5 h-5 text-zinc-500" />
                <span className="text-base text-zinc-900 dark:text-zinc-100">关于 审美积累</span>
              </div>
              <span className="text-sm text-zinc-500">v1.1.0</span>
            </button>
          </div>
        </div>
      </div>
  );
}
