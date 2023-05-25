import httpClient from "../http-common";
const createOrder = () => {
    return httpClient.post('/orders');
}


export default {createOrder}