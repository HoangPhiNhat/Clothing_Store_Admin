import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createColor, removeColor, updateColor } from "../../services/color";

const useColorMutation = ({ action, onSuccess, onError }) => {
  const queryClient = useQueryClient();
  const { mutate, ...rest } = useMutation({
    mutationFn: async (color) => {
      switch (action) {
        case "CREATE":
          return await createColor(color);
        case "DELETE":
          return await removeColor(color);
        case "UPDATE":
          return await updateColor(color);
        default:
          return null;
      }
    },
    onSuccess: (data, variables) => {
      console.log(data);
      console.log(variables);
      
      onSuccess && onSuccess(data);
      queryClient.invalidateQueries({
        queryKey: ["COLOR_KEY"],
      });
    },
    onError: (error) => {
      onError && onError(error);
      console.log(error);
    },
  });

  return { mutate, ...rest };
};

export default useColorMutation;
