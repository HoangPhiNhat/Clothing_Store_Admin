import { useQuery } from "@tanstack/react-query";
import { getAllAttribute } from "../../services/productAttribute";

const useCourierQuery = (productId, page, pageSize) => {
  const queryKey = ["ATTRIBUTE_KEY", productId, page, pageSize];

  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
     try {
       return await getAllAttribute(productId, page, pageSize);
     } catch (error) {
       console.error("Error in queryFn:", error);
       throw error;
     }
    },
    keepPreviousData: true,
    cacheTime: 0,
  });
console.log(data);
  return { data, ...rest };
};

export default useCourierQuery;
