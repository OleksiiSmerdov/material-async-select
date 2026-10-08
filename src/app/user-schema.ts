import { z } from 'zod';

export const UserSchema = z
  .object({
    id: z.number(),
    username: z.string(),
    firstName: z.string(),
    maidenName: z.string(),
    lastName: z.string(),
  })
  .transform((user) => ({
    ...user,
    fullName: [user.firstName, user.maidenName, user.lastName].filter(Boolean).join(' '),
  }));

export type User = z.infer<typeof UserSchema>;
