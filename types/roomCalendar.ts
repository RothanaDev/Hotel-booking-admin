export type RoomCalendar = {
  id: number;
  roomId: number;
  date: string; // YYYY-MM-DD
  isAvailable: boolean;
  priceOverride?: number | null;
  note?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type RoomCalendarCreate = {
  roomId: number;
  date: string;
  isAvailable?: boolean;
  priceOverride?: number | null;
  note?: string | null;
};

export type RoomCalendarUpdate = {
  date?: string;
  isAvailable?: boolean;
  priceOverride?: number | null;
  note?: string | null;
};
