import { createContext, useEffect, useMemo, useState } from "react";
export const CheckoutCartContext = createContext();

const CheckoutCartContextProvider = ({children}) => {
    const [ checkoutCart, setCheckoutCart ] = useState([]);

    const value = useMemo(
      ()=> ({checkoutCart, setCheckoutCart}),
      [checkoutCart]
    );

    return(
        <CheckoutCartContext.Provider value={{checkoutCart, setCheckoutCart}}>
            { children }
        </CheckoutCartContext.Provider>
    )
}

export default CheckoutCartContextProvider;