import { compareSynchash, hash } from "../../utils/hash.js";
import { generateToken } from "../../utils/token.js";
import Randomstring from "randomstring";
import User from "../../DB/models/user.model.js";
import OTP from "../../DB/models/otp.model.js";
import CryptoJS from "crypto-js";
import sendEmail from "../../utils/sendEmail.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const Register = asyncHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    gender,
    phoneNumber,
  } = req.body;

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Password does not match" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(409)
      .json({ success: false, message: "User already exist" });
  }

  const recentOtp = await OTP.findOne({ email });
  if (recentOtp) {
    const secondsSinceCreated = (Date.now() - recentOtp.createdAt) / 1000;
    if (secondsSinceCreated < 60) {
      return res.status(429).json({
        success: false,
        message: `Please wait ${Math.ceil(
          60 - secondsSinceCreated,
        )} seconds before requesting new otp`,
      });
    }
  }

  await OTP.deleteMany({ email });

  const hashedPassword = hash({ plantext: password, salt: 8 });

  const encryptedPhone = CryptoJS.AES.encrypt(
    phoneNumber,
    process.env.JWT_SECRET,
  ).toString();

  const otp = Randomstring.generate({ length: 6, charset: "numeric" });

  await OTP.create({
    email,
    otp,
    userData: {
      firstName,
      lastName,
      password: hashedPassword,
      gender,
      phoneNumber: encryptedPhone,
    },
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  await sendEmail(email, "Reveal Activation", otp);

  return res
    .status(200)
    .json({ success: true, message: "OTP sent to complete registration" });
});

export const verifyOtp = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;
  console.log("1 verify start");

  const otpRecord = await OTP.findOne({ email });
  console.log("2 otp quary done");
  if (!otpRecord) {
    return res
      .status(400)
      .json({ success: false, message: "OTP not found or expired" });
  }

  if (otpRecord.otp !== otp) {
    return res.status(400).json({ success: false, message: "Wrong OTP" });
  }

  const existingUser = await User.findOne({ email });
  console.log("3 user check done");
  if (existingUser) {
    await OTP.deleteOne({ _id: otpRecord._id });
    return res
      .status(409)
      .json({ success: false, message: "User already exist" });
  }

  const user = new User({
    firstName: otpRecord.userData.firstName,
    lastName: otpRecord.userData.lastName,
    email,
    password: otpRecord.userData.password,
    gender: otpRecord.userData.gender,
    phoneNumber: otpRecord.userData.phoneNumber,
    isActive: true,
  });

  user.$locals.skipHash = true;
  await user.save();
  console.log("4 user saved");

  await OTP.deleteOne({ _id: otpRecord._id });
  console.log("5 otp deleted");

  return res.status(201).json({
    success: true,
    message: "User activated and created successfully",
    user,
  });
});

export const resendOtp = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const otpRecord = await OTP.findOne({ email });
  if (!otpRecord) {
    return res.status(400).json({
      success: false,
      message: "No pending signup found for this email, please signup again",
    });
  }
  const secondsSinceCreated = (Date.now() - otpRecord.createdAt) / 1000;
  if (secondsSinceCreated < 60) {
    return res.status(429).json({
      success: false,
      message: `Please wait ${Math.ceil(
        60 - secondsSinceCreated,
      )} seconds before requesting new otp`,
    });
  }
  const newOtp = Randomstring.generate({ length: 6, charset: "numeric" });
  otpRecord.otp = newOtp;
  otpRecord.expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await otpRecord.save();
  await sendEmail(email, "Reveal Activation", newOtp);
  return res
    .status(200)
    .json({ success: true, message: "OTP resent successfully" });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }
  const isMatch = compareSynchash({
    plantext: password,
    hash: user.password,
  });
  if (!isMatch) {
    return res
      .status(400)
      .json({ success: false, message: "Password does not match" });
  }
  if (!user.isActive) {
    return next(new Error("User is not active"));
  }
  const access_token = jwt.sign(
    { id: user._id },
    process.env.ACCESS_JWT_SECRET,
    { expiresIn: "1d" },
  );
  const refresh_Token = jwt.sign(
    { id: user._id },
    process.env.REFRESH_JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    access_token,
    refresh_Token,
  });
});

