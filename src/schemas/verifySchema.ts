import {z} from "zod"

export const verifyScema = z.object({
    code:z.string().length(6,"Verification code must be six digits")
})