import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getSessionUser,
  login as loginFn,
  logout as logoutFn,
  signup as signupFn,
  subscribe,
} from "../lib/store";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getSessionUser());

  useEffect(() => {
    const unsub = subscribe(() => setUser(getSessionUser()));
    return unsub;
  }, []);

  const login = useCallback((payload) => {
    return loginFn(payload).then((u) => {
      setUser(u);
      return u;
    });
  }, []);

  const signup = useCallback((payload) => {
    return signupFn(payload).then((u) => {
      setUser(u);
      return u;
    });
  }, []);

  const logout = useCallback(() => {
    logoutFn();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

