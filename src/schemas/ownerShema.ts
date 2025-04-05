import z from 'zod';
import { nameValidation } from './signUpSchema';

export const ownerSchema = z.object({
        name: nameValidation,
        email: z.string().email({message: 'Invalid email address'}),
        password: z.string().min(6, {message: 'Password must be at least 6 characters long'}),
        productsCategory: z.string().min(3, {message: 'Products category must be at least 3 characters long'}),
})