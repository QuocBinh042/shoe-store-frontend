import { fetchData,postData,deleteData ,putData} from './apiService'
export const fetchReviewByProduct = async (id) => {
    try {
        const data = await fetchData(`review/by-product-id/${id}`);
        return data.data;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return null;
    }
};
export const fetchReviewByOrderDetail = async (id) => {
    try {
        const data = await fetchData(`review/by-order-detail/${id}`);
        return data.data;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return null;
    }
};
export const addReview = async (review) => {
    const data = await postData(`review/add`, review);
    if (data) {
        console.log('Review added successfully:', data);
    }
    return data;
};