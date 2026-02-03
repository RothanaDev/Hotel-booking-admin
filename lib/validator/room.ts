// lib/validator/room.ts
// import { z } from "zod";

// export const createRoomSchema = z.object({
//   roomType: z
//     .string()
//     .min(1, "Room type is required"),

//   roomPrice: z.coerce
//     .number()
//     .positive("Room price must be greater than 0"),

//   roomDescription: z
//     .string()
//     .optional(),

//   roomPhoto: z.instanceof(File, {
//     message: "Room image is required",
//   }),
// });

// export type CreateRoomFormValues = z.infer<typeof createRoomSchema>;

// lib/validator/room.ts
import { z } from "zod";

// For create form
export const createRoomSchema = z.object({
  roomType: z.string().min(1, "Room type is required"),
  roomPrice: z.coerce.number().positive("Room price must be greater than 0"),
  roomDescription: z.string().optional(),
  roomPhoto: z.instanceof(File, { message: "Room image is required" }),
});

// For update form (image optional)
export const updateRoomSchema = createRoomSchema.extend({
  roomPhoto: z
    .instanceof(File, { message: "Room image must be a file" })
    .optional(), // optional for update
});

export type CreateRoomFormValues = z.infer<typeof createRoomSchema>;
export type UpdateRoomFormValues = z.infer<typeof updateRoomSchema>;
