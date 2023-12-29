const jwtSecret = "secret";
const jwt = require("jsonwebtoken");
// Middleware for handling auth
async function adminMiddleware(req, res, next) {
  // Implement admin auth logic
  // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
  let token =
    req?.cookies?.token ||
    req?.body?.token ||
    req?.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ success: false, message: "Token Missing" });
  }

  try {
    const decode = await jwt.verify(token, jwtSecret);
    if (decode.isAdmin) {
      //    NOTE
      req.user = decode;
      next();
    } else {
      {
        return res
          .status(401)
          .json({
            success: false,
            message: "You are not allowed to access this path",
          });
      }
    }
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Token is invalid" });
  }
}

module.exports = adminMiddleware;
