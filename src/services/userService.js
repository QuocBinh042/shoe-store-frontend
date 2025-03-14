import { fetchData,postData,deleteData ,putData} from './apiService'
export const fetchUserInfoById = async (id) => {
    const data = await fetchData(`user/by-user-id/${id}`);
    return data;
    
};
export const updateUserInfo = async (id,user) => {
    const endpoint = `user/update/${id}`;
    
    const data = await putData(endpoint, user);
    if (data) {
        console.log('User infomation updated successfully:', data);
    }
    return data;
};