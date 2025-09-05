'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Session, User } from '@supabase/supabase-js';

const AuthContext = createContext<{ 
  session: Session | null;
  user: User | null;
  signOut: () => void;
  loading: boolean;
}>({ 
  session: null, 
  user: null,
  signOut: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = useMemo(() => createClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        // Log only generic error, avoid leaking details
        console.error('Error fetching user');
      }
      let userObj = data.user ?? null;
      setUser(userObj);
      // Try to get role from user metadata
      let role = userObj?.user_metadata?.role || userObj?.role;
      setRole(role);
      // Fetch session separately for accuracy
      const sessionRes = await supabase.auth.getSession();
      setSession(sessionRes.data.session ?? null);
      setLoading(false);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      // Try to get role from user metadata
      let role = session?.user?.user_metadata?.role || session?.user?.role;
      setRole(role);
      // Do not set loading to false here, only after initial load
      // Avoid logging sensitive session/user info
      console.log('AuthContext: Auth state changed', _event);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Avoid logging sensitive user info
  return (
    <AuthContext.Provider value={{ session, user: user ? { ...user, role } : null, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
