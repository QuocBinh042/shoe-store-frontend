import { fetchData, postData, putData } from './apiService';

export const addOrder = async (order) => {
    const data = await postData(`orders`, order);
    if (data) {
        console.log('Order added successfully:', data);
    }
    return data;
};

export const fetchOrderByUser = async (id) => {
    const data = await fetchData(`orders/by-user/${id}`);
    return data.data;
};

export const countOrderByUser = async (id) => {
    const data = await fetchData(`orders/users/${id}/count`);
    return data.data;
};

export const sumAmount = async (id) => {
    const data = await fetchData(`orders/users/${id}/total-cost`);
    return data.data;
};

export const getAllOrders = async () => {
    const data = await fetchData('orders');
    return data;
};

export const getTotalOrders = async () => {
    const data = await fetchData('orders/total-orders');
    return data.data;
};


export const getTotalOrdersByDay = async () => {
    const data = await fetchData('orders/total-orders/day');
    return data.data;
};

export const getTotalOrdersByMonth = async () => {
    const data = await fetchData('orders/total-orders/month');
    return data.data;
};

export const getTotalOrdersByYear = async () => {
    const data = await fetchData('orders/total-orders/year');
    return data.data;
};

export const getTotalOrderAmount = async () => {
    const data = await fetchData('orders/total-amount');
    return data.data;
};

export const getTotalOrderAmountByDay = async () => {
    const data = await fetchData('orders/total-amount/day');
    return data.data;
};

export const getTotalOrderAmountByMonth = async () => {
    const data = await fetchData('orders/total-amount/month');
    return data.data;
};

export const getTotalOrderAmountByYear = async () => {
    const data = await fetchData('orders/total-amount/year');
    return data.data;
};

export const getCompletedOrders = async () => {
    const data = await fetchData('orders/completed-orders');
    return data.data;
};

export const getCompletedOrdersByDay = async () => {
    const data = await fetchData('orders/completed-orders/day');
    return data.data;
};

export const getCompletedOrdersByMonth = async () => {
    const data = await fetchData('orders/completed-orders/month');
    return data.data;
};

export const getCompletedOrdersByYear = async () => {
    const data = await fetchData('orders/completed-orders/year');
    return data.data;
};

export const getCanceledOrders = async () => {
    const data = await fetchData('orders/canceled-orders');
    return data.data;
};

export const getCanceledOrdersByDay = async () => {
    const data = await fetchData('orders/canceled-orders/day');
    return data.data;
};

export const getCanceledOrdersByMonth = async () => {
    const data = await fetchData('orders/canceled-orders/month');
    return data.data;
};

export const getCanceledOrdersByYear = async () => {
    const data = await fetchData('orders/canceled-orders/year');
    return data.data;
};

export const searchOrders = async (query) => {
    const data = await fetchData(`orders/search?q=${query}`);
    return data.data;
};

export const getAllOrdersSorted = async (sort, page = 1, pageSize = 12) => {
    const data = await fetchData(`orders/sorted?sort=${sort}&page=${page}&pageSize=${pageSize}`);
    return data;
};

export const filterOrders = async ({
    mode,
    status,
    q,
    from,
    to,
    sort = 'newest',
    page = 1,
    pageSize = 12,
}) => {
    const params = new URLSearchParams();

    if (mode) params.append('mode', mode);
    if (status && status !== 'ALL') params.append('status', status);
    if (q) params.append('q', q);
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (sort) params.append('sort', sort);

    params.append('page', page);
    params.append('pageSize', pageSize);
    console.log(params.toString())
    const data = await fetchData(`/orders/filter?${params.toString()}`);
    return data;
};


export const getAllOrdersPaged = async (page = 1, pageSize = 12) => {
    const data = await fetchData(`orders?page=${page}&pageSize=${pageSize}`);
    return data;
};

export const getOrdersByDay = async (page = 1, pageSize = 12) => {
    const data = await fetchData(`orders/day?page=${page}&pageSize=${pageSize}`);
    return data;
};

export const getOrdersByMonth = async (page = 1, pageSize = 12) => {
    const data = await fetchData(`orders/month?page=${page}&pageSize=${pageSize}`);
    return data;
};

export const getOrdersByYear = async (page = 1, pageSize = 12) => {
    const data = await fetchData(`orders/year?page=${page}&pageSize=${pageSize}`);
    return data;
};

export const getRevenueFromPromotions = async () => {
    const data = await fetchData('orders/revenue/with-promotions');
    return data.data;
};

export const countOrdersWithPromotions = async () => {
    const data = await fetchData('orders/count/with-promotions');
    return data.data;
};

export const getOrderById = async (id) => {
    const data = await fetchData(`orders/${id}`);
    return data;
};

export const updateOrderStatus = async (id, body) => {
    const data = await putData(`orders/${id}/status`, body);
    return data;
};

export const getOrderStatusHistory = async (id) => {
    const data = await fetchData(`orders/${id}/history`);
    return data;
};
export const addOrderStatusHistory = async (orderStatusHistory) => {
    const data = await postData(`orders/history`, orderStatusHistory);
    return data;
};