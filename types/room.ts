export interface Room {
  id: string | number;
  roomType: string | {
    id: string | number;
    typeName: string;
    description?: string;
    price?: number;
  };
  roomPrice?: number;
  status?: string;
  booked?: boolean;
  image?: string;
  photo?: string;
  roomPhotoUrl?: string;
  roomDescription?: string;
  roomTypeId?: string | number;
}