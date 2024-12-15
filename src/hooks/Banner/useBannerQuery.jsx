import { useQuery } from "@tanstack/react-query";
import { getAllBanner, getBannerById } from "../../services/banner";

const useBannerQuery = (action, id) => {
  const queryKey = id
    ? ["BANNER_KEY", id]
    : ["BANNER_KEY"];
  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      switch (action) {
        case "GET_ALL_BANNER":
          return await getAllBanner();
        case "GET_BANNER_BY_ID":
          return await getBannerById(id);
        default:
          return null;
      }
    },
  });
  return { data, ...rest };
};
export default useBannerQuery;
