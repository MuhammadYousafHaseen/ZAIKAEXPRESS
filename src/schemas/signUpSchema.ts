import {z} from 'zod';

export const nameValidation = z
.string()
.min(3, {message: 'Username must be at least 3 characters long'})
.max(20, {message: 'Username must be at most 20 characters long'})
.regex(/^[a-zA-Z0-9_]+$/ , {message: 'Name must contain only letters, numbers, and underscores not spaces'});


export const signUpSchema = z.object({
    name: nameValidation,
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(6, {message: 'Password must be at least 6 characters long'}),
    address: z.string().min(5, {message: 'Address must be at least 5 characters long'}),
    city: z.string().min(3, {message: 'City must be at least 3 characters long'}),
    country: z.string().min(3, {message: 'Country must be at least 3 characters long'}),
    state: z.string().min(3, {message: 'Country must be at least 3 characters long'}),
    phone: z.string().min(11, {message: 'Country must be at least 11 characters long'}),
})