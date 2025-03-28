import { fetchData, postData, deleteData, putData, patchData } from './apiService'
export const fetchUserInfoById = async (id) => {
    const data = await fetchData(`user/by-user-id/${id}`);
    return data;

};
export const updateUserInfo = async (id, user) => {
    const endpoint = `user/update/${id}`;

    const data = await putData(endpoint, user);
    if (data) {
        console.log('User infomation updated successfully:', data);
    }
    return data;
};


export const getCustomers = async () => {
    const data = await fetchData('user/customers');
    return data;
};

export const createCustomer = async (user) => {
    const data = await postData('user/customers', user);
    return data;
};

export const searchUsers = async (keyword) => {
    const data = await fetchData(`user/search?keyword=${keyword}`);
    return data;
};

export const getDeliveredOrdersCount = async (id) => {
    const data = await fetchData(`user/${id}/delivered-orders-count`);
    return data.data === null ? 0 : data.data;
};

export const getTotalAmountByUserId = async (id) => {
    const data = await fetchData(`user/${id}/total-amount`);
    return data.data === null ? 0 : data.data;
};

export const updateUserStatus = async (id, status) => {
    const endpoint = `user/${id}/status`;
    const data = await patchData(endpoint, status);
    return data;
};