import { useQuery } from "@tanstack/react-query";
import { getShipmentByCourierId } from "../../services/shipment";

const useShipmentQuery = (action, id, page) => {
  let queryKey = id ? ["SHIPMENT_KEY", id] : ["SHIPMENT_KEY", page];

  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      switch (action) {
        case "GET_SHIPMENT_BY_COURIER_ID":
          return await getShipmentByCourierId(id,page);
        default:
          return null;
      }
    },
  });
  return { data, ...rest };
};
export default useShipmentQuery;
