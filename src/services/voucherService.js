import { fetchData,postData,deleteData ,putData} from './apiService'
export const fetchVoucherWithPrice = async (value) => {
    const data = await fetchData(`voucher/eligible?orderValue=${value}`);
    return data.data;
};
export const fetchVoucherById = async (id) => {
    const data = await fetchData(`voucher/by-voucher-id/${id}`);
    return data.data;
};