import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
  withCredentials: true,
});

// Interceptor cho các phản hồi
axiosClient.interceptors.response.use(
  (response) => {
    // Chỉ lấy dữ liệu từ phản hồi
    return response.data || response;
  },
  (error) => {
    const { response } = error;
    console.log(error);
    if (response && response.status == 500) {
      window.location.href = "/page500";
    }
  }
);

export default axiosClient;
