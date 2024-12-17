/* eslint-disable no-useless-catch */
import Author from "../services/baseApi/AuthorApi";

export const fetchDashboardData = async (timePeriod, value) => {
  try {
    const response = await Author.get("/dashboard", {
      params: {
        [timePeriod]: value, // 'week' hoặc 'month'
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

export const fetchTimeLine = async () => {
  try {
    const response = await Author.get("/dashboard/timeline");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

export const trendingProduct = async () => {
  try {
    const response = await Author.get("/dashboard/trending-products");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

export const fetchOrders = async () => {
  try {
    const response = await Author.get("/dashboard/orders");
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};