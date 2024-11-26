import { useQuery } from "@tanstack/react-query";
import { getAllOrderShipping, getAllShipment } from "../../services/shipper";

const useShipperQuery = (action, id) => {
  const { data, ...rest } = useQuery({
    queryKey: ["SHIPPER-KEY", id],
    queryFn: async () => {
      switch (action) {
        case "GET_ALL_ORDER_SHIPPING":
          return await getAllOrderShipping();
        case "GET_ALL_SHIPMENT":
          return await getAllShipment();
        default:
          return null;
      }
    },
  });
  return { data, ...rest };
};
export default useShipperQuery;
