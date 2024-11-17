import { useQuery } from "@tanstack/react-query";
import { getAllSize, getAllSizeTrash, getSizeById } from "../../services/size";

const useSizeQuery = (action, id) => {
  const queryKey = id ? ["SIZE_KEY", id] : ["SIZE_KEY"];
  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      switch (action) {
        case "GET_ALL_SIZE":
          return await getAllSize();
        case "GET_SIZE_BY_ID":
          return await getSizeById(id);
        case "GET_ALL_SIZE_TRASH":
          return await getAllSizeTrash();
        default:
          return null;
      }
    },
  });

  return { data, ...rest };
};

export default useSizeQuery;
