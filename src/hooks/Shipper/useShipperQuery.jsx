import { useQuery } from "@tanstack/react-query";
import {
  getAllOrderShipperHistory,
  getAllOrderShipping,
  getAllShipment,
} from "../../services/shipper";

const useShipperQuery = (action, id, page) => {
  const { data, ...rest } = useQuery({
    queryKey: ["SHIPPER-KEY", page, id],
    queryFn: async () => {
      switch (action) {
        case "GET_ALL_ORDER_SHIPPING":
          return await getAllOrderShipping(page, "Đang giao");
        case "GET_ALL_ORDER_PENDING":
          return await getAllOrderShipping(page, "Chờ lấy hàng");
        case "GET_ALL_SHIPMENT":
          return await getAllShipment();
        case "GET_ALL_ORDER_HISTORY":
          return await getAllOrderShipperHistory(page);
        default:
          return null;
      }
    },
  });
  return { data, ...rest };
};
export default useShipperQuery;
