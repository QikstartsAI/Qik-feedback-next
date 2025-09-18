import { useState, useEffect } from 'react';
import { HttpClient } from '@/lib/core/httpClient';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Check if we have a valid token in localStorage
    const storedToken = localStorage.getItem('qik_auth_token');
    if (storedToken) {
      // For now, we'll use the hardcoded token as fallback
      // In production, you should validate the token and refresh if needed
      setAuthState({
        isAuthenticated: true,
        token: storedToken,
        isLoading: false,
        error: null,
      });
    } else {
      // Use the hardcoded token as fallback for development
      const fallbackToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODZjMmY1MDUzOWM4ZjVhNDg0ODdiYmMiLCJyb2xlcyI6WyJ1c2VyIl0sImJyYW5kSWQiOiJhYzM0YzQwMi03M2ExLTRhMmItYjkyMC1iOWExNDc0NzFlY2IiLCJpYXQiOjE3NTIxNTcxNzcsImV4cCI6MTc1MjI0MzU3N30.QgwliL6ju1bC3HZZquLGtOD9snKcJ9umb6MaEzicBoI";
      
      setAuthState({
        isAuthenticated: true,
        token: fallbackToken,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const httpClient = HttpClient.createWithEnv();
      const response = await httpClient.post('/auth/signin', { email, password });
      
      const data = response.data;
      const token = data.access_token || data.token;
      
      if (token) {
        localStorage.setItem('qik_auth_token', token);
        setAuthState({
          isAuthenticated: true,
          token,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        token: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('qik_auth_token');
    setAuthState({
      isAuthenticated: false,
      token: null,
      isLoading: false,
      error: null,
    });
  };

  return {
    ...authState,
    login,
    logout,
  };
};
