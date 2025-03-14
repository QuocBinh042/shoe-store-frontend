import { fetchData,postData,deleteData ,putData} from './apiService'
export const fetchReviewByProduct = async (id) => {
    try {
        const data = await fetchData(`review/by-product-id/${id}`);
        console.log(data)
        return data.data;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return null;
    }
};