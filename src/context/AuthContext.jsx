import { createContext, useContext, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { authApi } from '../api/axios';

const AuthContext = createContext(null);
const STORAGE_KEY = 'burgerYardUser';
const TOKEN_KEY = 'burgerYardToken';

const toUser = (userData) => ({
  id: userData.id,
  name: userData.name,
  email: userData.email,
  role: userData.role || 'user',
  phone: userData.phone || '',
  deliveryAddress: userData.deliveryAddress || {},
  paymentCard: userData.paymentCard || {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const persistUser = (nextUser, token = null) => {
    setUser(nextUser);

    if (nextUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      }
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  // Register the customer, then persist the returned session locally.
  const signup = async ({ name, email, password }) => {
    try {
      const { data } = await authApi.signup({ name, email, password });

      const nextUser = toUser(data.user);

      persistUser(nextUser, data.token);
      toast.success('Account created successfully!');

      return { ok: true, user: nextUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(message);
      return {
        ok: false,
        message,
      };
    }
  };

  // Authenticate the customer, then persist the returned session locally.
  const login = async ({ email, password }) => {
    try {
      const { data } = await authApi.login({ email, password });

      const nextUser = toUser(data.user);

      persistUser(nextUser, data.token);
      toast.success('Logged in successfully!');

      return { ok: true, user: nextUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid email or password.';
      toast.error(message);
      return {
        ok: false,
        message,
      };
    }
  };

  // Start the provider redirect; OAuth completion happens on the callback route.
  const socialLogin = async (provider) => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    window.location.assign(`${apiBaseUrl}/api/v1/auth/${provider}`);
    return { ok: true };
  };

  // Store the provider session returned by the OAuth callback.
  const completeSocialLogin = (token, userData) => {
    const nextUser = toUser(userData);
    persistUser(nextUser, token);
    toast.success('Signed in successfully!');
  };

  const updateUser = (nextUser) => {
    persistUser(toUser(nextUser));
  };

  // Clear the stored session and notify the user after signing out.
  const logout = () => {
    persistUser(null);
    toast.info('Signed out successfully.');
  };

  const value = useMemo(
    () => ({
      user,
      login,
      signup,
      socialLogin,
      completeSocialLogin,
      logout,
      updateUser,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
