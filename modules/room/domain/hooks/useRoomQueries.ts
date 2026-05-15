import { useQuery } from "@tanstack/react-query";
import { getRoomsAction } from "@/core/room/actions/roomActions";

export const useGetRoomsQuery = () => {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: getRoomsAction,
  });
};
