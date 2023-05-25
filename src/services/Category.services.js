import axios from "axios";
import httpClient from "../http-common";
const getAll = () => {
    return httpClient.get('/category/getall');
}

const create = (data) => {
    console.log('check data', data);
    return axios.post('/category');
}


export default { getAll, create }