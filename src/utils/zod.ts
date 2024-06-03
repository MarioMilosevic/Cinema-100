import { z } from 'zod'

export const authenticationSchema = z.object({
  email: z.string().email("This email address is not found"),
  password: z.string().min(6, 'Password must contain at least 6 character(s)'),
  name: z.string().min(3).optional(),
  lastName: z.string().min(3).optional(),
})

export type UserFormFormValues = z.infer<typeof authenticationSchema>
