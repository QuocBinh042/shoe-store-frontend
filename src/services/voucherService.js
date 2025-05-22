import { fetchData,postData,deleteData ,putData} from './apiService'
export const fetchVoucherWithPrice = async (userId, orderValue) => {
    const data = await fetchData(`voucher/eligible?userId=${userId}&orderValue=${orderValue}`);
    return data.data;
};
export const fetchVoucherById = async (id) => {
    const data = await fetchData(`voucher/by-voucher-id/${id}`);
    return data.data;
};

export const getAllVouchers = async () => {
    const data = await fetchData('voucher');
    return data;
};

export const createBatchVouchers = async (voucherList) => {
    const data = await postData('voucher/create-batch', voucherList);
    return data;
};

export const deleteVoucher = async (id) => {
    const data = await deleteData(`voucher/delete/${id}`);
    return data;
};