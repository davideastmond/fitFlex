import { object, string } from "yup";

export const usernameValidator = object({
  username: string()
    .min(2, "Username should be at least 2 chars.")
    .max(50, "Username should be max 50 chars."), // This will need to be updated to optional
});
