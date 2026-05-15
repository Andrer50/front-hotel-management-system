import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  createRoomAction, 
  updateRoomAction, 
  deleteRoomAction 
} from "@/core/room/actions/roomActions";
import { CreateRoomRequest, UpdateRoomRequest, Room } from "@/core/room/interfaces";

export const useCreateRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoomRequest) => createRoomAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
};

export const useUpdateRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRoomRequest) => updateRoomAction(data),
    onSuccess: (updatedRoom) => {
      queryClient.setQueryData(["rooms"], (oldRooms: Room[] | undefined) => {
        if (!oldRooms) return [updatedRoom];
        return oldRooms.map((room) =>
          room.id === updatedRoom.id ? updatedRoom : room
        );
      });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
};

export const useDeleteRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteRoomAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
};
