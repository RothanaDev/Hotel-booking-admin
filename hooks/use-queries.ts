"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as api from "@/lib/api"
import { RoomTypeFormValues } from "@/lib/validator/room-type";
import type { Room } from "@/types/room";
import type { User } from "@/types/user";
import type { RoomType } from "@/types/room-type";
import type { RoomCalendarCreate, RoomCalendarUpdate } from "@/types/roomCalendar";
import type { BookingCreateRequest, BookingUpdateRequest } from "@/types/booking";
import type { HousekeepingTaskCreate, HousekeepingTaskUpdate } from "@/types/housekeeping";
import type { MaintenanceTicketCreate, MaintenanceTicketUpdate } from "@/types/maintenance";


export function useAllUsers() {
  const { data = [], isLoading, error } = useQuery<User[]>({
    queryKey: ["all-users"],
    queryFn: api.getAllUsers,
  });
  return { data, isLoading, error };
}

export function useRegisterUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (registrationDetails: Record<string, unknown>) => api.registerUser(registrationDetails),
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

export function useRoom(roomId: string) {
  const { data, isLoading, error } = useQuery<Room>({
    queryKey: ["room", roomId],
    queryFn: () => api.getRoomById(roomId),
    enabled: !!roomId,
  });
  return { data, isLoading, error };
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
    mutationFn: (formData: FormData) => api.addRoom(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-rooms"] });
    },
    onError: () => {

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
    onError: () => {

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
    onError: () => {
    },
  });
}


export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingData: BookingCreateRequest) => api.createBooking(bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["all-rooms"] });
    },
    onError: (err: unknown) => {
      console.error("Booking error:", err);
    },
  });
}

export function useUpdateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, bookingData }: { id: string | number; bookingData: BookingUpdateRequest }) =>
      api.updateBooking(id, bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking"] });
    },
  });
}

export function useBooking(id: string | number) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => api.getBookingById(id),
    enabled: !!id,
  });
  return { data, isLoading, error };
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => api.deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
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

/* =======================
   SERVICE BOOKINGS
======================= */
export function useAllServiceBookings() {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["all-service-bookings"],
    queryFn: api.getAllServiceBookings,
  });
  return { data, isLoading, error };
}

export function useServiceBooking(id: string | number) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["service-booking", id],
    queryFn: () => api.getServiceBookingById(id),
    enabled: !!id,
  });
  return { data, isLoading, error };
}

export function useCreateServiceBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.createServiceBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-service-bookings"] });
    },
  });
}

export function useUpdateServiceBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Record<string, unknown> }) =>
      api.updateServiceBooking(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-service-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["service-booking"] });
    },
  });
}

export function useDeleteServiceBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => api.deleteServiceBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-service-bookings"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string | number) => api.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    },
    onError: (err: unknown) => {
      console.error("Delete user error:", err);
    },
  });
}

export function useUser(userId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => api.getUser(userId),
    enabled: !!userId,
  });
  return { data, isLoading, error };
}

export function useAllRoomTypes() {
  const { data = [], isLoading, error } = useQuery<RoomType[]>({
    queryKey: ["room-types"],
    queryFn: api.getAllRoomTypes,
  });
  return { data, isLoading, error };
}

export function useCreateRoomType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roomTypeData: RoomTypeFormValues) => api.createRoomType(roomTypeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room-types"] });
    },
  });
}

export function useUpdateRoomType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, roomTypeData }: { id: string | number; roomTypeData: RoomTypeFormValues }) =>
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

/* =======================
   SERVICES
======================= */
export function useAllServices() {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["all-services"],
    queryFn: api.getAllServices,
  });
  return { data, isLoading, error };
}

export function useService(id: string | number) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["service", id],
    queryFn: () => api.getServiceById(id),
    enabled: !!id,
  });
  return { data, isLoading, error };
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => api.createService(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-services"] });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string | number; formData: FormData }) =>
      api.updateService(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-services"] });
      queryClient.invalidateQueries({ queryKey: ["service"] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => api.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-services"] });
    },
  });
}

