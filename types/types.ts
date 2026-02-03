

export interface Booking {
  id: number
  userId?: number
  roomId?: number
  checkInDate: string
  checkOutDate: string
  numOfAdults: number
  numOfChildren: number
  totalNumOfGuest: number
  bookingConfirmationCode: string
}
