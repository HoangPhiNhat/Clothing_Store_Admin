import { useQuery } from "@tanstack/react-query";
import { getAllAttribute } from "../../services/productAttribute";

const useAttributeQuery = (productId, page, pageSize, sortField, sortOrder) => {
  const queryKey = [
    "ATTRIBUTE_KEY",
    productId,
    page,
    pageSize,
    sortField,
    sortOrder,
  ];

  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        return await getAllAttribute(productId, page, pageSize, {
          sortField,
          sortOrder,
        });
      } catch (error) {
        console.error("Error in queryFn:", error);
        throw error;
      }
    },
    keepPreviousData: true,
    cacheTime: 0,
  });
  return { data, ...rest };
};

export default useAttributeQuery;
