import { useQuery } from "@tanstack/react-query";
import {
  getAllOrder,
  getOrderById,
  getOrderForAssignShipper,
  getProductsForOrderId
} from "../../services/order";
import { getAllShipperStatusOnline } from "../../services/shipper";

const useOrderQuery = (
  action,
  id,
  page,
  isOrder,
  size,
  sortField,
  sortOrder
) => {
  const queryKey = isOrder
    ? ["PRODUCT_KEY", page]
    : id
    ? ["ORDER_KEY", id]
    : ["ORDER_KEY", page, size, sortField, sortOrder];

  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      switch (action) {
        case "GET_ALL_ORDER":
          return await getAllOrder(page, size, { sortField, sortOrder });
        case "GET_ORDER_BY_ID":
          return await getOrderById(id);
        case "GET_PRODUCTS_FOR_ORDER_ID":
          return await getProductsForOrderId(id, page);
        case "GET_ORDER_FOR_SHIPPER":
          return await getOrderForAssignShipper();
        case "GET_ALL_SHIPPER_STATUS_ONLINE":
          return await getAllShipperStatusOnline();
        default:
          return null;
      }
    },
  });
  return { data, ...rest };
};

export default useOrderQuery;
