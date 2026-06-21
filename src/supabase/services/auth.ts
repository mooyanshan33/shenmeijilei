import type { AuthChangeEvent, EmailOtpType } from '@supabase/supabase-js';
import { supabase } from '@/supabase/client';
import { mapSupabaseError } from '@/supabase/error';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
}

const AUTH_CALLBACK_PATH = '/auth/callback';

/** 根据当前环境生成鉴权回调 URL（兼容 localhost 与 Vercel 线上域名） */
export function getAuthRedirectUrl(path: string = AUTH_CALLBACK_PATH): string {
  if (typeof window === 'undefined') {
    return path;
  }

  const origin = window.location.origin.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${normalizedPath}`;
}

function mapAuthUser(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}): AuthUser {
  return {
    id: user.id,
    email: user.email ?? '',
    name: user.user_metadata?.name as string | undefined,
    avatar: user.user_metadata?.avatar as string | undefined,
  };
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw new Error(mapSupabaseError(error, '获取会话失败'));
  }
  return data.session;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return mapAuthUser(user);
}

export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(mapSupabaseError(error, '登录失败'));
  }

  if (!data.session) {
    throw new Error('登录成功但未获取到会话');
  }

  return {
    user: mapAuthUser(data.user),
    accessToken: data.session.access_token,
  } as AuthSession;
}

export async function signUpWithPassword(
  email: string,
  password: string,
  name?: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getAuthRedirectUrl(),
      data: {
        name: name ?? email.split('@')[0],
      },
    },
  });

  if (error) {
    throw new Error(mapSupabaseError(error, '注册失败'));
  }

  return {
    id: data.user?.id,
    email: data.user?.email,
    needsConfirmation: !data.session,
  };
}

export async function signInWithEmailOtp(
  email: string,
  options?: { shouldCreateUser?: boolean }
) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: getAuthRedirectUrl(),
      shouldCreateUser: options?.shouldCreateUser ?? true,
    },
  });

  if (error) {
    throw new Error(mapSupabaseError(error, '发送验证码失败'));
  }

  return {
    success: true,
    message: '验证邮件已发送，请前往邮箱点击链接完成登录',
  };
}

export async function verifyOtp(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  if (error) {
    throw new Error(mapSupabaseError(error, '验证码验证失败'));
  }

  if (!data.session) {
    throw new Error('验证成功但未获取到会话');
  }

  if (!data.user) {
    throw new Error('验证成功但未获取到用户信息');
  }

  return {
    user: mapAuthUser(data.user),
    accessToken: data.session.access_token,
  } as AuthSession;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(mapSupabaseError(error, '退出登录失败'));
  }
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getAuthRedirectUrl(),
  });

  if (error) {
    throw new Error(mapSupabaseError(error, '发送重置邮件失败'));
  }

  return true;
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error(mapSupabaseError(error, '重置密码失败'));
  }

  return true;
}

/** 处理邮箱验证 / Magic Link / 密码重置等回调 URL 中的 token */
export async function completeAuthFromUrl(url: string = window.location.href) {
  const parsed = new URL(url);
  const query = parsed.searchParams;
  const hashParams = new URLSearchParams(parsed.hash.replace(/^#/, ''));

  const tokenHash = query.get('token_hash') ?? hashParams.get('token_hash');
  const otpType = (query.get('type') ?? hashParams.get('type')) as EmailOtpType | null;
  const code = query.get('code');
  const accessToken = hashParams.get('access_token');
  const refreshToken = hashParams.get('refresh_token');

  if (tokenHash && otpType) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: otpType,
    });
    if (error) {
      throw new Error(mapSupabaseError(error, '邮箱验证失败'));
    }
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      throw new Error(mapSupabaseError(error, '登录验证失败'));
    }
  } else if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (error) {
      throw new Error(mapSupabaseError(error, '会话建立失败'));
    }
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw new Error(mapSupabaseError(error, '获取会话失败'));
  }

  if (!data.session) {
    throw new Error('链接无效或已过期，请返回应用后重新登录/注册');
  }

  return data.session;
}

export function onAuthStateChange(
  callback: (event: AuthChangeEvent, user: AuthUser | null) => void
) {
  return supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      callback(event, mapAuthUser(session.user));
    } else {
      callback(event, null);
    }
  });
}

export function redirectToHomeAfterAuth() {
  window.history.replaceState({}, '', '/');
  window.location.replace('/');
}

export function isAuthCallbackPath(pathname: string = window.location.pathname) {
  return pathname.startsWith(AUTH_CALLBACK_PATH);
}
