import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleStatusUser } from "../../services/user";

const useUserMutation = ({ action, onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: async (user) => {
      console.log(user);

      switch (action) {
        case "TOGGLE":
          return await toggleStatusUser(user);
        default:
          return null;
      }
    },
    onSuccess: (success) => {
      onSuccess && onSuccess(success);
      queryClient.invalidateQueries({
        queryKey: ["USER_KEY"],
      });
    },
    onError: (error) => {
      onError && onError(error);
      console.log(error);
    },
  });

  return { mutate, ...rest };
};

export default useUserMutation;
