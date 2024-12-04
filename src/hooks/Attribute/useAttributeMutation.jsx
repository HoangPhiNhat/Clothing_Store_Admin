import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAttribute,
  removeAttribute,
  updateAttribute,
} from "../../services/productAttribute";

const useAttributeMutation = ({ action, onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: async (params) => {
      console.log(params);
      
      switch (action) {
        case "CREATE":
          return await createAttribute(params.productId, params.attributes);
        case "UPDATE":
          return await updateAttribute(
            params.productId,
            params.attributeId,
            params.attribute
          );
        case "DELETE":
          return await removeAttribute(params.productId, params.attributeId);
        default:
          return null;
      }
    },
    onSuccess: (data, variables) => {
      onSuccess && onSuccess(data);
      queryClient.invalidateQueries({
        queryKey: ["ATTRIBUTE_KEY", variables.productId],
      });
    },
    onError: (error) => {
      onError && onError(error);
      console.log(error);
    },
  });

  return { mutate, ...rest };
};

export default useAttributeMutation;
