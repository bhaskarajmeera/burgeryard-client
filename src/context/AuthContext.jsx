import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'burgerYardUser';
const USERS_KEY = 'burgerYardUsers';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const persistUser = (nextUser) => {
    setUser(nextUser);

    if (nextUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
  };

  const signup = ({ name, email, password }) => {
    const savedUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const alreadyExists = savedUsers.some(
      (entry) => entry.email.toLowerCase() === email.toLowerCase(),
    );

    if (alreadyExists) {
      return { ok: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
    };

    const updatedUsers = [...savedUsers, newUser];
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    persistUser({ id: newUser.id, name: newUser.name, email: newUser.email });

    return { ok: true };
  };

  const login = ({ email, password }) => {
    const savedUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const matchedUser = savedUsers.find(
      (entry) =>
        entry.email.toLowerCase() === email.toLowerCase() &&
        entry.password === password,
    );

    if (!matchedUser) {
      return { ok: false, message: 'Invalid email or password.' };
    }

    persistUser({
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
    });

    return { ok: true };
  };

  const logout = () => {
    persistUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      signup,
      logout,
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
