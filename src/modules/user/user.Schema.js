// import joi from "joi";

// export const RegisterSchema = joi
//   .object({
//     firstName: joi.string().required(),
//     lastName: joi.string().required(),
//     email: joi
//       .string()
//       .required()
//       .regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
//     password: joi.string().required(),
//     confirmPassword: joi.string().required(),
//     phoneNumber: joi.string().required(),
//     gender: joi.string().valid("male", "female").required(),
//   })
//   .required();

// export const LoginSchema = joi
//   .object({
//     email: joi
//       .string()
//       .required()
//       .regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
//     password: joi.string().required(),
//   })
//   .required();

// export const forgotPasswordSchema = joi
//   .object({
//     email: joi
//       .string()
//       .required()
//       .regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
//   })
//   .required();

// export const resetPasswordSchema = joi
//   .object({
//     email: joi
//       .string()
//       .required()
//       .regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
//     password: joi.string().required(),
//     confirmPassword: joi.string().required(),
//     otp: joi.string().required(),
//   })
//   .required();

// export const refreshTokenSchema = joi
//   .object({
//     refreshToken: joi.string().required(),
//   })
//   .required();
import joi from "joi";

const emailRule = joi
  .string()
  .required()
  .regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

export const RegisterSchema = joi
  .object({
    firstName: joi.string().min(3).max(20).required(),
    lastName: joi.string().min(3).max(20).required(),
    email: emailRule,
    password: joi.string().min(8).required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
    phoneNumber: joi.string().required(),
    gender: joi.string().valid("male", "female").required(),
  })
  .required();

export const verifyOtpSchema = joi
  .object({
    email: emailRule,
    otp: joi.string().length(6).required(),
  })
  .required();

export const resendOtpSchema = joi
  .object({
    email: emailRule,
  })
  .required();

export const LoginSchema = joi
  .object({
    email: emailRule,
    password: joi.string().required(),
  })
  .required();

export const forgotPasswordSchema = joi
  .object({
    email: emailRule,
  })
  .required();

export const resetPasswordSchema = joi
  .object({
    email: emailRule,
    password: joi.string().min(8).required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
    otp: joi.string().length(6).required(),
  })
  .required();

export const refreshTokenSchema = joi
  .object({
    refreshToken: joi.string().required(),
  })
  .required();