import { useMemo, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { EnhancedAuthModal } from '@/components/auth';
import { SettingsPage } from './SettingsPage';
import { getCurrentUser, signOut } from '@/supabase/services/auth';
import { getCurrentProfile, updateProfile } from '@/supabase/services/profile';
import { listContributions } from '@/supabase/services/contribution';
import { uploadAvatarImage } from '@/supabase/services/storage';
import { getOrCreateLocalAvatar, avatarUrlFromSeed } from '@/lib/avatars';
import type { AestheticType, Contribution, UserProfile, ThemeType } from '@/types';
import { 
  Bookmark, 
  Palette, 
  History, 
  Settings, 
  LogOut, 
  ChevronRight, 
  LogIn,
  User,
  Eye
} from 'lucide-react';

interface ProfilePageProps {
  theme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
  onSelectAesthetic: (aesthetic: AestheticType) => void;
}

type ProfileView = 'main' | 'favorites' | 'myContributions' | 'history' | 'settingsPage';

type StoredAestheticItem = {
  aesthetic: AestheticType;
  ts: number;
};

export function ProfilePage({ theme, onThemeChange, onSelectAesthetic }: ProfilePageProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<ProfileView>('main');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editStatus, setEditStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [avatarUploadStatus, setAvatarUploadStatus] = useState<'idle' | 'uploading' | 'error'>('idle');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [favorites, setFavorites] = useState<StoredAestheticItem[]>([]);
  const [history, setHistory] = useState<StoredAestheticItem[]>([]);
  const [myContributions, setMyContributions] = useState<Contribution[]>([]);
  const [myContribLoading, setMyContribLoading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const user = await getCurrentUser();
        if (user) {
          setIsLoggedIn(true);
          const profileData = await getCurrentProfile(user.id);
          setProfile(profileData);
        } else {
          setIsLoggedIn(false);
          setProfile({
            id: 'guest',
            name: '访客用户',
            avatar: getOrCreateLocalAvatar(),
            bio: '登录后解锁更多内容',
            logCount: 0,
            contributionCount: 0,
            favoriteCount: 0,
            favoriteAesthetics: [],
          });
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        setIsLoggedIn(false);
        setProfile({
          id: 'guest',
          name: '访客用户',
          avatar: getOrCreateLocalAvatar(),
          bio: '登录后解锁更多内容',
          logCount: 0,
          contributionCount: 0,
          favoriteCount: 0,
          favoriteAesthetics: [],
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const loadStoredLists = () => {
    try {
      const favRaw = localStorage.getItem('yy_favorites_aesthetic');
      const favParsed = favRaw ? JSON.parse(favRaw) : [];
      setFavorites(Array.isArray(favParsed) ? favParsed : []);
    } catch {
      setFavorites([]);
    }
    try {
      const hisRaw = localStorage.getItem('yy_browse_history');
      const hisParsed = hisRaw ? JSON.parse(hisRaw) : [];
      setHistory(Array.isArray(hisParsed) ? hisParsed : []);
    } catch {
      setHistory([]);
    }
  };

  useEffect(() => {
    loadStoredLists();
    // Load font scale from localStorage to ensure consistency
    try {
      const raw = localStorage.getItem('yy_font_scale');
      const scale = raw === 'sm' ? 0.95 : raw === 'lg' ? 1.05 : 1;
      document.documentElement.style.fontSize = `${Math.round(scale * 100)}%`;
    } catch {
      void 0;
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const openAuth = useCallback(() => {
    setIsAuthOpen(true);
  }, []);

  const handleAuthSuccess = useCallback(() => {
    window.location.reload();
  }, []);

  const favoriteCount = favorites.length;
  const historyCount = history.length;

  const openMyContributions = async () => {
    setView('myContributions');
    if (!isLoggedIn || !profile || profile.id === 'guest') return;
    setMyContribLoading(true);
    try {
      const all = await listContributions();
      setMyContributions(all.filter((x) => x.userId === profile.id));
    } catch (e) {
      console.error('Failed to load my contributions:', e);
      setMyContributions([]);
    } finally {
      setMyContribLoading(false);
    }
  };

  const menuItems = useMemo(() => {
    return [
      {
        id: 'signin',
        icon: <LogIn className="w-5 h-5 text-zinc-700" />,
        label: '登录 / 注册',
        count: undefined,
        action: openAuth,
        hidden: isLoggedIn,
      },
      {
        id: 'favorites',
        icon: <Bookmark className="w-5 h-5 text-zinc-700" />,
        label: '我的收藏',
        count: favoriteCount,
        action: () => {
          loadStoredLists();
          setView('favorites');
        },
      },
      {
        id: 'contributions',
        icon: <Palette className="w-5 h-5 text-zinc-700" />,
        label: '我的贡献',
        count: profile?.contributionCount ?? 0,
        action: openMyContributions,
      },
      {
        id: 'history',
        icon: <History className="w-5 h-5 text-zinc-700" />,
        label: '浏览记录',
        count: historyCount,
        action: () => {
          loadStoredLists();
          setView('history');
        },
      },
      {
        id: 'settings',
        icon: <Settings className="w-5 h-5 text-zinc-700" />,
        label: '设置',
        count: undefined,
        action: () => setView('settingsPage'),
      },
    ];
  }, [favoriteCount, historyCount, isLoggedIn, openAuth, profile?.contributionCount]);

  const removeFavorite = (id: string) => {
    try {
      const next = favorites.filter((x) => x?.aesthetic?.id !== id);
      localStorage.setItem('yy_favorites_aesthetic', JSON.stringify(next));
      setFavorites(next);
    } catch {
      void 0;
    }
  };

  const clearHistory = () => {
    try {
      localStorage.setItem('yy_browse_history', JSON.stringify([]));
      setHistory([]);
    } catch {
      void 0;
    }
  };

  const openEditProfile = () => {
    if (!profile) return;
    setEditName(profile.name ?? '');
    setEditBio(profile.bio ?? '');
    setEditAvatar(profile.avatar ?? (isLoggedIn && profile.id !== 'guest' ? avatarUrlFromSeed(profile.id) : getOrCreateLocalAvatar()));
    setEditStatus('idle');
    setAvatarUploadStatus('idle');
    setIsEditProfileOpen(true);
  };

  const handlePickAvatarFile = async (file: File | null) => {
    if (!file || !isLoggedIn || !profile || profile.id === 'guest') return;
    setAvatarUploadStatus('uploading');
    try {
      const nextUrl = await uploadAvatarImage(file, profile.id);
      setEditAvatar(nextUrl);
      setAvatarUploadStatus('idle');
    } catch (e) {
      console.error('Failed to upload avatar:', e);
      setAvatarUploadStatus('error');
    }
  };

  const saveProfile = async () => {
    if (!isLoggedIn || !profile || profile.id === 'guest') return;
    const name = editName.trim();
    if (!name) return;
    setEditStatus('saving');
    try {
      const updated = await updateProfile(profile.id, {
        name,
        avatar: editAvatar.trim(),
        bio: editBio.trim(),
      });
      setProfile(updated);
      setIsEditProfileOpen(false);
      setEditStatus('idle');
    } catch (e) {
      console.error('Failed to update profile:', e);
      setEditStatus('error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-full bg-[#fafafa] dark:bg-zinc-950 pb-24 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (view !== 'main') {
    const title =
      view === 'favorites'
        ? '我的收藏'
        : view === 'myContributions'
          ? '我的贡献'
          : view === 'history'
            ? '浏览记录'
            : '设置';

    return (
      <div className="min-h-full bg-[#fafafa] dark:bg-zinc-950 pb-24">
        <header className="sticky top-0 z-20 bg-[#fafafa]/90 dark:bg-zinc-950/90 backdrop-blur-sm px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('main')}
              className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700"
              aria-label="返回"
            >
              <ChevronRight className="w-5 h-5 text-zinc-600 dark:text-zinc-400 rotate-180" />
            </button>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{title}</h1>
          </div>
        </header>

        {view === 'favorites' && (
          <div className="px-6 pt-6 space-y-4">
            {favorites.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                <Bookmark className="w-12 h-12 mb-4 text-zinc-300" />
                <p className="text-base">还没有收藏</p>
                <p className="text-sm mt-1 text-zinc-400">在风格详情页点击收藏即可加入</p>
              </div>
            ) : (
              <div className="space-y-3">
                {favorites
                  .slice()
                  .sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0))
                  .map((item) => (
                    <div key={item.aesthetic.id} className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden">
                      <button
                        className="w-full text-left flex items-center gap-4 p-4"
                        onClick={() => onSelectAesthetic(item.aesthetic)}
                      >
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                          <img
                            src={item.aesthetic.coverImage}
                            alt={item.aesthetic.nameCn}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-medium text-zinc-900 dark:text-zinc-100 truncate">
                            {item.aesthetic.nameCn}
                          </p>
                          <p className="text-sm text-zinc-500 truncate mt-0.5">
                            {item.aesthetic.nameEn}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                      </button>
                      <div className="px-4 pb-4">
                        <Button
                          variant="outline"
                          className="w-full rounded-xl border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                          onClick={() => removeFavorite(item.aesthetic.id)}
                        >
                          取消收藏
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {view === 'history' && (
          <div className="px-6 pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-500">共 {history.length} 条</p>
              <button
                className="text-sm text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100"
                onClick={clearHistory}
                disabled={history.length === 0}
              >
                清空
              </button>
            </div>
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                <History className="w-12 h-12 mb-4 text-zinc-300" />
                <p className="text-base">还没有浏览记录</p>
                <p className="text-sm mt-1 text-zinc-400">去探索页看看你喜欢的风格吧</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history
                  .slice()
                  .sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0))
                  .map((item) => (
                    <button
                      key={`${item.aesthetic.id}-${item.ts}`}
                      className="w-full bg-white dark:bg-zinc-900 p-4 flex items-center gap-4 text-left rounded-2xl"
                      onClick={() => onSelectAesthetic(item.aesthetic)}
                    >
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                        <img
                          src={item.aesthetic.coverImage}
                          alt={item.aesthetic.nameCn}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{item.aesthetic.nameCn}</p>
                        <p className="text-xs text-zinc-500 truncate mt-0.5">{item.aesthetic.nameEn}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                    </button>
                  ))}
              </div>
            )}
          </div>
        )}

        {view === 'myContributions' && (
          <div className="px-6 pt-6">
            {!isLoggedIn || !profile || profile.id === 'guest' ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                <Palette className="w-12 h-12 mb-4 text-zinc-300" />
                <p className="text-base">登录后可查看你的贡献</p>
              </div>
            ) : myContribLoading ? (
              <div className="min-h-full pb-24 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-400 rounded-full animate-spin" />
              </div>
            ) : myContributions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                <Palette className="w-12 h-12 mb-4 text-zinc-300" />
                <p className="text-base">你还没有发布过分享</p>
                <p className="text-sm mt-1 text-zinc-400">去工坊发布你的第一条内容</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {myContributions.map((c) => (
                  <div key={c.id} className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden aspect-square">
                    <div className="relative w-full h-full">
                      <img src={c.imageUrl} alt={c.caption} className="w-full h-full object-cover" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'settingsPage' && (
          <SettingsPage
            theme={theme}
            onThemeChange={onThemeChange}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#fafafa] dark:bg-zinc-950 pb-24">
      {/* Page Title */}
      <div className="px-6 pt-10 pb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Personal Profile</h1>
      </div>

      {/* Profile Header */}
      <div className="px-6">
        {/* Top Section - Avatar + Stats */}
        <div className="flex items-start gap-6">
          <Avatar className="w-20 h-20 border-2 border-zinc-100 dark:border-zinc-800">
            <AvatarImage src={profile?.avatar} alt={profile?.name} className="object-cover" />
            <AvatarFallback className="bg-zinc-200 dark:bg-zinc-700">
              <User className="w-8 h-8 text-zinc-400" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 flex items-center justify-around pt-1">
            <div className="text-center">
              <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                {profile?.contributionCount ?? 0}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                {historyCount}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">Views</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                {favoriteCount}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">Collections</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="mt-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {profile?.name}
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            @{isLoggedIn ? (profile?.name ?? 'user').toLowerCase().replace(/\s+/g, '') : 'guest'}
          </p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1 leading-relaxed">
            {profile?.bio}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-5">
          {isLoggedIn ? (
            <>
              <Button
                className="flex-1 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 text-white rounded-xl h-11"
                onClick={openEditProfile}
              >
                Edit Profile
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border-0 rounded-xl h-11"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Profile
              </Button>
            </>
          ) : (
            <Button
              className="flex-1 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 text-white rounded-xl h-11"
              onClick={openAuth}
            >
              Get Started
            </Button>
          )}
        </div>
      </div>

      {/* Menu List */}
      <div className="px-6 mt-8">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden">
          {menuItems
            .filter((item) => !item.hidden)
            .map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full flex items-center justify-between px-5 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              >
                <div className="flex items-center gap-4">
                  {item.icon}
                  <span className="text-left text-zinc-900 dark:text-zinc-100 font-medium">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {item.count !== undefined && (
                    <span className="text-sm text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-zinc-400" />
                </div>
              </button>
            ))}
        </div>

        {/* Sign Out Button */}
        {isLoggedIn && (
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-3 mt-4 px-5 py-4 bg-white dark:bg-zinc-900 rounded-2xl text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">退出登录</span>
          </button>
        )}
      </div>

      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="bg-white dark:bg-zinc-900 border-0 max-w-sm rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-100">编辑个人信息</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm text-zinc-500 mb-2 block">昵称</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-500 mb-2 block">头像</label>
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 border border-zinc-200 dark:border-zinc-700">
                  <AvatarImage src={editAvatar} className="object-cover" />
                  <AvatarFallback className="bg-zinc-200 dark:bg-zinc-700">
                    <User className="w-5 h-5 text-zinc-400" />
                  </AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  id="yy-avatar-file"
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0] ?? null;
                    void handlePickAvatarFile(file);
                    e.currentTarget.value = '';
                  }}
                  disabled={!isLoggedIn || avatarUploadStatus === 'uploading'}
                />
                <label
                  htmlFor="yy-avatar-file"
                  className="h-10 px-4 inline-flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 cursor-pointer transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {avatarUploadStatus === 'uploading' ? '上传中...' : '选择图片'}
                </label>
                {editAvatar && (
                  <button
                    type="button"
                    onClick={() => setEditAvatar('')}
                    disabled={avatarUploadStatus === 'uploading'}
                    className="h-10 px-4 inline-flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 cursor-pointer transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  >
                    移除
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm text-zinc-500 mb-2 block">简介</label>
              <Textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl resize-none"
                rows={3}
              />
            </div>
            {editStatus === 'error' && (
              <div className="text-sm text-red-500">保存失败，请稍后重试。</div>
            )}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 rounded-xl border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                onClick={() => setIsEditProfileOpen(false)}
              >
                取消
              </Button>
              <Button
                className="flex-1 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 text-white rounded-xl disabled:opacity-50"
                onClick={saveProfile}
                disabled={!isLoggedIn || editStatus === 'saving' || avatarUploadStatus === 'uploading' || !editName.trim()}
              >
                {editStatus === 'saving' ? '保存中...' : '保存'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <EnhancedAuthModal
        open={isAuthOpen}
        onOpenChange={setIsAuthOpen}
        onSuccess={handleAuthSuccess}
      />

      {/* Version */}
      <div className="text-center mt-10 pb-8">
        <p className="text-xs text-zinc-400">审美积累 v1.1.0</p>
      </div>
    </div>
  );
}
