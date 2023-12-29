const { Router } = require("express");
const { User, Course } = require("../db");
const router = Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = "secret";
const userMiddleware = require("../middleware/user");

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    try {
        const { username, password } = req.body;
        console.log(username, password);
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
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const createUser = await User.create({
          username,
          password: hashedPassword,
          isAdmin: false,
        });
    
        res.status(200).json({
          success: true,
          msg: "User Created Successfully",
          createUser,
        });
      } catch (e) {
        console.log(e);
        res.status(400).json({
          success: false,
          msg: "Something went wrong",
        });
      }
    

});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        msg: "Please fill all the details",
      });
    }
  
    const user = await User.findOne({ username: username });
    console.log(user , "user");
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
    console.log(compare , "compare");
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

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    try {
        const courses = await Course.find();
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

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
   try {
    console.log(req.user , "req user")
    const {courseId} = req.params;
    const { username }  = req.user;
    const user = await User.findOne({username : username})

    const updateUser = await User.findOneAndUpdate({username }, {$push : {purchasedCourse : courseId}})
    res.status(200).json({
        success: true,
        msg: "Course Purched Successfully",
        updateUser,
      });
   } catch(e) {
    console.log(e  ,"erro")
   }
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const {username} = req.user;
    const user = await User.findOne({username : username}).populate("purchasedCourse").exec()
    res.status(200).json({
        success : true,
        message : "List of purchased courses",
        purchasedCourses : user.purchasedCourse 
    })
});

module.exports = router;
