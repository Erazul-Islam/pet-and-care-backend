import { z } from "zod";

const postValidationSchema = z.object({
    postId: z.string().optional(),
    description: z.string().optional(),
    userEmail : z.string().optional(),
    photo: z.string().optional(),
    caption: z.string().optional()
})

export const postValidation = {
    postValidationSchema
}