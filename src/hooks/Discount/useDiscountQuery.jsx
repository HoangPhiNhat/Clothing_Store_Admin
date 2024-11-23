import { useQuery } from "@tanstack/react-query";
import {
  getAllDiscount,
  getProductsOnDiscount,
} from "../../services/discount";

const useDiscountQuery = (action, id, page) => {
  let queryKey = id ? ["DISCOUNT_KEY", id] : ["DISCOUNT_KEY", page];

  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      switch (action) {
        case "GET_ALL_DISCOUNT":
          return await getAllDiscount(page);
        case "GET_PRODUCTS_ON_DISCOUNT":
          return await getProductsOnDiscount(id, page);
        default:
          return null;
      }
    },
  });

  return { data, ...rest };
};
export default useDiscountQuery;