export const profile = async (req, res) => {
  try {
    let { user } = req;
    user.phoneNumber = CryptoJS.AES.decrypt(
      user.phoneNumber,
      process.env.JWT_SECRET,
    ).toString(CryptoJS.enc.Utf8);
    return res
      .status(200)
      .json({ success: true, message: "User found successfully", user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id, { new: true }, { role: "admin" });
  return res
    .status(200)
    .json({ success: true, message: "User deleted successfully" });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }
  const otp = Randomstring.generate({ length: 6, charset: "numeric" });
  await sendEmail(email, "Reset Password", otp);
  return res
    .status(200)
    .json({ success: true, message: "OTP sent successfully" });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, password, confirmPassword, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }

  user.password = hash({ plantext: password, salt: 8 });
  await user.save();
  return res
    .status(200)
    .json({ success: true, message: "Password reset successfully" });
});

export const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;
  const { email } = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
  const user = await User.findOne(email);
  if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }
  const access_token = jwt.sign(
    { id: user._id },
    process.env.ACCESS_JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    access_token,
  });
});

// import { compareSynchash, hash } from "../../utils/hash.js";
// import Randomstring from "randomstring";
// import User from "../../DB/models/user.model.js";
// import OTP from "../../DB/models/otp.model.js";
// import CryptoJS from "crypto-js";
// import sendEmail from "../../utils/sendEmail.js";
// import { asyncHandler } from "../../utils/asyncHandler.js";
// import jwt from "jsonwebtoken";

// const OTP_LIFETIME = 5 * 60 * 1000;
// const OTP_COOLDOWN = 60;

// const generateOtp = () =>
//   Randomstring.generate({ length: 6, charset: "numeric" });

// const cooldownLeft = (record) => {
//   if (!record) return 0;
//   const secondsPassed = (Date.now() - record.updatedAt) / 1000;
//   return Math.ceil(OTP_COOLDOWN - secondsPassed);
// };

// export const Register = asyncHandler(async (req, res, next) => {
//   const { firstName, lastName, email, password, gender, phoneNumber } =
//     req.body;

//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     return res
//       .status(409)
//       .json({ success: false, message: "User already exist" });
//   }

//   const recentOtp = await OTP.findOne({ email, type: "signup" });
//   const wait = cooldownLeft(recentOtp);
//   if (wait > 0) {
//     return res.status(429).json({
//       success: false,
//       message: `Please wait ${wait} seconds before requesting new otp`,
//     });
//   }

//   await OTP.deleteMany({ email, type: "signup" });

//   const hashedPassword = hash({ plantext: password, salt: 8 });

//   const encryptedPhone = CryptoJS.AES.encrypt(
//     phoneNumber,
//     process.env.JWT_SECRET,
//   ).toString();

//   const otp = generateOtp();

//   await OTP.create({
//     email,
//     otp,
//     type: "signup",
//     userData: {
//       firstName,
//       lastName,
//       password: hashedPassword,
//       gender,
//       phoneNumber: encryptedPhone,
//     },
//     expiresAt: new Date(Date.now() + OTP_LIFETIME),
//   });

//   await sendEmail(email, "MIORA Activation", otp);

//   return res
//     .status(200)
//     .json({ success: true, message: "OTP sent to complete registration" });
// });

// export const verifyOtp = asyncHandler(async (req, res, next) => {
//   const { email, otp } = req.body;

//   const otpRecord = await OTP.findOne({ email, type: "signup" });
//   if (!otpRecord || otpRecord.expiresAt < Date.now()) {
//     return res
//       .status(400)
//       .json({ success: false, message: "OTP not found or expired" });
//   }

//   if (otpRecord.otp !== otp) {
//     return res.status(400).json({ success: false, message: "Wrong OTP" });
//   }

//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     await OTP.deleteOne({ _id: otpRecord._id });
//     return res
//       .status(409)
//       .json({ success: false, message: "User already exist" });
//   }

//   const user = new User({
//     firstName: otpRecord.userData.firstName,
//     lastName: otpRecord.userData.lastName,
//     email,
//     password: otpRecord.userData.password,
//     gender: otpRecord.userData.gender,
//     phoneNumber: otpRecord.userData.phoneNumber,
//     isActive: true,
//   });

//   user.$locals.skipHash = true;
//   await user.save();

//   await OTP.deleteOne({ _id: otpRecord._id });

//   user.password = undefined;
//   user.phoneNumber = undefined;

//   return res.status(201).json({
//     success: true,
//     message: "User activated and created successfully",
//     user,
//   });
// });

// export const resendOtp = asyncHandler(async (req, res, next) => {
//   const { email } = req.body;

