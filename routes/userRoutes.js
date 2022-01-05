const auth = require("../middleware/auth");
const express = require("express");
const { 
    getAllUsers, 
    getSingleUser, 
    getMyProfile, 
    userSignUp, 
    userSignIn, 
    userSignOut, 
    updateUser, 
    deleteUser, 
    changePassword} = require("../controllers/userControllers");
const fileUpload = require("../middleware/fileUpload");
const validateReq = require("../middleware/validateReq");
const signUpSchema = require("../schema/User/signUpSchema");
const signInSchema = require("../schema/User/signInSchema");
const admin = require("../middleware/admin");
const userUpdateSchema = require("../schema/User/userUpdateSchema");
const changePwSchema = require("../schema/User/changePwSchema");

const router = express.Router();



//Get Methods
router.get("/",auth, admin, getAllUsers);

router.get("/mine", auth, getMyProfile);

router.get("/:id",auth, admin, getSingleUser);



//Sign Up
router.post(
    "/signUp", 
    fileUpload.single("avatar"),
    signUpSchema , 
    validateReq , 
    userSignUp ,
);

//Sign In
router.post("/signIn",signInSchema,validateReq, userSignIn);

//Sign Out
router.post("/signOut", auth , userSignOut);


//Update
router.put("/",
auth , 
fileUpload.single("avatar"),
userUpdateSchema , 
validateReq ,
updateUser
);

//Update Password
router.put("/change-password", changePwSchema , validateReq , auth , changePassword);

//Delete
router.delete("/", auth , deleteUser);

module.exports = router;

