import { z } from 'zod';

// Specific messages aren't really needed but included here anyway
export const PetSchema = z.object({
    id: z.number({ message: 'ID must be a number' }),
    name: z.string({ message: 'Name must be a string' }).min(1),
    status: z.enum(['available', 'pending', 'sold'], { message: 'Not a valid status'})
});

export type Pet = z.infer<typeof PetSchema>;

// Static data returned by API,
// I'd want to to manage better in the real world
export const simplePet: Pet = {
    id: Math.floor(Math.random() * 1000),
    name: 'Test Animal',
    status: 'available'
}