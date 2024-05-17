import axios from "axios";
import { createContext, useEffect, useMemo, useState } from "react";
import { addCart, addOne, deleteCart, deleteOne, getCart } from "../api/Cart";
import { useUserToken } from "./UserTokenContext";
import { useAuth } from "./AuthContext";
export const CartContext = createContext();

const CartContextProvider = ({children}) => {
    const [ cart, setCart ] = useState([]);
    const { token, setToken } = useUserToken();
    const { isLoggedIn, setIsLoggedIn, login, logout } = useAuth();

    const value = useMemo(
      ()=> ({cart, setCart}),
      [cart]
    );

    useEffect(() => {
        // localStorage.setItem('cart', JSON.stringify(cart));
        // console.log(cart);
        const fetchData = async()=>{
          try {
              const response = await getCart(token);
              console.log(response)
              if(response.status === 200){
                  // return response;
                  setCart(response.data.cart);
              }
          } catch (error) {
              console.error('Error logging in:', error);
          }
      }
      isLoggedIn ? fetchData() : () =>{};      
    }, []);

    const syncCart = async()=>{
        try {
            const response = await getCart(token);
            console.log(response)
            if(response.status === 200){
                // return response;
                setCart(response.data.cart);
            }
        } catch (error) {
            // console.error('Error logging in:', error);
        }
    }

        const add = async(productId, amount) => {
            try {
                const response = await addCart(productId, amount, token);
                console.log(response)
                if(response.status === 200){
                    const response = await getCart(token);
                    console.log(response)
                    if(response.status === 200){
                        setCart(response.data.cart);
                    }
                }
            } catch (error) {
                console.error('Error logging in:', error);
            }
        } 

    const deleteCartById = async(cartId) => {
      try {
          const response = await deleteCart(cartId, token);
          console.log(response)
          if(response.status === 200){
              const response = await getCart(token);
              console.log(response)
              if(response.status === 200){
                  setCart(response.data.cart);
              }
          }
      } catch (error) {
          console.error('Error logging in:', error);
      }
    }

    const removeByOne = async(cartId) => {
      try {
          const response = await deleteOne(cartId, token);
          console.log(response)
          if(response.status === 200){
              const response = await getCart(token);
              console.log(response)
              if(response.status === 200){
                  setCart(response.data.cart);
              }
          }
      } catch (error) {
          console.error('Error logging in:', error);
      }
    }

    const addByOne = async(cartId) => {
      try {
          const response = await addOne(cartId, token);
          console.log(response)
          if(response.status === 200){
              const response = await getCart(token);
              console.log(response)
              if(response.status === 200){
                  setCart(response.data.cart);
              }
          }
      } catch (error) {
          console.error('Error logging in:', error);
      }
    }

    return(
        <CartContext.Provider value={{cart, setCart, add, syncCart, removeByOne, addByOne, deleteCartById}}>
            { children }
        </CartContext.Provider>
    )
}

export default CartContextProvider;