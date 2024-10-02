import { z } from 'zod'

const loginValidationSchema = z.object({
    body: z.object({
        email: z.string({required_error:"You must have email"}),
        password:z.string({required_error:"password is required"})
    })
})

const changePasswordValidationSchema = z.object({
    body: z.object({
      oldPassword: z.string({
        required_error: 'Old password is required',
      }),
      newPassword: z.string({ required_error: 'Password is required' }),
    }),
  });

export const AuthValidation = {
    loginValidationSchema,
    changePasswordValidationSchema
}