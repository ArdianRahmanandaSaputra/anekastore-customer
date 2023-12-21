import axios from "axios";
import Endpoint from "../data/constant";

const Auth = async (email, password) => {
    try {
        const response = await axios.post(Endpoint.BASE_URL + Endpoint.LOGIN, { 
          email: email,
          password: password,
        });
        return response;
    } catch (error) {
        console.error('Error logging in:', error);
    }
}

export const Logout = async (token) => {
    try {
        const response = await axios.post(Endpoint.BASE_URL + Endpoint.LOGOUT, null, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error) {
        console.error('Error logging in:', error);
    }
}

export const Register = async (name, email, password) => {
    try {
        const response = await axios.post(Endpoint.BASE_URL + Endpoint.REGISTER,{
            name: name,
            email: email,
            password: password,
        });
        return response;
    } catch (error) {
        console.error('Error logging in:', error);
    }
}

export default Auth 