import { fetchData,postData,deleteData ,putData} from './apiService'
export const addAddress = async (address) => {
    const data = await postData(`address/add`, address);
    if (data) {
        console.log('Address added successfully:', data);
    }
    return data;
};
export const fetchAddressByUser = async (id) => {
    const data = await fetchData(`address/by-user-id/${id}`);
    return data.data;
};
export const deleteAddress = async (id) => {
    
    const data = await deleteData(`address/delete/${id}`);
    if (data) {
        console.log('Address deleted successfully:', data);
    }
    return data;
};
export const updateAddress  = async (id,address) => {
    const endpoint = `address/update/${id}`;
    const data = await putData(endpoint, address);
    if (data) {
        console.log('Address updated successfully:', data);
    }
    return data;
};