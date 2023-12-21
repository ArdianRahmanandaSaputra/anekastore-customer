import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const UserTokenContext = createContext();

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

export const UserTokenProvider = ({ children }) => {
    const [token, setToken] = useLocalStorage('token', '');

    const value = useMemo(
        ()=> ({token, setToken}),
        [token]
      );
  
      useEffect(() => {
          localStorage.setItem('token', JSON.stringify(token));
      }, [token]);

    return(
        <UserTokenContext.Provider value={value}>
            {children}
        </UserTokenContext.Provider>
    )
}

export const useUserToken = () => {
    return useContext(UserTokenContext);
}