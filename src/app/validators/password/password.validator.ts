import { object, ref, string } from "yup";

export const passwordValidator = object({
  password1: string()
    .required("This field is required")
    .min(6, "Password must be at least 6 characters."),
  password2: string()
    .required("This field is required")
    .oneOf([ref("password1")], "Passwords must match."),
});

export const signupPasswordValidator = object({
  password: string()
    .required("This field is required")
    .min(6, "Password must be at least 6 characters."),
});
