// import { Router } from "express";

// import * as userservice from "./user.service.js";
// import { authMiddleware } from "../../middleware/auth.middleware.js";
// import isAuthorized from "../../middleware/authorization.middelware.js";
// import { validate } from "../../middleware/validation.middleware.js";
// import {
//   RegisterSchema,
//   LoginSchema,
//   forgotPasswordSchema,
//   resetPasswordSchema,
//   refreshTokenSchema,
// } from "./user.Schema.js";


// const userRouter = Router();

// userRouter.post("/Register", validate(RegisterSchema), userservice.Register);
// userRouter.post("/verify-otp", userservice.verifyOtp);
// userRouter.post("/resend-otp", userservice.resendOtp);
// userRouter.post("/login", validate(LoginSchema), userservice.login);
// userRouter.get("/profile", authMiddleware, userservice.profile);
// userRouter.delete(
//   "/deletUser/:id",
//   authMiddleware,
//   isAuthorized("userRole.admin"),
//   userservice.deleteUser,
// );

import { Router } from "express";

import * as userservice from "./user.service.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { userRole } from "../../utils/roles.js";
import {
  RegisterSchema,
  verifyOtpSchema,
  resendOtpSchema,
  LoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} from "./user.Schema.js";

const userRouter = Router();

userRouter.post("/Register", validate(RegisterSchema), userservice.Register);
userRouter.post("/verify-otp", validate(verifyOtpSchema), userservice.verifyOtp);
userRouter.post("/resend-otp", validate(resendOtpSchema), userservice.resendOtp);
userRouter.post("/login", validate(LoginSchema), userservice.login);
userRouter.get("/profile", authMiddleware, userservice.profile);
userRouter.delete(
  "/deletUser/:id",
  authMiddleware,
  isAuthorized(userRole.admin),
  userservice.deleteUser,
);
userRouter.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  userservice.forgotPassword,
);
userRouter.post(
  "/reset-password",
  validate(resetPasswordSchema),
  userservice.resetPassword,
);
userRouter.post(
  "/refresh-token",
  validate(refreshTokenSchema),
  userservice.refreshToken,
);

export default userRouter;