import axios from "axios";
import Page500 from "../../components/base/Result/Page500";

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
    console.log(error);
    return <Page500 />;
  }
);

export default axiosClient;
