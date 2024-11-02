import { useQuery } from "@tanstack/react-query";
import {
  getAllOrder,
  getOrderById,
  getProductsForOrderId,
} from "../../services/order";

const useOrderQuery = (action, id, page, isOrder) => {
  const queryKey = isOrder
    ? ["PRODUCT_KEY", page]
    : id
    ? ["ORDER_KEY", id]
    : ["ORDER_KEY", page];
  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      switch (action) {
        case "GET_ALL_ORDER":
          return await getAllOrder(page);
        case "GET_ORDER_BY_ID":
          return await getOrderById(id);
        case "GET_PRODUCTS_FOR_ORDER_ID":
          return await getProductsForOrderId(id);
        default:
          return null;
      }
    },
  });
  return { data, ...rest };
};

export default useOrderQuery;
