import { createContext, useMemo, useState, useEffect } from "react";
export const AccountContext = createContext();

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

const AccountContextProvider = ({children}) => {
    const [ account, setAccount ] = useLocalStorage('account', [
        { id: 1, name: 'User', email: 'user@mail.com', password: 'user', address: 'Jakarta', phone: '08123232785' }
    ]);

    const value = useMemo(
      ()=> ({account, setAccount}),
      [account]
    );

    useEffect(() => {
        localStorage.setItem('account', JSON.stringify(account));
    }, [account]);

    return(
        <AccountContext.Provider value={value}>
            { children }
        </AccountContext.Provider>
    )
}

export default AccountContextProvider;