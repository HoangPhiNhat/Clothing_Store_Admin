import { useQuery } from "@tanstack/react-query";
import { getOrderByShipmentId } from "../../services/shipmentDetail";

const useShipmentDetailQuery = (action, id) => {
  let queryKey = ["SHIPMENT_DETAIL_KEY", id]


  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      switch (action) {
        case "GET_SHIPMENT_BY_COURIER_ID":
          return await getOrderByShipmentId(id);
        default:
          return null;
      }
    },
  });
  return { data, ...rest };
};
export default useShipmentDetailQuery;
