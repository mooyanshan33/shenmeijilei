import { useMemo, useState, useEffect, useCallback } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getCurrentUser, resetPassword, signInWithPassword, signOut, signUpWithPassword } from '@/supabase/services/auth';
import { getCurrentProfile, updateProfile } from '@/supabase/services/profile';
import { listContributions } from '@/supabase/services/contribution';
import { uploadAvatarImage } from '@/supabase/services/storage';
import { getOrCreateLocalAvatar, avatarUrlFromSeed } from '@/lib/avatars';
import type { AestheticType, Contribution, UserProfile, ThemeType } from '@/types';

interface ProfilePageProps {
  theme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
  onSelectAesthetic: (aesthetic: AestheticType) => void;
}

type ProfileView = 'main' | 'favorites' | 'myContributions' | 'history' | 'settings';

type StoredAestheticItem = {
  aesthetic: AestheticType;
  ts: number;
};

export function ProfilePage({ theme, onThemeChange, onSelectAesthetic }: ProfilePageProps) {
  const [notifications, setNotifications] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<ProfileView>('main');
  const [userEmail, setUserEmail] = useState<string>('');
  const [fontScale, setFontScale] = useState<'sm' | 'md' | 'lg'>('md');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editStatus, setEditStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [avatarUploadStatus, setAvatarUploadStatus] = useState<'idle' | 'uploading' | 'error'>('idle');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authPassword2, setAuthPassword2] = useState('');
  const [authName, setAuthName] = useState('');
  const [authStatus, setAuthStatus] = useState<'idle' | 'submitting' | 'error' | 'signedUpNeedsConfirm'>('idle');
  const [authError, setAuthError] = useState('');
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
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
          setUserEmail(user.email ?? '');
          const profileData = await getCurrentProfile(user.id);
          setProfile(profileData);
        } else {
          setIsLoggedIn(false);
          setUserEmail('');
          setProfile({
            id: 'guest',
            name: '访客用户',
            avatar: getOrCreateLocalAvatar(),
            bio: '登录后查看更多内容',
            logCount: 0,
            contributionCount: 0,
            favoriteCount: 0,
          });
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        setIsLoggedIn(false);
        setUserEmail('');
        setProfile({
          id: 'guest',
          name: '访客用户',
          avatar: getOrCreateLocalAvatar(),
          bio: '登录后查看更多内容',
          logCount: 0,
          contributionCount: 0,
          favoriteCount: 0,
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

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const openAuth = useCallback(
    (mode: 'signin' | 'signup' = 'signin') => {
      setAuthMode(mode);
      setAuthEmail(userEmail || '');
      setAuthPassword('');
      setAuthPassword2('');
      setAuthName('');
      setAuthStatus('idle');
      setAuthError('');
      setIsAuthOpen(true);
    },
    [userEmail]
  );

  const submitAuth = useCallback(async () => {
    const email = authEmail.trim();
    const password = authPassword;
    if (!email || !password) return;
    if (authMode === 'signup' && password !== authPassword2) {
      setAuthStatus('error');
      setAuthError('两次输入的密码不一致');
      return;
    }
    setAuthStatus('submitting');
    setAuthError('');
    try {
      if (authMode === 'signin') {
        await signInWithPassword(email, password);
        window.location.reload();
        return;
      }
      const res = await signUpWithPassword(email, password, authName.trim() || undefined);
      if (res.needsConfirmation) {
        setAuthStatus('signedUpNeedsConfirm');
        return;
      }
      window.location.reload();
    } catch (e) {
      setAuthStatus('error');
      setAuthError(e instanceof Error ? e.message : '操作失败');
    }
  }, [authEmail, authPassword, authMode, authPassword2, authName]);

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
        icon: 'login',
        label: '登录 / 注册',
        count: undefined,
        action: () => openAuth('signin'),
        hidden: isLoggedIn,
      },
      {
        id: 'favorites',
        icon: 'bookmark',
        label: '我的收藏',
        count: favoriteCount,
        action: () => {
          loadStoredLists();
          setView('favorites');
        },
      },
      {
        id: 'contributions',
        icon: 'palette',
        label: '我的贡献',
        count: profile?.contributionCount ?? 0,
        action: openMyContributions,
      },
      {
        id: 'history',
        icon: 'history',
        label: '浏览记录',
        count: historyCount,
        action: () => {
          loadStoredLists();
          setView('history');
        },
      },
      {
        id: 'settings',
        icon: 'settings',
        label: '更多设置',
        count: undefined,
        action: () => setView('settings'),
      },
      {
        id: 'signout',
        icon: 'logout',
        label: '退出登录',
        action: handleSignOut,
        hidden: !isLoggedIn,
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

  const openResetPassword = () => {
    setResetEmail(userEmail);
    setResetStatus('idle');
    setIsResetDialogOpen(true);
  };

  const sendResetPassword = async () => {
    const email = resetEmail.trim();
    if (!email) return;
    setResetStatus('sending');
    try {
      await resetPassword(email);
      setResetStatus('sent');
    } catch {
      setResetStatus('error');
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
      <div className="min-h-full pb-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
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
      <div className="min-h-full pb-24">
        <header className="sticky top-0 z-20 glass-panel px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('main')}
              className="w-10 h-10 rounded-full glass-panel btn-press flex items-center justify-center"
              aria-label="返回"
            >
              <span className="material-symbols text-foreground">arrow_back</span>
            </button>
            <h1 className="font-serif text-2xl text-foreground">{title}</h1>
          </div>
        </header>

        {view === 'favorites' && (
          <div className="px-4 pt-6 space-y-4">
            {favorites.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <span className="material-symbols text-5xl mb-4">bookmark</span>
                <p className="text-base">还没有收藏</p>
                <p className="text-sm mt-1">在风格详情页点击“收藏”即可加入</p>
              </div>
            ) : (
              <div className="space-y-3">
                {favorites
                  .slice()
                  .sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0))
                  .map((item) => (
                    <div key={item.aesthetic.id} className="glass-card overflow-hidden">
                      <button
                        className="w-full text-left flex items-center gap-3 p-3"
                        onClick={() => onSelectAesthetic(item.aesthetic)}
                      >
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-secondary flex-shrink-0">
                          <img
                            src={item.aesthetic.coverImage}
                            alt={item.aesthetic.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-serif text-base text-foreground truncate">
                            {item.aesthetic.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.aesthetic.nameEn}
                          </p>
                        </div>
                      </button>
                      <div className="px-3 pb-3">
                        <Button
                          variant="outline"
                          className="w-full rounded-xl btn-press"
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
          <div className="px-4 pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">共 {history.length} 条</p>
              <button
                className="text-sm text-foreground/70 hover:text-foreground"
                onClick={clearHistory}
                disabled={history.length === 0}
              >
                清空
              </button>
            </div>
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <span className="material-symbols text-5xl mb-4">history</span>
                <p className="text-base">还没有浏览记录</p>
                <p className="text-sm mt-1">去探索页看看你喜欢的风格吧</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history
                  .slice()
                  .sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0))
                  .map((item) => (
                    <button
                      key={`${item.aesthetic.id}-${item.ts}`}
                      className="w-full glass-card p-3 flex items-center gap-3 btn-press text-left"
                      onClick={() => onSelectAesthetic(item.aesthetic)}
                    >
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-secondary flex-shrink-0">
                        <img
                          src={item.aesthetic.coverImage}
                          alt={item.aesthetic.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{item.aesthetic.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{item.aesthetic.nameEn}</p>
                      </div>
                      <span className="material-symbols text-muted-foreground">chevron_right</span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        )}

        {view === 'myContributions' && (
          <div className="px-4 pt-6">
            {!isLoggedIn || !profile || profile.id === 'guest' ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <span className="material-symbols text-5xl mb-4">palette</span>
                <p className="text-base">登录后可查看你的贡献</p>
              </div>
            ) : myContribLoading ? (
              <div className="min-h-full pb-24 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
              </div>
            ) : myContributions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <span className="material-symbols text-5xl mb-4">photo_library</span>
                <p className="text-base">你还没有发布过分享</p>
                <p className="text-sm mt-1">去工坊发布你的第一条内容</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {myContributions.map((c) => (
                  <div key={c.id} className="glass-card overflow-hidden">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={c.imageUrl} alt={c.caption} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-foreground">{c.caption}</p>
                      <div className="mt-3 flex items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols text-base">favorite</span>
                          <span className="text-xs">{c.likes}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols text-base">chat_bubble</span>
                          <span className="text-xs">{c.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'settings' && (
          <div className="px-4 pt-6 space-y-2">
            <div className="glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="material-symbols text-muted-foreground">notifications</span>
                <span className="text-foreground">消息通知</span>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
                className="data-[state=checked]:bg-foreground"
              />
            </div>

            <div className="glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="material-symbols text-muted-foreground">
                  {theme === 'dark' ? 'dark_mode' : 'light_mode'}
                </span>
                <span className="text-foreground">深色模式</span>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) =>
                  onThemeChange(checked ? 'dark' : 'light')
                }
                className="data-[state=checked]:bg-foreground"
              />
            </div>

            <div className="glass-card p-4">
              <div className="flex items-center gap-4 mb-3">
                <span className="material-symbols text-muted-foreground">text_fields</span>
                <span className="text-foreground">字体大小</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={fontScale === 'sm' ? 'default' : 'outline'}
                  className="flex-1 rounded-xl btn-press"
                  onClick={() => setFontScale('sm')}
                >
                  小
                </Button>
                <Button
                  variant={fontScale === 'md' ? 'default' : 'outline'}
                  className="flex-1 rounded-xl btn-press"
                  onClick={() => setFontScale('md')}
                >
                  标准
                </Button>
                <Button
                  variant={fontScale === 'lg' ? 'default' : 'outline'}
                  className="flex-1 rounded-xl btn-press"
                  onClick={() => setFontScale('lg')}
                >
                  大
                </Button>
              </div>
            </div>

            <div className="glass-card p-4">
              <div className="flex items-center gap-4 mb-3">
                <span className="material-symbols text-muted-foreground">verified_user</span>
                <span className="text-foreground">账号安全</span>
              </div>
              <Button
                variant="outline"
                className="w-full rounded-xl btn-press"
                disabled={!isLoggedIn}
                onClick={openResetPassword}
              >
                {isLoggedIn ? '重置密码' : '登录后可用'}
              </Button>
            </div>

            {isLoggedIn && (
              <div className="glass-card p-4">
                <Button
                  variant="outline"
                  className="w-full rounded-xl btn-press"
                  onClick={handleSignOut}
                >
                  退出登录
                </Button>
              </div>
            )}
          </div>
        )}

        <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
          <DialogContent className="glass-card border-0 max-w-sm">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">重置密码</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                type="email"
                placeholder="邮箱"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="bg-secondary/50 border-0 rounded-xl"
              />
              <Button
                onClick={sendResetPassword}
                disabled={resetStatus === 'sending' || !resetEmail.trim()}
                className="w-full btn-press disabled:opacity-50"
              >
                {resetStatus === 'sending' ? '发送中...' : '发送重置邮件'}
              </Button>
              {resetStatus === 'sent' && (
                <div className="text-sm text-muted-foreground">
                  已发送重置邮件，请前往邮箱完成操作。
                </div>
              )}
              {resetStatus === 'error' && (
                <div className="text-sm text-muted-foreground">
                  发送失败，请稍后重试。
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-24">
      {/* Header */}
      <header className="px-4 py-6">
        <h1 className="font-serif text-2xl text-foreground">个人中心</h1>
      </header>

      {/* Profile Card */}
      <div className="px-4 mb-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={openEditProfile}
                className="relative w-20 h-20 rounded-full btn-press"
                aria-label="编辑个人信息"
              >
                <div className="absolute inset-0 rounded-full overflow-hidden bg-secondary">
                  <img
                    src={profile?.avatar}
                    alt={profile?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-black/10 opacity-0 hover:opacity-100 transition-opacity" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-neon flex items-center justify-center">
                  <span className="material-symbols text-sm text-white">edit</span>
                </div>
              </button>
            </div>
            <div className="flex-1">
              <h2 className="font-serif text-xl text-foreground mb-1">
                {profile?.name}
              </h2>
              <p className="text-sm text-muted-foreground">{profile?.bio}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-around mt-6 pt-6 border-t border-border">
            <div className="text-center">
              <p className="font-serif text-2xl text-foreground">
                {historyCount}
              </p>
              <p className="text-xs text-muted-foreground mt-1">浏览</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-2xl text-foreground">
                {profile?.contributionCount}
              </p>
              <p className="text-xs text-muted-foreground mt-1">贡献</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-2xl text-foreground">
                {favoriteCount}
              </p>
              <p className="text-xs text-muted-foreground mt-1">收藏</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 space-y-2">
        {menuItems
          .filter((item) => !item.hidden)
          .map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              className="w-full glass-card p-4 flex items-center gap-4 btn-press"
            >
              <span className="material-symbols text-muted-foreground">
                {item.icon}
              </span>
              <span className="flex-1 text-left text-foreground">{item.label}</span>
              {item.count !== undefined && (
                <span className="text-sm text-muted-foreground">{item.count}</span>
              )}
              <span className="material-symbols text-muted-foreground">
                chevron_right
              </span>
            </button>
          ))}
      </div>

      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="glass-card border-0 max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">编辑个人信息</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {!isLoggedIn && (
              <div className="text-sm text-muted-foreground">
                当前为访客模式，登录后可保存修改。
              </div>
            )}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">昵称</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-secondary/50 border-0 rounded-xl"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">头像</label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-grayWhite-100 flex items-center justify-center flex-shrink-0">
                  {editAvatar ? (
                    <img src={editAvatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols text-muted-foreground">person</span>
                  )}
                </div>
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
                  className={
                    "h-10 px-4 inline-flex items-center justify-center rounded-xl bg-grayWhite-white text-[#1f1f1f] hover:bg-grayWhite-50 active:bg-grayWhite-100 transition-colors duration-220 ease-kimi " +
                    (!isLoggedIn || avatarUploadStatus === 'uploading'
                      ? 'opacity-40 cursor-not-allowed pointer-events-none'
                      : 'cursor-pointer')
                  }
                >
                  {avatarUploadStatus === 'uploading' ? '上传中...' : '从相册选择'}
                </label>
                <button
                  type="button"
                  className={
                    "h-10 px-4 inline-flex items-center justify-center rounded-xl bg-grayWhite-white text-[#1f1f1f] hover:bg-grayWhite-50 active:bg-grayWhite-100 transition-colors duration-220 ease-kimi " +
                    (!editAvatar || avatarUploadStatus === 'uploading'
                      ? 'opacity-40 cursor-not-allowed pointer-events-none'
                      : 'cursor-pointer')
                  }
                  onClick={() => setEditAvatar('')}
                  disabled={!editAvatar || avatarUploadStatus === 'uploading'}
                >
                  移除
                </button>
                <span className="text-xs text-muted-foreground">
                  {avatarUploadStatus === 'error'
                    ? '上传失败'
                    : editAvatar
                      ? '已选择'
                      : '未选择'}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">简介</label>
              <Textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="bg-secondary/50 border-0 rounded-xl resize-none"
                rows={3}
              />
            </div>
            {editStatus === 'error' && (
              <div className="text-sm text-muted-foreground">保存失败，请稍后重试。</div>
            )}
            <div className="flex gap-3 pt-1">
              <Button
                variant="outline"
                className="flex-1 rounded-xl btn-press"
                onClick={() => setIsEditProfileOpen(false)}
              >
                取消
              </Button>
              <Button
                className="flex-1 btn-press rounded-xl disabled:opacity-50"
                onClick={saveProfile}
                disabled={!isLoggedIn || editStatus === 'saving' || avatarUploadStatus === 'uploading' || !editName.trim()}
              >
                {editStatus === 'saving' ? '保存中...' : '保存'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isAuthOpen}
        onOpenChange={(v) => {
          setIsAuthOpen(v);
          if (!v) {
            setAuthStatus('idle');
            setAuthError('');
          }
        }}
      >
        <DialogContent className="glass-card border-0 max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {authMode === 'signin' ? '登录' : '注册'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-grayWhite-50 p-1">
              <button
                type="button"
                className={`h-10 rounded-xl text-sm transition-colors duration-220 ease-kimi ${
                  authMode === 'signin' ? 'bg-grayWhite-white text-[#1f1f1f]' : 'text-muted-foreground'
                }`}
                onClick={() => {
                  setAuthMode('signin');
                  setAuthStatus('idle');
                  setAuthError('');
                }}
              >
                登录
              </button>
              <button
                type="button"
                className={`h-10 rounded-xl text-sm transition-colors duration-220 ease-kimi ${
                  authMode === 'signup' ? 'bg-grayWhite-white text-[#1f1f1f]' : 'text-muted-foreground'
                }`}
                onClick={() => {
                  setAuthMode('signup');
                  setAuthStatus('idle');
                  setAuthError('');
                }}
              >
                注册
              </button>
            </div>

            {authStatus === 'signedUpNeedsConfirm' ? (
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  已提交注册，请前往邮箱完成验证后再登录。
                </div>
                <Button
                  className="w-full bg-[#535353] text-[#B9B9B9] hover:bg-[#535353] btn-press rounded-xl"
                  onClick={() => {
                    setAuthMode('signin');
                    setAuthStatus('idle');
                    setAuthError('');
                  }}
                >
                  返回登录
                </Button>
              </div>
            ) : (
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  void submitAuth();
                }}
              >
                {authMode === 'signup' && (
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">昵称（可选）</label>
                    <Input
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="bg-secondary/50 border-0 rounded-xl"
                      autoComplete="nickname"
                    />
                  </div>
                )}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">邮箱</label>
                  <Input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="bg-secondary/50 border-0 rounded-xl"
                    autoComplete="email"
                    inputMode="email"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">密码</label>
                  <Input
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="bg-secondary/50 border-0 rounded-xl"
                    autoComplete={authMode === 'signin' ? 'current-password' : 'new-password'}
                  />
                </div>
                {authMode === 'signup' && (
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">确认密码</label>
                    <Input
                      type="password"
                      value={authPassword2}
                      onChange={(e) => setAuthPassword2(e.target.value)}
                      className="bg-secondary/50 border-0 rounded-xl"
                      autoComplete="new-password"
                    />
                  </div>
                )}

                {authStatus === 'error' && (
                  <div className="text-sm text-muted-foreground">{authError || '操作失败，请重试。'}</div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#535353] text-[#B9B9B9] hover:bg-[#535353] btn-press rounded-xl disabled:opacity-50"
                  disabled={
                    authStatus === 'submitting' ||
                    !authEmail.trim() ||
                    !authPassword ||
                    (authMode === 'signup' && !authPassword2)
                  }
                >
                  {authStatus === 'submitting'
                    ? authMode === 'signin'
                      ? '登录中...'
                      : '注册中...'
                    : authMode === 'signin'
                      ? '登录'
                      : '注册'}
                </Button>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Version */}
      <div className="text-center mt-8 pb-8">
        <p className="text-xs text-muted-foreground">审美积累 v1.1.0</p>
      </div>
    </div>
  );
}
