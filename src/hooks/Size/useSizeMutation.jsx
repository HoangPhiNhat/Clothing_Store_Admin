import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSize, removeSize, updateSize } from "../../services/size";

const useSizeMutation = ({ action, onSuccess, onError }) => {
  const queryClient = useQueryClient();
  const { mutate, ...rest } = useMutation({
    mutationFn: async (size) => {
      switch (action) {
        case "CREATE":
          return await createSize(size);
        case "DELETE":
          return await removeSize(size);
        case "UPDATE":
          return await updateSize(size);
        default:
          return null;
      }
    },
    onSuccess: (data, variables) => {
      onSuccess && onSuccess(data);
      queryClient.invalidateQueries({
        queryKey: ["SIZE_KEY"],
      });
    },
    onError: (error) => {
      onError && onError(error);
      console.log(error);
    },
  });

  return { mutate, ...rest };
};

export default useSizeMutation;
