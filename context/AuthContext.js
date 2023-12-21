import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import Auth, { Register } from '../api/Auth';
import { Logout } from '../api/Auth';

const AuthContext = createContext();

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });
  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue];
}

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('isLoggedIn', false);

  const value = useMemo(
      ()=> ({isLoggedIn, setIsLoggedIn}),
      [isLoggedIn]
    );

    useEffect(() => {
        localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    }, [isLoggedIn]);

  const login = async (email, password) => {
    try {
      const response = await Auth(email, password);
      if(response.data.status === "success"){
        return response;
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const logout = async (token) => {
    setIsLoggedIn(false);
    const res = await Logout(token);
    return res;
  };

  const register = async(name, email, password) => {
    try {
      const response = await Register(name, email, password);
      if(response.data.status === "success"){
        return response;
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