//   const otpRecord = await OTP.findOne({ email, type: "signup" });
//   if (!otpRecord) {
//     return res.status(400).json({
//       success: false,
//       message: "No pending signup found for this email, please signup again",
//     });
//   }

//   const wait = cooldownLeft(otpRecord);
//   if (wait > 0) {
//     return res.status(429).json({
//       success: false,
//       message: `Please wait ${wait} seconds before requesting new otp`,
//     });
//   }

//   const newOtp = generateOtp();
//   otpRecord.otp = newOtp;
//   otpRecord.expiresAt = new Date(Date.now() + OTP_LIFETIME);
//   await otpRecord.save();

//   await sendEmail(email, "MIORA Activation", newOtp);

//   return res
//     .status(200)
//     .json({ success: true, message: "OTP resent successfully" });
// });

// export const login = asyncHandler(async (req, res, next) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });
//   const isMatch =
//     user && compareSynchash({ plantext: password, hash: user.password });
//   if (!isMatch) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Invalid email or password" });
//   }

//   if (!user.isActive) {
//     return res
//       .status(403)
//       .json({ success: false, message: "User is not active" });
//   }

//   const accessToken = jwt.sign(
//     { id: user._id },
//     process.env.ACCESS_JWT_SECRET,
//     { expiresIn: "1d" },
//   );
//   const refreshToken = jwt.sign(
//     { id: user._id },
//     process.env.REFRESH_JWT_SECRET,
//     { expiresIn: "7d" },
//   );

//   return res.status(200).json({
//     success: true,
//     message: "User logged in successfully",
//     accessToken,
//     refreshToken,
//   });
// });

// export const profile = async (req, res) => {
//   try {
//     let { user } = req;
//     user.phoneNumber = CryptoJS.AES.decrypt(
//       user.phoneNumber,
//       process.env.JWT_SECRET,
//     ).toString(CryptoJS.enc.Utf8);
//     return res
//       .status(200)
//       .json({ success: true, message: "User found successfully", user });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const deleteUser = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const user = await User.findByIdAndDelete(id);
//   if (!user) {
//     return res.status(404).json({ success: false, message: "User not found" });
//   }

//   return res
//     .status(200)
//     .json({ success: true, message: "User deleted successfully" });
// });

// export const forgotPassword = asyncHandler(async (req, res, next) => {
//   const { email } = req.body;

//   const user = await User.findOne({ email });
//   if (!user) {
//     return res.status(400).json({ success: false, message: "User not found" });
//   }

//   const recentOtp = await OTP.findOne({ email, type: "reset" });
//   const wait = cooldownLeft(recentOtp);
//   if (wait > 0) {
//     return res.status(429).json({
//       success: false,
//       message: `Please wait ${wait} seconds before requesting new otp`,
//     });
//   }

//   await OTP.deleteMany({ email, type: "reset" });

//   const otp = generateOtp();
//   await OTP.create({
//     email,
//     otp,
//     type: "reset",
//     expiresAt: new Date(Date.now() + OTP_LIFETIME),
//   });

//   await sendEmail(email, "Reset Password", otp);

//   return res
//     .status(200)
//     .json({ success: true, message: "OTP sent successfully" });
// });

// export const resetPassword = asyncHandler(async (req, res, next) => {
//   const { email, password, otp } = req.body;

//   const user = await User.findOne({ email });
//   if (!user) {
//     return res.status(400).json({ success: false, message: "User not found" });
//   }

//   const otpRecord = await OTP.findOne({ email, type: "reset" });
//   if (!otpRecord || otpRecord.otp !== otp || otpRecord.expiresAt < Date.now()) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Invalid or expired OTP" });
//   }

//   user.password = password;
//   await user.save();

//   await OTP.deleteOne({ _id: otpRecord._id });

//   return res
//     .status(200)
//     .json({ success: true, message: "Password reset successfully" });
// });

// export const refreshToken = asyncHandler(async (req, res, next) => {
//   const { refreshToken } = req.body;

//   const { id } = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
//   const user = await User.findById(id);
//   if (!user) {
//     return res.status(400).json({ success: false, message: "User not found" });
//   }

//   const accessToken = jwt.sign(
//     { id: user._id },
//     process.env.ACCESS_JWT_SECRET,
//     { expiresIn: "1d" },
//   );

//   return res.status(200).json({
//     success: true,
//     message: "Token refreshed successfully",
//     accessToken,
//   });
// });
