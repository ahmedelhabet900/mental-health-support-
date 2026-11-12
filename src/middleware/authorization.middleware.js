// const isAuthorized = (...role) => {
//   return (req, res, next) => {
//     if (!role.includes(req.user.role)) {
//       next();
//     } else {
//       return res
//         .status(403)
//         .json({
//           success: false,
//           message: "You are not authorized to access this route",
//         });
//     }
//   };
// };

// export default isAuthorized;

const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({
      success: false,
      message: "You are not authorized to access this route",
    });
  };
};

export default isAuthorized;