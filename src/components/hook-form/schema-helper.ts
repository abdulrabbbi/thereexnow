import * as Yup from "yup";

export const schemaHelper = {
  fullName: Yup.string()
    .required("Full name is required")
    .min(6, "Mininum 6 characters")
    .max(32, "Maximum 32 characters"),
  language: Yup.string().required("Language is required"),
  email: Yup.string()
    .required("Email is required")
    .email("Email must be a valid email address"),
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Password's not match"),
};
