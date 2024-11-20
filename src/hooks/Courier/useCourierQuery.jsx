import { useQuery } from "@tanstack/react-query";
import { getAllCourier, getCourierById } from "../../services/courier";

const useCourierQuery = (action, id, page) => {
  let queryKey = page ? ["COURIER_KEY", page] : ["COURIER_KEY", id];

  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      switch (action) {
        case "GET_ALL_COURIER":
          return await getAllCourier(page);
        case "GET_COURIER_BY_ID":
          return await getCourierById(id);
        default:
          return null;
      }
    },
    keepPreviousData: true,
    cacheTime: 0,
  });
  return { data, ...rest };
};

export default useCourierQuery;
