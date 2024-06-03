import { z } from 'zod'

export const authenticationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must contain at least 6 character(s)'),
  name: z.string().optional(),
  lastName: z.string().optional(),
})

export type UserFormFormValues = z.infer<typeof authenticationSchema>
