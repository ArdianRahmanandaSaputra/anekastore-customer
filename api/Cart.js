import axios from "axios"
import Endpoint from "../data/constant"

export const addCart = async (productId, amount, token) => {
    try {
        const postData = {
            product_id: productId,
            amount: amount
        };   

        const response = axios.post(Endpoint.BASE_URL + Endpoint.ADDCART, postData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        return response;
    } catch (error) {
        console.error('Error add to cart in:', error);
    }
}

export const deleteCart = async(cartId, token) => {
    try{
        const postData = {
            cart_id: cartId
        };   

        const response = axios.post(Endpoint.BASE_URL + Endpoint.DELETECART, postData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        return response;
    }catch(error){
        console.error('Error delete from cart in:', error);
    }
}

export const deleteOne = async(cartId, token) => {
    try{
        const postData = {
            cart_id: cartId
        };   

        const response = axios.post(Endpoint.BASE_URL + Endpoint.DELETECARTONE, postData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        return response;
    }catch(error){
        console.error('Error delete from cart in:', error);
    }
}

export const addOne = async(cartId, token) => {
    try{
        const postData = {
            cart_id: cartId
        };   

        const response = axios.post(Endpoint.BASE_URL + Endpoint.ADDCARTONE, postData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        return response;
    }catch(error){
        console.error('Error delete from cart in:', error);
    }
}

export const updateCart = async(cartId, amount, token) => {
    try{
        const postData = {
            cart_id: cartId,
            amount: amount
        };   

        const response = axios.post(Endpoint.BASE_URL + Endpoint.UPDATECART, postData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        return response;
    }catch(error){
        console.error('Error delete from cart in:', error);
    }
}

export const getCart = async(token) => {
    try{
        const response = axios.post(Endpoint.BASE_URL + Endpoint.GETCART, null, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        return response;
    }catch(error){
        console.error('Error delete from cart in:', error);
    }
}

export const makeOrder = async(token) => {
    try{
        const postData = {
            cart_id: cartId,
            amount: amount
        }; 
        
        const response = axios.post(Endpoint.BASE_URL + Endpoint.MAKEORDER, null, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        return response;
    }catch(error){
        console.error('Error delete from cart in:', error);
    }
}