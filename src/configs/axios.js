import axios from "axios";
const instance = axios.create({
  baseURL: "http://localhost:2712/api/",
  timeout: 1000000,
  withCredentials: true,
});
export default instance;
