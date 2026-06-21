import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  completeAuthFromUrl,
  redirectToHomeAfterAuth,
} from '@/supabase/services/auth';

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
    if (type === 'signup' || type === 'email') return 'signup';
    return 'unknown';
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        await completeAuthFromUrl();

        if (cancelled) return;
        setStatus('success');
        setMessage(intent === 'recovery' ? '会话已恢复，即将返回…' : '验证成功，即将进入…');

        window.setTimeout(() => {
          if (!cancelled) {
            redirectToHomeAfterAuth();
          }
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
              onClick={() => redirectToHomeAfterAuth()}
            >
              返回应用
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
