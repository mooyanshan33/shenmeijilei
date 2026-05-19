import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/supabase/client';
import { Button } from '@/components/ui/button';

type Status = 'processing' | 'success' | 'error';

function normalizeErrorMessage(e: unknown) {
  if (e instanceof Error && e.message) return e.message;
  if (typeof e === 'string') return e;
  return '验证失败，请重试';
}

export function AuthCallback() {
  const [status, setStatus] = useState<Status>('processing');
  const [message, setMessage] = useState('正在验证…');

  const intent = useMemo(() => {
    const url = new URL(window.location.href);
    const type = url.searchParams.get('type') ?? '';
    if (type === 'recovery') return 'recovery';
    if (type === 'signup') return 'signup';
    return 'unknown';
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
        } else {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;
          if (!data.session) {
            throw new Error('链接无效或已过期，请返回应用后重新登录/注册');
          }
        }

        if (cancelled) return;
        setStatus('success');
        setMessage(intent === 'recovery' ? '会话已恢复，即将返回…' : '验证成功，即将进入…');

        window.history.replaceState({}, '', '/');
        window.setTimeout(() => {
          window.location.replace('/');
        }, 500);
      } catch (e) {
        if (cancelled) return;
        setStatus('error');
        setMessage(normalizeErrorMessage(e));
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [intent]);

  return (
    <div className="min-h-full px-4 pt-10 pb-24">
      <div className="glass-card p-6">
        <div className="section-kicker mb-3">
          <span>{intent === 'recovery' ? 'Account' : 'Auth'}</span>
          <span className="soft-divider" />
        </div>
        <h1 className="font-serif text-2xl text-foreground">
          {intent === 'recovery' ? '恢复登录' : '邮箱验证'}
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{message}</p>

        {status === 'error' && (
          <div className="mt-6 flex gap-3">
            <Button
              className="flex-1 bg-[#535353] text-[#B9B9B9] hover:bg-[#535353] btn-press rounded-xl"
              onClick={() => window.location.replace('/')}
            >
              返回应用
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
