import axios from "axios";
import { apiConfig } from "../../config";
import { refreshToken } from "../auth";

const axiosClient = axios.create({
    baseURL: apiConfig.baseUrl
});

// Interceptor cho các yêu cầu
axiosClient.interceptors.request.use(
    (config) => {
        // Thêm token vào headers
        const token = localStorage.getItem("user");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor cho các phản hồi
axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            // Chỉ lấy dữ liệu từ phản hồi
            return response.data;
        }
        return response;
    },
    async (error) => {
        const { response, config } = error;

        // Nếu token đã hết hạn
        if (response && response.status === 401) {
            try {
                await refreshToken();  // Gọi hàm refreshToken từ AuthApi
                return axiosClient(config);  // Thực hiện lại yêu cầu gốc
            } catch (refreshError) {
                // Nếu refreshToken cũng thất bại, chuyển hướng đến trang đăng nhập
                window.location.href = "/auth/sign-in";
                return Promise.reject(refreshError);
            }
        }

        // Nếu có lỗi server nội bộ
        if (response && response.status === 500) {
            window.location.href = "/auth/500";
        }

        // Xử lý các lỗi khác
        return Promise.reject(error);
    }
);

export default axiosClient;
