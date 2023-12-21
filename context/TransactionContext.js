import { createContext, useEffect, useMemo, useState } from "react";
export const TransactionContext = createContext();

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
  


const TransactionContextProvider = ({children}) => {
    const [ transaction, setTransaction ] = useLocalStorage('transaction', []);

    const value = useMemo(
      ()=> ({transaction, setTransaction}),
      [transaction]
    );

    useEffect(() => {
        localStorage.setItem('transaction', JSON.stringify(transaction));
    }, [transaction]);

    return(
        <TransactionContext.Provider value={value}>
            { children }
        </TransactionContext.Provider>
    )
}

export default TransactionContextProvider;