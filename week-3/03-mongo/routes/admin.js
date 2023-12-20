const { Router } = require("express");
const { Admin, Course } = require("../db");

const adminMiddleware = require("../middleware/admin");
const router = Router();

// Admin Routes
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
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

    const createAdmin = await Admin.create({
      username,
      password,
      isAdmin: true,
    });

    console.log(createAdmin, "create Admin");

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
  const { username, password } = req.headers;
  console.log(username, password, "headres");
  const { title, description, price, imageLink } = req.body;

  try {
    const findUser = await Admin.findOne({ username: username });
    console.log(findUser);
    if (findUser.username === username && findUser.password === password && findUser.isAdmin) {
      const createCourse = await Course.create({
        title,
        description,
        price,
        imageLink,
      });
      return res.status(200).json({
        success: true,
        msg: "Course Created Successfully",
        data: createCourse,
      });
    } else {
      res.status(400).json({
        success: false,
        msg: "Invalid Credentials",
      });
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
