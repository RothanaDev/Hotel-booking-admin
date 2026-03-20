import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// For create form
export const createRoomSchema = z.object({
  roomTypeId: z.string().min(1, "Room type is required"),
  status: z.string().min(1, "Status is required"),
  image: z
    .any()
    .refine((file) => file instanceof File, "Room image is required")
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, "Max file size is 5MB")
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    ),
});

// For update form (image optional)
export const updateRoomSchema = createRoomSchema.extend({
  image: z
    .any()
    .refine((file) => !file || file instanceof File, "Invalid file format")
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, "Max file size is 5MB")
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    )
    .optional(),
});

export interface CreateRoomFormValues {
  roomTypeId: string;
  status: string;
  image: any;
}

export interface UpdateRoomFormValues {
  roomTypeId: string;
  status: string;
  image?: any;
}
