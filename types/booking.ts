import { User } from "./user";
import { Room } from "./room";

export interface Booking {
    id: number;
    userResponse: User;
    roomResponse: Room;
    checkin: string;
    checkout: string;
    numOfAdults: number;
    numOfChildren: number;
    totalNumOfGuest: number;
    amount: number;
    status: string;
    createdAt: string;
}

export interface ServiceItemRequest {
    serviceId: number;
    quantity: number;
}

export interface BookingCreateRequest {
    userId: number;
    roomId: number;
    checkin: string;
    checkout: string;
    numOfAdults: number;
    numOfChildren: number;
    services: ServiceItemRequest[];
}


export interface BookingUpdateRequest {
    checkin: string;
    checkout: string;
    numOfAdults: number;
    numOfChildren: number;
    status: string;
}

export interface ServiceBooking {
    id: number;
    bookingId: number;
    serviceId: number;
    quantity: number;
}
