import { z } from 'zod'

const loginValidationSchema = z.object({
    body: z.object({
        email: z.string({required_error:"You must have email"}),
        password:z.string({required_error:"password is required"})
    })
})

export const AuthValidation = {
    loginValidationSchema
}