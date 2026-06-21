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
  
  return {
    id: user.id,
    email: user.email ?? '',
    name: user.user_metadata?.name as string | undefined,
    avatar: user.user_metadata?.avatar as string | undefined,
  };
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
    user: {
      id: data.user.id,
      email: data.user.email ?? '',
      name: data.user.user_metadata?.name as string | undefined,
      avatar: data.user.user_metadata?.avatar as string | undefined,
    },
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
      emailRedirectTo: `${window.location.origin}/auth/callback`,
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

export async function signInWithEmailOtp(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  if (error) {
    throw new Error(mapSupabaseError(error, '发送验证码失败'));
  }
  
  return {
    success: true,
    message: '验证码已发送到你的邮箱',
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
    user: {
      id: data.user.id,
      email: data.user.email ?? '',
      name: data.user.user_metadata?.name as string | undefined,
      avatar: data.user.user_metadata?.avatar as string | undefined,
    },
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
    redirectTo: `${window.location.origin}/auth/callback`,
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

export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  return supabase.auth.onAuthStateChange((_, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email ?? '',
        name: session.user.user_metadata?.name as string | undefined,
        avatar: session.user.user_metadata?.avatar as string | undefined,
      });
    } else {
      callback(null);
    }
  });
}
