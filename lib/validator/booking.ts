import { z } from "zod";

export const createBookingSchema = z.object({
    userId: z.union([z.string(), z.number()]).transform(val => val.toString()),
    roomId: z.string().min(1, "Room is required"),
    checkInDate: z.date({ message: "Check-in date is required" }),
    checkOutDate: z.date({ message: "Check-out date is required" }),
    numOfAdults: z.coerce.number().min(1, "At least 1 adult is required"),
    numOfChildren: z.coerce.number().min(0, "Cannot be negative").default(0),
}).refine((data) => data.checkOutDate > data.checkInDate, {
    message: "Check-out date must be after check-in date",
    path: ["checkOutDate"],
});

export type CreateBookingFormValues = z.infer<typeof createBookingSchema>;
