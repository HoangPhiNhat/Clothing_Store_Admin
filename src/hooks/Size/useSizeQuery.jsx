import { useQuery } from "@tanstack/react-query";
import { getAllSize, getAllSizeTrash, getSizeById } from "../../services/size";

const useSizeQuery = (action, id, page) => {
  const queryKey = id ? ["SIZE_KEY", id] : ["SIZE_KEY", page];
  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      switch (action) {
        case "GET_ALL_SIZE":
          return await getAllSize(page);
        case "GET_SIZE_BY_ID":
          return await getSizeById(id);
        case "GET_ALL_SIZE_TRASH":
          return await getAllSizeTrash(page);
        default:
          return null;
      }
    },
  });

  return { data, ...rest };
};

export default useSizeQuery;
