// src/lib/api.ts
import axios, { AxiosError } from "axios";
import type { AuthUser } from "@/types/auth";
import type { Room } from "@/types/room";
import type {
  HousekeepingTask,
  HousekeepingTaskCreate,
  HousekeepingTaskUpdate,
} from "@/types/housekeeping";
import type {
  MaintenanceTicket,
  MaintenanceTicketCreate,
  MaintenanceTicketUpdate,
} from "@/types/maintenance";
import type {
  RoomCalendar,
  RoomCalendarCreate,
  RoomCalendarUpdate,
} from "@/types/roomCalendar";
import type { PaypalCreateOrderResponse, PaypalCaptureResponse } from "@/types/paypal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://hotel-booking-backend-uder.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
});


let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

async function refreshSession(): Promise<void> {
  await api.post("/api/v1/auth/refresh-token");
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    const status = error.response?.status;

    if (!originalRequest) return Promise.reject(error);

    const url: string = originalRequest.url || "";
    const isAuthEndpoint =
      url.includes("/api/v1/auth/login") ||
      url.includes("/api/v1/auth/register") ||
      url.includes("/api/v1/auth/refresh-token") ||
      url.includes("/api/v1/auth/logout");

    const isLoginPage = typeof window !== "undefined" && window.location.pathname === "/login";

    if (status === 401 && !originalRequest._retry && !isAuthEndpoint && !isLoginPage) {
      originalRequest._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = refreshSession().then(() => {
            console.log("✅ Session refreshed successfully");
          }).finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });
        }

        if (refreshPromise) await refreshPromise;
        return api(originalRequest);
      } catch (refreshErr) {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

/* =======================
   AUTH
 ======================= */

export async function loginUser(loginDetails: { email: string; password: string }) {
  const res = await api.post("/api/v1/auth/login", loginDetails, {
    validateStatus: (s) => s < 500,
  });

  if (res.status === 404) throw new Error("User not found");
  if (res.status === 401) throw new Error("Invalid credentials");
  if (res.status >= 400) throw new Error(res.data?.message || "Login failed");

  return res.data;
}

export async function registerUser(registrationDetails: any) {
  const res = await api.post("/api/v1/auth/register", registrationDetails, {
    validateStatus: (s) => s < 500,
  });
  if (res.status >= 400) throw new Error(res.data?.message || "Register failed");
  return res.data;
}

export async function refreshTokenUser() {
  const { data } = await api.post("/api/v1/auth/refresh-token");
  return data;
}

export async function logoutUser() {
  const { data } = await api.post("/api/v1/auth/logout");
  return data;
}

export async function getMe() {
  try {
    const res = await api.get("/api/v1/auth/me");
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      return null;
    }
    throw error; 
  }
}

/* =======================
   USERS
======================= */

export async function getAllUsers() {
  const { data } = await api.get("/api/v1/auth/all");
  return data;
}

export async function getUser(userId: string): Promise<AuthUser> {
  const { data } = await api.get(`/api/v1/auth/${userId}`);
  return data;
}

export async function deleteUser(userId: string) {
  const { data } = await api.delete(`/api/v1/users/delete/${userId}`);
  return data;
}

/* =======================
   ROOMS
======================= */

