const { Router } = require("express");
const { User, Course } = require("../db");
const router = Router();
const userMiddleware = require("../middleware/user");

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    try {
        const { username, password } = req.body;
        if (!username || !password) {
          return res.status(400).json({
            success: false,
            msg: "Please fill all the details",
          });
        }
    
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            msg: "User already exists",
          });
        }
    
        const user = await User.create({
          username,
          password,
          isAdmin: false,
        });
        console.log(user , "user")
    
        res.status(200).json({
          success: true,
          msg: "User Created Successfully",
          user,
        });
      } catch (e) {
        console.log(e);
        res.status(400).json({
          success: false,
          msg: "Something went wrong",
        });
      }
});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    const courses = await Course.find();
    res.status(200).json({
        success: true,
        msg: "Courses Fetched Successfully",
        courses,
      });
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
   try {
    const {courseId} = req.params;
    const course = await Course.findById(courseId);
    res.status(200).json({
        success: true,
        msg: "Course Fetched Successfully",
        course,
      });
   } catch(e) {
    console.log(e  ,"erro")
   }
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const {username} = req.headers;
    const user = await User.findOne({username : username})
    res.status(200).json({
        success : true,
        message : "List of purchased courses",
        purchasedCourses : user.purchasedCourse
    })
});

module.exports = router;