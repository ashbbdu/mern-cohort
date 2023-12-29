const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://ashishsrivastava7007:ash%40Compunnel09@cluster0.5uxz92d.mongodb.net/courseApp');

// Define schemas
const AdminSchema = new mongoose.Schema({
    // Schema definition here
    username : {
        type : String
    } ,
    password : {
        type : String
    } ,
    isAdmin : {
        type : Boolean
    }
});

const UserSchema = new mongoose.Schema({
    // Schema definition here
    username : {
        type : String
    } ,
    password : {
        type : String
    } ,
    isAdmin : {
        type : Boolean
    },
    purchasedCourse : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Course"
        }
    ]
});

const CourseSchema = new mongoose.Schema({
    // Schema definition here
    title : {
        type : String,
    } ,
    description : {
        type : String
    },
    price : {
        type : String
    },
    imageLink : {
        type : String
    },
    enrolledUsers : [
      {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
      }

    ]
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
    Admin,
    User,
    Course
}