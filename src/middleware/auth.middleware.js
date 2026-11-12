// import jwt from "jsonwebtoken";
// import User from "../modules/user/user.model.js";
// export const authMiddleware = async (req, res, next) => {
//   try {
//     const { authorization } = req.headers;
//     if (!authorization || !authorization.startsWith("Bearer ")) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Token not found" });
//     }
//     const token = authorization.split(" ")[1];
//     const { id } = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(id).select("-password");
//     next();
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

import jwt from "jsonwebtoken";
import User from "../DB/models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Token not found" });
    }

    const token = authorization.split(" ")[1];
    const { id } = jwt.verify(token, process.env.ACCESS_JWT_SECRET);

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};