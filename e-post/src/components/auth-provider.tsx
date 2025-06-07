import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { getToken, removeToken, setToken } from "../lib/tokens";
import { getUser, removeUser, setUser } from "../lib/users";

// --- Types ---
type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff" | "customer";
};

type AuthContextType = {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<any>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<any>;
  logout: () => void;
  isLoading: boolean;
};

// --- Context Setup ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);


// --- Provider Component ---
export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // --- Check current auth state on mount ---
  const checkAuthStatus = useCallback(async () => {
    const token = getToken();
    const storedUser = getUser();

    if (!token || !storedUser) {
      setUser(null);
      setCurrentUser(null);
      setIsLoading(false);
      return;
    }

    try {
      setUser(storedUser);
      setCurrentUser(storedUser);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      navigate("/dashboard");
    } catch (err) {
      console.error("Error loading session:", err);
      removeToken();
      removeUser();
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
      setCurrentUser(null);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // --- Login Function ---
  const login = async (email: string, password: string): Promise<any> => {
    try {
      const response = await api.post<{ user: User; token: string; message?: string }>(
        "/auth/login",
        { email, password }
      );

      const { user: loggedInUser, token, message: msg } = response.data;

      if(msg) {
        removeToken();
        removeUser();
        delete api.defaults.headers.common["Authorization"];
        setUser(null);
        return response;
      }
      // Save user & token
      setToken(token);
      setUser(loggedInUser);
      setCurrentUser(loggedInUser);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return response;

    } catch (err: any) {
      console.error("Login failed: ", err.message);

      // Clean local state
      setUser(null);
      removeToken();
      removeUser();
      delete api.defaults.headers.common["Authorization"];
      setCurrentUser(null);

      return err.response;
    }
  };

  // --- Signup Function ---
  const signup = async (
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<any> => {
    try {
      const response = await api.post<{ token: string; message?: string }>(
        "/auth/signup/staff",
        { name, email, password, role }
      );

      setToken(response.data.token);
      return response;
    } catch (err: any) {
      console.error("Signup failed:", err);
      setUser(null);
      removeToken();
      removeUser();
      delete api.defaults.headers.common["Authorization"];
      setCurrentUser(null);
      return err.response;
    }
  };

  // --- Logout Function ---
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      removeToken();
      removeUser();
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
      navigate("/login");
    }
  };

  // --- Context Value ---
  const value: AuthContextType = {
    currentUser,
    login,
    signup,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// --- Hook to use Auth ---
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
