import { createContext, useEffect, useMemo, useState } from "react";
import { useUserToken } from "./UserTokenContext";
import axios from "axios"
import Endpoint from "../data/constant"
export const CheckoutCartContext = createContext();

const CheckoutCartContextProvider = ({children}) => {
    const [ checkoutCart, setCheckoutCart ] = useState([]);
    const { token, setToken } = useUserToken();

    const value = useMemo(
      ()=> ({checkoutCart, setCheckoutCart}),
      [checkoutCart]
    );

    const syncCheckoutCart = async() => {
        try {
            const postData = {
                cart: checkoutCart
            };   
    
            const response = await axios.post(Endpoint.BASE_URL + Endpoint.SYNCCART, postData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            console.log('sync checkout', response);
            // return response;
            // setCheckoutCart(response.data.cart);
            return response.data.cart;
        } catch (error) {
            console.error('Error add to cart in:', error);
        }
    }

    return(
        <CheckoutCartContext.Provider value={{checkoutCart, setCheckoutCart, syncCheckoutCart}}>
            { children }
        </CheckoutCartContext.Provider>
    )
}

export default CheckoutCartContextProvider;