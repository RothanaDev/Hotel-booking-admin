import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const createServiceSchema = z.object({
    serviceName: z.string().min(1, "Service name is required"),
    description: z.string().optional(),
    price: z.coerce.number().positive("Price must be greater than 0"),
    category: z.string().min(1, "Category is required"),
    image: z
        .any()
        .refine((file) => file instanceof File, "Service image is required")
        .refine((file) => !file || file.size <= MAX_FILE_SIZE, "Max file size is 5MB")
        .refine(
            (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported"
        ),
});

export const updateServiceSchema = createServiceSchema.extend({
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

export interface CreateServiceFormValues {
    serviceName: string;
    description?: string;
    price: number;
    category: string;
    image: File;
}

export interface UpdateServiceFormValues {
    serviceName: string;
    description?: string;
    price: number;
    category: string;
    image?: File;
}
