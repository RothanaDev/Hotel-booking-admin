import { z } from "zod";

export interface RoomTypeFormValues {
    typeName: string;
    description: string;
    price: number;
}

export const roomTypeSchema: z.ZodType<RoomTypeFormValues> = z.object({
    typeName: z.string().min(1, "Type name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.coerce.number().positive("Price must be greater than 0"),
});
