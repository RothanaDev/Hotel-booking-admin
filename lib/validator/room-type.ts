import { z } from "zod";

export const roomTypeSchema = z.object({
    typeName: z.string().min(1, "Type name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.coerce.number().positive("Price must be greater than 0"),
});

export type RoomTypeFormValues = z.infer<typeof roomTypeSchema>;
