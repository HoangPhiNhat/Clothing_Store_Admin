import { useQuery } from "@tanstack/react-query";
import { getAllUser } from "../../services/user";

const useUserQuery = (action, id, page, size) => {
  const queryKey = id
    ? ["USER_KEY", id]
    : ["USER_KEY", page, size];
  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      switch (action) {
        case "GET_ALL_USER":
          return await getAllUser(page, size);
        // case "GET_CATEGORY_BY_ID":
        //   return await getCategoryById(id);
        default:
          return null;
      }
    },
  });
  return { data, ...rest };
};
export default useUserQuery;
