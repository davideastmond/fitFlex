import { object, string } from "yup";

export const profileUpdateValidator = object({
  username: string().required().min(2).max(50), // This will need to be updated to optional
});
