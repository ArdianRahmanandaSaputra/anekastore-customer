import axios from "axios";
import Endpoint from "../data/constant";

export const getCost = async (courier, dest, weight, token) => {
    try {
        const postData = {
            courier: courier,
            dest: dest,
            weight: weight,
        };   

        const response = axios.post(Endpoint.BASE_URL + Endpoint.GETCOST, postData, {
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