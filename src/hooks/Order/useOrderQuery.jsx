import { useQuery } from "@tanstack/react-query";
import { getAllOrder, getOrderById } from "../../services/order";

const useOrderQuery = (action, id, page) => {
  const queryKey = id ? ["ORDER_KEY", id] : ["ORDER_KEY", page];
  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      switch (action) {
        case "GET_ALL_ORDER":
          return await getAllOrder(page);
        case "GET_ORDER_BY_ID":
          return await getOrderById(id);
        default:
          return null;
      }
    },
  });
  return { data, ...rest };
};

export default useOrderQuery;