import { fetchData, postData, putData,deleteData } from './apiService'
export const addCart = async (cart) => {
    const data = await postData(`cart/add`, cart);
    return data;
};