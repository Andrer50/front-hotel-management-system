import { useQuery } from "@tanstack/react-query";
import { getRoomsAction, getAvailableRoomsAction } from "@/core/room/actions/roomActions";

export const useGetRoomsQuery = () => {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: getRoomsAction,
  });
};

export const useGetAvailableRoomsQuery = () => {
  return useQuery({
    queryKey: ["rooms", "available"],
    queryFn: getAvailableRoomsAction,
  });
};

