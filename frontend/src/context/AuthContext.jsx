// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [farmer, setFarmer] = useState(
    JSON.parse(localStorage.getItem("farmer")) || null
  );

  const login = (token, farmerData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("farmer", JSON.stringify(farmerData));
    setFarmer(farmerData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("farmer");
    setFarmer(null);
  };

  return (
    <AuthContext.Provider value={{ farmer, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}