import { useQuery } from "@tanstack/react-query";
import {
  getAllColor,
  getAllColorTrash,
  getColorById,
} from "../../services/color";

const useColorQuery = (action, id, page) => {
  const queryKey = id ? ["COLOR_KEY", id] : ["COLOR_KEY", page];
  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      switch (action) {
        case "GET_ALL_COLOR":
          return await getAllColor(page);
        case "GET_COLOR_BY_ID":
          return await getColorById(id);
        case "GET_ALL_COLOR_TRASH":
          return await getAllColorTrash(page);
        default:
          return null;
      }
    },
  });
  return { data, ...rest };
};

export default useColorQuery;