export async function addRoom(formData: FormData) {
  const { data } = await api.post("/api/v1/rooms/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getAllRooms() {
  try {
    const { data } = await api.get("/api/v1/rooms");
    return Array.isArray(data) ? data : (data.roomList || data.data || []);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return [];
  }
}

export async function getRoomById(roomId: string): Promise<Room> {
  const { data } = await api.get(`/api/v1/rooms/${roomId}`);
  return data.room || data.roomData || data.data || data;
}

export async function deleteRoom(roomId: string) {
  const { data } = await api.delete(`/api/v1/rooms/${roomId}`);
  return data;
}

export async function updateRoom(roomId: string, formData: FormData) {
  const { data } = await api.put(`/api/v1/rooms/${roomId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/* =======================
   ROOM TYPES
======================= */

export async function getAllRoomTypes() {
  try {
    const { data } = await api.get("/api/v1/roomTypes");
    return data;
  } catch (error) {
    console.error("Error fetching room types:", error);
    return [];
  }
}

export async function createRoomType(roomTypeData: any) {
  const { data } = await api.post("/api/v1/roomTypes", roomTypeData);
  return data;
}

export async function updateRoomType(id: string | number, roomTypeData: any) {
  const { data } = await api.put(`/api/v1/roomTypes/${id}`, roomTypeData);
  return data;
}

export async function deleteRoomType(id: string | number) {
  const { data } = await api.delete(`/api/v1/roomTypes/${id}`);
  return data;
}

/* =======================
   BOOKINGS
======================= */

export async function createBooking(booking: any) {
  const { data } = await api.post("/api/v1/bookings/create", booking);
  return data;
}

export async function updateBooking(id: string | number, bookingData: any) {
  const { data } = await api.put(`/api/v1/bookings/${id}`, bookingData);
  return data;
}

export async function getAllBookings() {
  try {
    const { data } = await api.get("/api/v1/bookings");
    return Array.isArray(data) ? data : (data.bookingList || data.data || []);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}

export async function getBookingById(id: string | number) {
  const { data } = await api.get(`/api/v1/bookings/${id}`);
  return data;
}

export async function deleteBooking(id: string | number) {
  const { data } = await api.delete(`/api/v1/bookings/${id}`);
  return data;
}

export async function getUserBookings(userId: string) {
  const { data } = await api.get(`/api/v1/users/get-user-bookings/${userId}`);
  return data;
}

export async function getBookingByConfirmationCode(code: string) {
  const { data } = await api.get(`/api/v1/bookings/get-by-confirmation-code/${code}`);
  return data;
}

export async function cancelBooking(bookingId: string) {
  try {
    const { data } = await api.get(`/api/v1/bookings/cancel/${bookingId}`);
    return data;
  } catch (error: any) {
    console.error("Cancel booking error:", error.response?.data);
    throw error;
  }
}

/* =======================
   SERVICE BOOKINGS
======================= */

export async function getAllServiceBookings() {
  try {
    const { data } = await api.get("/api/v1/booking_services/findAll");
    return data;
  } catch (error) {
    console.error("Error fetching service bookings:", error);
    return [];
  }
}

export async function getServiceBookingById(id: string | number) {
  const { data } = await api.get(`/api/v1/booking_services/findById/${id}`);
  return data;
}

export async function createServiceBooking(payload: any) {
  const { data } = await api.post("/api/v1/booking_services/create", payload);
  return data;
}

export async function updateServiceBooking(id: string | number, payload: any) {
  const { data } = await api.put(`/api/v1/booking_services/update/${id}`, payload);
  return data;
}

export async function deleteServiceBooking(id: string | number) {
  const { data } = await api.delete(`/api/v1/booking_services/delete/${id}`);
  return data;
}

/* =======================
   SERVICES
======================= */

export async function getAllServices() {
  try {
    const { data } = await api.get("/api/v1/services");
    return data;
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

export async function getServiceById(id: string | number) {
  const { data } = await api.get(`/api/v1/services/${id}`);
  return data;
}

export async function createService(formData: FormData) {
  const { data } = await api.post("/api/v1/services", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateService(id: string | number, formData: FormData) {
  const { data } = await api.put(`/api/v1/services/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteService(id: string | number) {
  const { data } = await api.delete(`/api/v1/services/${id}`);
  return data;
}

/* =======================
   INVENTORY
======================= */

export async function getAllInventory() {
  try {
    const { data } = await api.get("/api/v1/inventory/findAll");
    return data;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
}

export async function getInventoryById(id: string | number) {
  const { data } = await api.get(`/api/v1/inventory/findById/${id}`);
  return data;
}

export async function createInventory(payload: any) {
  const { data } = await api.post("/api/v1/inventory/create", payload);
  return data;
}

export async function updateInventory(id: string | number, payload: any) {
  const { data } = await api.put(`/api/v1/inventory/update/${id}`, payload);
  return data;
}

export async function deleteInventory(id: string | number) {
  const { data } = await api.delete(`/api/v1/inventory/delete/${id}`);
  return data;
}

/* =======================
   ROOM CALENDAR
======================= */

export async function getAllRoomCalendars(): Promise<RoomCalendar[]> {
  const { data } = await api.get(`/api/v1/room-calendar`);
  return data;
}

export async function getRoomCalendarByRoom(roomId: number | string): Promise<RoomCalendar[]> {
  const { data } = await api.get(`/api/v1/room-calendar/room/${roomId}`);
  return data;
}

export async function getRoomCalendarById(id: number | string): Promise<RoomCalendar> {
  const { data } = await api.get(`/api/v1/room-calendar/${id}`);
  return data;
}

export async function getRoomCalendarByRoomAndDate(roomId: number | string, date: string): Promise<RoomCalendar> {
  const { data } = await api.get(`/api/v1/room-calendar/room/${roomId}/date/${date}`);
  return data;
}

export async function getRoomCalendarByRoomRange(roomId: number | string, start: string, end: string): Promise<RoomCalendar[]> {
  const { data } = await api.get(`/api/v1/room-calendar/room/${roomId}/range`, {
    params: { start, end },
  });
  return data;
}

export async function createRoomCalendar(payload: RoomCalendarCreate): Promise<RoomCalendar> {
  const { data } = await api.post(`/api/v1/room-calendar`, payload);
  return data;
}

export async function updateRoomCalendar(id: number | string, payload: RoomCalendarUpdate): Promise<RoomCalendar> {
  const { data } = await api.put(`/api/v1/room-calendar/${id}`, payload);
  return data;
}

export async function deleteRoomCalendar(id: number | string) {
  const { data } = await api.delete(`/api/v1/room-calendar/${id}`);
  return data;
}

/* =======================
   HOUSEKEEPING TASKS
======================= */

export async function getAllHousekeepingTasks(params?: {
  roomId?: number | string;
  assignedToId?: number | string;
  date?: string;
  status?: string;
}): Promise<HousekeepingTask[]> {
  const { data } = await api.get(`/api/v1/housekeeping-tasks`, { params });
  return data;
}

export async function getHousekeepingTaskById(id: number | string): Promise<HousekeepingTask> {
  const { data } = await api.get(`/api/v1/housekeeping-tasks/${id}`);
  return data;
}

export async function createHousekeepingTask(payload: HousekeepingTaskCreate): Promise<HousekeepingTask> {
  const { data } = await api.post(`/api/v1/housekeeping-tasks`, payload);
  return data;
}

export async function updateHousekeepingTask(id: number | string, payload: HousekeepingTaskUpdate): Promise<HousekeepingTask> {
  const { data } = await api.put(`/api/v1/housekeeping-tasks/${id}`, payload);
  return data;
}

export async function deleteHousekeepingTask(id: number | string) {
  const { data } = await api.delete(`/api/v1/housekeeping-tasks/${id}`);
  return data;
}

/* =======================
   MAINTENANCE TICKETS
======================= */

export async function getAllMaintenanceTickets(params?: {
  roomId?: number | string;
  reportedById?: number | string;
  status?: string;
}): Promise<MaintenanceTicket[]> {
  const { data } = await api.get(`/api/v1/maintenance-tickets`, { params });
  return data;
}

export async function getMaintenanceTicketById(id: number | string): Promise<MaintenanceTicket> {
  const { data } = await api.get(`/api/v1/maintenance-tickets/${id}`);
  return data;
}

export async function createMaintenanceTicket(payload: MaintenanceTicketCreate): Promise<MaintenanceTicket> {
  const { data } = await api.post(`/api/v1/maintenance-tickets`, payload);
  return data;
}

export async function updateMaintenanceTicket(id: number | string, payload: MaintenanceTicketUpdate): Promise<MaintenanceTicket> {
  const { data } = await api.put(`/api/v1/maintenance-tickets/${id}`, payload);
  return data;
}

export async function deleteMaintenanceTicket(id: number | string) {
  const { data } = await api.delete(`/api/v1/maintenance-tickets/${id}`);
  return data;
}
/* =======================
   PAYPAL PAYMENTS
======================= */


export async function createPaypalOrder(bookingId: number | string): Promise<PaypalCreateOrderResponse> {
  const { data } = await api.post(`/api/v1/payments/paypal/create/${bookingId}`);
  return data;
}

export async function capturePaypalOrder(orderId: string): Promise<PaypalCaptureResponse> {
  const { data } = await api.post(`/api/v1/payments/paypal/capture`, { orderId });
  return data;
}

export async function payCash(bookingId: number | string) {
  const { data } = await api.post(`/api/v1/payments/paypal/cash/${bookingId}`);
  return data;
}

export async function getAllPayments() {
  const { data } = await api.get("/api/v1/payments/paypal/all");
  return data;
}

export default api;