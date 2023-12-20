const { Admin } = require("../db");

// Middleware for handling auth
async function adminMiddleware(req, res, next) {
  // Implement admin auth logic
  // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
  const { username } = req.headers;
  const check = await Admin.findOne({ username: username });
  console.log(check , "check")
  if (check?.isAdmin) {
    next();
  } else {
    return res.status(400).json({
      success: false,
      msg: "You are not allowed to access this path",
    });
  }
}

module.exports = adminMiddleware;
