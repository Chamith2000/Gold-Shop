import React, { createContext, useContext, useState, useEffect } from "react";
import { User, RewardProfile } from "../types";
import { api, getAuthToken, setAuthToken, removeAuthToken } from "../services/api";

interface AuthContextType {
  user: User | null;
  rewardProfile: RewardProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { fullName: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
  setRewardProfile: React.Dispatch<React.SetStateAction<RewardProfile | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [rewardProfile, setRewardProfile] = useState<RewardProfile | null>(null);
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    const currentToken = getAuthToken();
    if (!currentToken) {
      setUser(null);
      setRewardProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await api.auth.me();
      setUser(data.user);
      setRewardProfile(data.rewardProfile);
    } catch {
      // Token invalid or expired
      removeAuthToken();
      setToken(null);
      setUser(null);
      setRewardProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const data = await api.auth.login(credentials);
      setAuthToken(data.token);
      setToken(data.token);
      setUser(data.user);
      setRewardProfile(data.rewardProfile);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { fullName: string; email: string; password: string; phone?: string }) => {
    setIsLoading(true);
    try {
      const res = await api.auth.register(data);
      setAuthToken(res.token);
      setToken(res.token);
      setUser(res.user);
      setRewardProfile(res.rewardProfile);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    setToken(null);
    setUser(null);
    setRewardProfile(null);
  };

  const refreshProfile = async () => {
    if (getAuthToken()) {
      try {
        const data = await api.auth.me();
        setUser(data.user);
        setRewardProfile(data.rewardProfile);
      } catch {
        // silent
      }
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        rewardProfile,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === "ADMIN",
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
        updateUser,
        setRewardProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
