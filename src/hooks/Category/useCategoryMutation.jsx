import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  create,
  remove,
  update,
} from "../../services/category";

const useCategoryMutation = ({ action, onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: async (category) => {
      switch (action) {
        case "CREATE":
          return await create(category);
        case "DELETE":
          return await remove(category);
        case "UPDATE":
          return await update(category);
        default:
          return null;
      }
    },
    onSuccess: () => {
      onSuccess && onSuccess();
      queryClient.invalidateQueries({
        queryKey: ["CATEGORY_KEY"],
      });
    },
    onError: (error) => {
      onError && onError(error);
      console.log(error);
    },
  });

  return { mutate, ...rest };
};

export default useCategoryMutation;