/* =======================
   INVENTORY
======================= */
export function useAllInventory() {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["all-inventory"],
    queryFn: api.getAllInventory,
  });
  return { data, isLoading, error };
}

export function useInventory(id: string | number) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["inventory", id],
    queryFn: () => api.getInventoryById(id),
    enabled: !!id,
  });
  return { data, isLoading, error };
}

export function useCreateInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.createInventory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-inventory"] });
    },
  });
}

export function useUpdateInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Record<string, unknown> }) =>
      api.updateInventory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-inventory"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}

export function useDeleteInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => api.deleteInventory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-inventory"] });
    },
  });
}



export function useAllRoomCalendars() {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["room-calendar", "all"],
    queryFn: api.getAllRoomCalendars,
  });
  return { data, isLoading, error };
}

export function useRoomCalendar(id: number | string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["room-calendar", id],
    queryFn: () => api.getRoomCalendarById(id),
    enabled: !!id,
  });
  return { data, isLoading, error };
}

export function useRoomCalendarByRoom(roomId: number | string) {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["room-calendar", "room", roomId],
    queryFn: () => api.getRoomCalendarByRoom(roomId),
    enabled: !!roomId,
  });
  return { data, isLoading, error };
}

export function useCreateRoomCalendar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RoomCalendarCreate) => api.createRoomCalendar(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["room-calendar"] });
      if (variables?.roomId) {
        queryClient.invalidateQueries({ queryKey: ["room-calendar", "room", variables.roomId] });
      }
    },
  });
}

export function useUpdateRoomCalendar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: RoomCalendarUpdate }) =>
      api.updateRoomCalendar(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room-calendar"] });
    },
  });
}

export function useDeleteRoomCalendar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => api.deleteRoomCalendar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room-calendar"] });
    },
  });
}

export function useHousekeepingTasks(filters?: {
  roomId?: number | string;
  assignedToId?: number | string;
  date?: string;
  status?: string;
}) {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["housekeeping-tasks", filters],
    queryFn: () => api.getAllHousekeepingTasks(filters),
  });
  return { data, isLoading, error };
}

export function useCreateHousekeepingTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: HousekeepingTaskCreate) => api.createHousekeepingTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["housekeeping-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["all-rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room"] });
    },
  });
}

export function useUpdateHousekeepingTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: HousekeepingTaskUpdate }) =>
      api.updateHousekeepingTask(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["housekeeping-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["all-rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room"] });
    },
  });
}

export function useDeleteHousekeepingTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => api.deleteHousekeepingTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["housekeeping-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["all-rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room"] });
    },
  });
}

export function useHousekeepingTask(id: number | string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["housekeeping-tasks", id],
    queryFn: () => api.getHousekeepingTaskById(id),
    enabled: !!id,
  });
  return { data, isLoading, error };
}

export function useMaintenanceTickets(filters?: {
  roomId?: number | string;
  reportedById?: number | string;
  status?: string;
}) {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["maintenance-tickets", filters],
    queryFn: () => api.getAllMaintenanceTickets(filters),
  });
  return { data, isLoading, error };
}

export function useCreateMaintenanceTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: MaintenanceTicketCreate) => api.createMaintenanceTicket(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["all-rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room"] });
    },
  });
}

export function useUpdateMaintenanceTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: MaintenanceTicketUpdate }) =>
      api.updateMaintenanceTicket(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["all-rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room"] });
    },
  });
}

export function useMaintenanceTicket(id: number | string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["maintenance-tickets", id],
    queryFn: () => api.getMaintenanceTicketById(id),
    enabled: !!id,
  });
  return { data, isLoading, error };
}

export function useDeleteMaintenanceTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => api.deleteMaintenanceTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["all-rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room"] });
    },
  });
}

export function useCreatePaypalOrder() {
  return useMutation({
    mutationFn: (bookingId: number | string) => api.createPaypalOrder(bookingId),
  });
}

export function usePayCash() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: number | string) => api.payCash(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
    },
  });
}

export function useAllPayments() {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["all-payments"],
    queryFn: api.getAllPayments,
  });
  return { data, isLoading, error };
}
