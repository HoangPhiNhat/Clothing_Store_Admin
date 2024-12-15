import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBanner, removeBanner, toggleStatusBanner, updateBanner } from "../../services/banner";

const useBannerMutation = ({ action, onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: async (banner) => {
      switch (action) {
        case "CREATE":
          return await createBanner(banner);
        case "DELETE":
          return await removeBanner(banner);
        case "UPDATE":
          return await updateBanner(banner);
        case "TOGGLE":
          return await toggleStatusBanner(banner);
        default:
          return null;
      }
    },
    onSuccess: () => {
      onSuccess && onSuccess();
      queryClient.invalidateQueries({
        queryKey: ["BANNER_KEY"],
      });
    },
    onError: (error) => {
      onError && onError(error);
      console.log(error);
    },
  });

  return { mutate, ...rest };
};

export default useBannerMutation;
