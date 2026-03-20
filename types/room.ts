import { RoomType } from "./room-type";

export interface Room {
  id: string | number;
  roomType: RoomType;
  roomPrice?: number;
  status?: string;
  booked?: boolean;
  image?: string;
  photo?: string;
  roomPhotoUrl?: string;
  roomDescription?: string;
  roomTypeId?: string | number;
}