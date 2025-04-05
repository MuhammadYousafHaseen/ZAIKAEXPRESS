import z from 'zod';

export const productSchema = z.object({
    name: z.string().min(3, {message: 'Product name must be at least 3 characters long'}),
    description: z.string().min(10, {message: 'Product description must be at least 10 characters long'}),
    price: z.number().min(0, {message: 'Product price must be greater than 0'}),
    
})