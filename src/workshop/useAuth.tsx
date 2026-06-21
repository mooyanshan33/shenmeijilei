import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from 'react';
import { supabase } from '@/supabase/client';
import type { Profile } from './types';

interface AuthContextType {
  user: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const { data: authUser } = await supabase.auth.getUser();

    if (!authUser.user) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.user.id)
      .single();

    if (profile) {
      setUser(profile as Profile);
    } else {
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert({
          id: authUser.user.id,
          username: authUser.user.email?.split('@')[0] || '用户',
          role: 'user',
        })
        .select()
        .single();

      setUser(newProfile as Profile);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchProfile();
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
