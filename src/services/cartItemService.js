import { fetchData, postData, putData,deleteData } from './apiService'
export const fetchCartItemByCartId = async (page=1,pageSize=3) => {
    const data = await fetchData(`cart?page=${page}&pageSize=${pageSize}`);
    return data.data
};
export const addCartItem = async (cartItem) => {
    console.log(cartItem)
    const data = await postData(`cart/item/add`, cartItem);
    return data;
};
export const updateCartItem = async (id, quantity) => {
    const endpoint = `cart/item/update-quantity/${id}/${quantity}`;
    const data = await putData(endpoint);
    if (data) {
        console.log('Cart item updated successfully:', data);
    }
    return data;
};
export const deleteCartItem = async (id) => {
    const endpoint = `cart/item/delete/${id}`;
    const data = await deleteData(endpoint);
    return data;
};