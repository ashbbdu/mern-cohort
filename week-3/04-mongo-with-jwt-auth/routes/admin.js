const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const jwt = require("jsonwebtoken");
const jwtSecret = "secret";
const router = Router();
const bcrypt = require("bcrypt");
const { Admin, Course } = require("../db");

// Admin Routes

router.post("/signin", async (req, res) => {
  // Implement admin signup logic
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      msg: "Please fill all the details",
    });
  }

  const user = await Admin.findOne({ username: username });
  if (!user) {
    return res.status(400).json({
      success: false,
      msg: "User is not registerd with us",
    });
  }

  const payload = {
    username: user.username,
    isAdmin: user.isAdmin,
  };

  const compare = await bcrypt.compare(password, user.password);
  if (compare) {
    const token = await jwt.sign(payload, jwtSecret);

    user.token = token;
    user.password = undefined;

    return res.status(200).json({
      success: true,
      token,
      user,
      msg: "User Logged In Successfully",
    });
  } else {
    return res.status(400).json({
      success: false,
      msg: "Incorrect Password",
    });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        msg: "Please fill all the details",
      });
    }

    const existingUser = await Admin.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        msg: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createAdmin = await Admin.create({
      username,
      password: hashedPassword,
      isAdmin: true,
    });

    res.status(200).json({
      success: true,
      msg: "Admin Created Successfully",
      createAdmin,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      success: false,
      msg: "Something went wrong",
    });
  }
});

router.post("/courses", adminMiddleware, async (req, res) => {
  // Implement course creation logic
  //   console.log(req.user , "user")
  const { username } = req.user;
  const { title, description, price, imageLink } = req.body;

  try {
    const findUser = await Admin.findOne({ username: username });
    if (
     findUser.isAdmin
    ) {
      const createCourse = await Course.create({
        title,
        description,
        price,
        imageLink,
      });
      return res.status(200).json({
        success: true,
        msg: "Course Created Successfully",
        courseId: createCourse._id,
      });
    } else if(!findUser.isAdmin) {
      res.status(400).json({
        success: false,
        msg: "You are not allowed to access this route",
      })
    } else {
      res.status(400).json({
        success: false,
        msg: "Invalid credentials",
      })
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({
      success: false,
      msg: "Something went wrong",
    });
  }
});

router.get("/courses", adminMiddleware, async (req, res) => {
  // Implement fetching all courses logic
  try {
    const courses = await Admin.find();
    res.status(200).json({
      success: true,
      msg: "Courses Fetched Successfully",
      courses,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      success: false,
      msg: "Something went wrong",
    });
  }
});

module.exports = router;
