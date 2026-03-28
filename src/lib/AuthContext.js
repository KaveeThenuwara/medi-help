"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    
    if (token && email && role) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser({ email, role, token });
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("email", userData.email);
    localStorage.setItem("role", userData.role);
    setUser(userData);
    
    // Redirect based on role
    if (userData.role === "ADMIN") router.push("/admin");
    else if (userData.role === "DOCTOR") router.push("/dashboard/doctor");
    else if (userData.role === "RECEPTION") router.push("/dashboard/reception");
    else router.push("/dashboard");
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
