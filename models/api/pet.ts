import { z } from 'zod';

// Category schema based on OpenAPI contract
export const CategorySchema = z.object({
    id: z.number().optional(),
    name: z.string().optional()
});

// Tag schema based on OpenAPI contract
export const TagSchema = z.object({
    id: z.number().optional(),
    name: z.string().optional()
});

// Pet schema matching OpenAPI 3.0.4 contract
export const PetSchema = z.object({
    id: z.number({ message: 'ID must be a number' }).optional(),
    name: z.string({ message: 'Name must be a string' }).min(1, { message: 'Name is required and must not be empty' }),
    category: CategorySchema.optional(),
    photoUrls: z.array(z.string(), { message: 'photoUrls must be an array of strings' }),
    tags: z.array(TagSchema).optional(),
    status: z.enum(['available', 'pending', 'sold'], { message: 'Status must be available, pending, or sold' }).optional()
});

export type Category = z.infer<typeof CategorySchema>;
export type Tag = z.infer<typeof TagSchema>;
export type Pet = z.infer<typeof PetSchema>;

// Static data returned by API,
// Updated to match the full OpenAPI contract with required photoUrls field
export const simplePet: Pet = {
    id: Math.floor(Math.random() * 1000),
    name: 'Test Animal',
    photoUrls: ['https://example.com/photo.jpg'],
    status: 'available'
}