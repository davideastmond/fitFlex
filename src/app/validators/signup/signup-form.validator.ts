// Front end form validation for the signup form

import { object, string } from "yup";
import { passwordValidator } from "../password/password.validator";

export const signupFormValidator = object({
  username: string()
    .required("Username is required")
    .min(2, "Username must be at least 2 characters")
    .max(50, "Username must be at most 50 characters"),
  email: string()
    .email("Email must be a valid email")
    .required("Email is required"),
}).concat(passwordValidator);
