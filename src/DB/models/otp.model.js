// import mongoose from "mongoose";

// const otpSchema = new mongoose.Schema(
//   {
//     email: {
//       type: String,
//       required: true,
//     },
//     otp: {
//       type: String,
//       required: true,
//     },
//     userData: {
//       firstName: String,
//       lastName: String,
//       password: String,
//       gender: String,
//       phoneNumber: String,
//     },
//     expiresAt: {
//       type: Date,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// const Otp = mongoose.model("Otp", otpSchema);
// export default Otp;

import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["signup", "reset"],
      default: "signup",
    },
    userData: {
      firstName: String,
      lastName: String,
      password: String,
      gender: String,
      phoneNumber: String,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const Otp = mongoose.model("Otp", otpSchema);
export default Otp;