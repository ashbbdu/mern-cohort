const { User } = require("../db");

async function userMiddleware(req, res, next) {
  // Implement user auth logic
  // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
  const { username } = req.headers;
  const check = await User.findOne({ username: username });
  if (!check?.isAdmin) {
    next();
  } else {
    return res.status(400).json({
      success: false,
      msg: "You are not allowed to access this path",
    });
  }
}

module.exports = userMiddleware;
