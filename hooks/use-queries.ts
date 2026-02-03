"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as api from "@/lib/api"
import type { Room } from "@/types/room";
import { addRoom } from "@/lib/api";


export function useAllUsers() {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["all-users"],
    queryFn: api.getAllUsers,
  });
  return { data, isLoading, error };
}

export function useRegisterUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (registrationDetails: any) => api.registerUser(registrationDetails),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    },
  });
}
export function useAllRooms() {
  const { data = [] as Room[], isLoading, error } = useQuery<Room[]>({
    queryKey: ["all-rooms"],
    queryFn: api.getAllRooms,
  })
  return { data, isLoading, error }
}

export function useAllBookings() {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["all-bookings"],
    queryFn: api.getAllBookings,
  });

  return { data, isLoading, error };
}

export function useAddRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => addRoom(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-rooms"] });
    },
    onError: (err: unknown) => {

    },
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: string) => api.deleteRoom(roomId),
    onSuccess: () => {
      // Refresh rooms table
      queryClient.invalidateQueries({ queryKey: ["all-rooms"] });
    },
    onError: (err: unknown) => {

    },
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, formData }: { roomId: string; formData: FormData }) =>
      api.updateRoom(roomId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-rooms"] });
    },
    onError: (err: unknown) => {
    },
  });
}

export function useBookRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, userId, ...bookingData }: { roomId: string; userId: string;[key: string]: any }) =>
      api.bookRoom({ roomId, userId, ...bookingData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["all-rooms"] });
    },
    onError: (err: unknown) => {
      console.error("Booking error:", err);
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => api.cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["all-rooms"] });
    },
    onError: (err: unknown) => {
      console.error("Cancel error:", err);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => api.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    },
    onError: (err: unknown) => {
      console.error("Delete user error:", err);
    },
  });
}

export function useAllRoomTypes() {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["room-types"],
    queryFn: api.getAllRoomTypes,
  });
  return { data, isLoading, error };
}

export function useCreateRoomType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roomTypeData: any) => api.createRoomType(roomTypeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room-types"] });
    },
  });
}

export function useUpdateRoomType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, roomTypeData }: { id: string | number; roomTypeData: any }) =>
      api.updateRoomType(id, roomTypeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room-types"] });
    },
  });
}

export function useDeleteRoomType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => api.deleteRoomType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room-types"] });
    },
  });
}



