import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Mail, Lock, User, CheckCircle, ArrowLeft, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { signInWithPassword, signUpWithPassword, signInWithEmailOtp, verifyOtp, resetPassword, updatePassword } from '@/supabase/services/auth';
import { toast } from 'sonner';

type AuthMode = 'password' | 'otp' | 'forgot-password' | 'reset-password';
type AuthTab = 'signin' | 'signup';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EnhancedAuthModal({ open, onOpenChange, onSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  const [authMode, setAuthMode] = useState<AuthMode>('password');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: number;
    if (countdown > 0) {
      timer = window.setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const resetState = useCallback(() => {
    setActiveTab('signin');
    setAuthMode('password');
    setLoading(false);
    setShowPassword(false);
    setCountdown(0);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setOtp('');
    setError('');
    setMessage('');
  }, []);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (!newOpen) {
      resetState();
    }
    onOpenChange(newOpen);
  }, [onOpenChange, resetState]);

  const handleSignInWithPassword = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    
    setLoading(true);
    setError('');
    
    try {
      await signInWithPassword(email.trim(), password);
      toast.success('登录成功');
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setLoading(false);
    }
  }, [email, password, onOpenChange, onSuccess]);

  const handleSignUp = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password || !confirmPassword) return;
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await signUpWithPassword(email.trim(), password, name.trim());
      if (result.needsConfirmation) {
        setMessage('已发送验证邮件，请前往邮箱完成验证');
        setAuthMode('otp');
        setCountdown(60);
      } else {
        toast.success('注册成功');
        onOpenChange(false);
        onSuccess?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败');
    } finally {
      setLoading(false);
    }
  }, [email, password, confirmPassword, name, onOpenChange, onSuccess]);

  const handleSendOtp = useCallback(async () => {
    if (!email.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailOtp(email.trim());
      setMessage('验证码已发送到你的邮箱');
      setCountdown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送失败');
    } finally {
      setLoading(false);
    }
  }, [email]);

  const handleVerifyOtp = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || otp.length !== 6) return;
    
    setLoading(true);
    setError('');
    
    try {
      await verifyOtp(email.trim(), otp);
      toast.success('登录成功');
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : '验证失败');
    } finally {
      setLoading(false);
    }
  }, [email, otp, onOpenChange, onSuccess]);

  const handleForgotPassword = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      await resetPassword(email.trim());
      setMessage('重置密码邮件已发送，请查看邮箱');
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送失败');
    } finally {
      setLoading(false);
    }
  }, [email]);

  const handleOtpInputChange = useCallback((index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    
    const newOtp = otp.split('');
    newOtp[index] = value;
    setOtp(newOtp.join(''));
    
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  }, [otp]);

  const handleOtpKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="glass-card border-0 max-w-sm p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="font-serif text-xl">
            {authMode === 'forgot-password' ? '忘记密码' : 
             authMode === 'reset-password' ? '重置密码' : 
             activeTab === 'signin' ? '登录' : '注册'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6 pb-6 space-y-4">
          {authMode === 'password' && (
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AuthTab)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-grayWhite-50 rounded-2xl p-1 mb-4">
                <TabsTrigger value="signin" className="rounded-xl h-10">登录</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-xl h-10">注册</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4 mt-0">
                <form onSubmit={handleSignInWithPassword} className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">邮箱</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-secondary/50 border-0 rounded-xl"
                        placeholder="your@email.com"
                        autoComplete="email"
                        inputMode="email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm text-muted-foreground">密码</label>
                      <button
                        type="button"
                        onClick={() => setAuthMode('forgot-password')}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        忘记密码？
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 bg-secondary/50 border-0 rounded-xl"
                        placeholder="••••••••"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  
                  <Button type="submit" className="w-full btn-press rounded-xl disabled:opacity-50" disabled={loading || !email.trim() || !password}>
                    {loading ? '登录中...' : '登录'}
                  </Button>
                </form>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">或者</span>
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl"
                  onClick={() => setAuthMode('otp')}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  邮箱验证码登录
                </Button>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 mt-0">
                <form onSubmit={handleSignUp} className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">昵称（可选）</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 bg-secondary/50 border-0 rounded-xl"
                        placeholder="给你起个名字"
                        autoComplete="nickname"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">邮箱</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-secondary/50 border-0 rounded-xl"
                        placeholder="your@email.com"
                        autoComplete="email"
                        inputMode="email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">密码</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 bg-secondary/50 border-0 rounded-xl"
                        placeholder="至少6位字符"
                        autoComplete="new-password"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">确认密码</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 bg-secondary/50 border-0 rounded-xl"
                        placeholder="再次输入密码"
                        autoComplete="new-password"
                        minLength={6}
                      />
                    </div>
                  </div>
                  
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  
                  <Button type="submit" className="w-full btn-press rounded-xl disabled:opacity-50" disabled={loading || !email.trim() || !password || !confirmPassword}>
                    {loading ? '注册中...' : '注册'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
          
          {authMode === 'otp' && (
            <div className="space-y-4">
              <button
                onClick={() => setAuthMode('password')}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                返回
              </button>
              
              {message && (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl text-sm">
                  <CheckCircle className="w-4 h-4" />
                  {message}
                </div>
              )}
              
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">邮箱</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-secondary/50 border-0 rounded-xl"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <Input
                    key={i}
                    ref={(el) => otpInputRefs.current[i] = el}
                    type="text"
                    maxLength={1}
                    value={otp[i] || ''}
                    onChange={(e) => handleOtpInputChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="text-center text-lg font-medium bg-secondary/50 border-0 rounded-xl"
                    inputMode="numeric"
                    autoFocus={i === 0 && message ? true : false}
                  />
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={handleSendOtp}
                  disabled={loading || !email.trim() || countdown > 0}
                >
                  {countdown > 0 ? `重试 (${countdown}s)` : '发送验证码'}
                </Button>
                <Button
                  type="button"
                  className="flex-1 rounded-xl"
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? '验证中...' : '验证登录'}
                </Button>
              </div>
              
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          )}
          
          {authMode === 'forgot-password' && (
            <div className="space-y-4">
              <button
                onClick={() => setAuthMode('password')}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                返回登录
              </button>
              
              <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl">
                <ShieldAlert className="w-8 h-8 text-muted-foreground" />
                <div>
                  <p className="text-sm text-foreground font-medium">账号找回</p>
                  <p className="text-xs text-muted-foreground">输入你的邮箱，我们将发送重置链接</p>
                </div>
              </div>
              
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">邮箱</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-secondary/50 border-0 rounded-xl"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                {message && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl text-sm">
                    <CheckCircle className="w-4 h-4" />
                    {message}
                  </div>
                )}
                
                {error && <p className="text-sm text-destructive">{error}</p>}
                
                <Button type="submit" className="w-full btn-press rounded-xl disabled:opacity-50" disabled={loading || !email.trim()}>
                  {loading ? '发送中...' : '发送重置邮件'}
                </Button>
              </form>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
