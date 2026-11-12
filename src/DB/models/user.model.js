import mongoose from "mongoose";
import { hash } from "../../utils/hash.js";

export const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      maxlength: 20,
      minlength: 3,
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
      maxlength: 20,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    phoneNumber: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

UserSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.$locals.skipHash) {
    return ; 
  }
  this.password = hash({ plantext: this.password, salt: 8 });
  
});

const User = mongoose.model("User", UserSchema);
export default User;




// import mongoose from "mongoose";
// import { hash } from "../../utils/hash.js";

// export const UserSchema = new mongoose.Schema(
//   {
//     firstName: {
//       type: String,
//       required: [true, "First Name is required"],
//       maxlength: 20,
//       minlength: 3,
//     },
//     lastName: {
//       type: String,
//       required: [true, "Last Name is required"],
//       maxlength: 20,
//       minlength: 3,
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       match: [
//         /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//         "Please add a valid email",
//       ],
//     },
//     gender: {
//       type: String,
//       enum: ["male", "female"],
//       default: "male",
//     },
//     phoneNumber: {
//       type: String,
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//     },
//     role: {
//       type: String,
//       enum: ["user", "admin"],
//       default: "user",
//     },
//     isActive: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     timestamps: {
//       createdAt: "created_at",
//       updatedAt: "updated_at",
//     },
//   },
// );

// UserSchema.pre("save", function (next) {
//   if (!this.isModified("password") || this.$locals.skipHash) {
     
    
//   }
//   this.password = hash({ plantext: this.password, salt: 8 });
  
// });

// const User = mongoose.model("User", UserSchema);
// export default User;