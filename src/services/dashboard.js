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