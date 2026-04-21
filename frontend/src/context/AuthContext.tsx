/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, type LoginPayload, type SignupPayload, type UpdateProfilePayload } from '../api/authApi';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  roles: string[];
  provider?: string;
  profilePictureUrl?: string;
  createdAt?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  loading: boolean;
  login: (credentials: LoginPayload) => Promise<AuthUser>;
  signup: (data: SignupPayload) => Promise<AuthUser>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (data: UpdateProfilePayload) => Promise<void>;
  hasRole: (role: string) => boolean;
  isAdmin: boolean;
  isTechnician: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window.location.pathname.includes('/oauth2/callback')) {
      setLoading(false);
      return;
    }

    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await authApi.getMe();
        setUser(res.data as AuthUser);
      } catch {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    void initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginPayload) => {
    const res = await authApi.login(credentials);
    const data = res.data as AuthUser & { token: string };
    localStorage.setItem('token', data.token);
    setUser(data);
    return data;
  }, []);

  const signup = useCallback(async (data: SignupPayload) => {
    const res = await authApi.signup(data);
    const response = res.data as AuthUser & { token: string };
    localStorage.setItem('token', response.token);
    setUser(response);
    return response;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const res = await authApi.getMe();
    setUser(res.data as AuthUser);
  }, []);

  const updateProfile = useCallback(async (data: UpdateProfilePayload) => {
    await authApi.updateProfile(data);
    await refreshUser();
  }, [refreshUser]);

  const hasRole = useCallback((role: string) => user?.roles?.includes(role) ?? false, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      setUser,
      loading,
      login,
      signup,
      logout,
      refreshUser,
      updateProfile,
      hasRole,
      isAdmin: hasRole('ADMIN'),
      isTechnician: hasRole('TECHNICIAN'),
      isAuthenticated: !!user,
    }),
    [user, loading, login, signup, logout, refreshUser, updateProfile, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
