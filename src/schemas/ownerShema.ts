import z from 'zod';
import { nameValidation } from './signUpSchema';

export const ownerSchema = z.object({
        name: nameValidation,
        email: z.string().email({message: 'Invalid email address'}),
        password: z.string().min(6, {message: 'Password must be at least 6 characters long'}),
        phone: z.string().min(11, {message: 'Phone number must be at least 11 characters long'}),
        address: z.string().min(3, {message: 'Address must be at least 3 characters long'}),
        requestForApproval: z.string().optional(),
        isApprovedOwner: z.boolean().optional(),
        image: z.string().optional(),
        products: z.array(z.string()).optional(),
        productsCategory: z.string().min(3, {message: 'Products category must be at least 3 characters long'}),
})