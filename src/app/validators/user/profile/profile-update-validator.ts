import { object, string } from "yup";

export const profileUpdateValidator = object({
  username: string()
    .optional()
    .min(2, "Username should be minimum 2 chars.")
    .max(50, "Username should be max 50 chars."),
  password: string().optional().min(6),
});
