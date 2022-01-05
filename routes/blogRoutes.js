const auth = require("../middleware/auth");
const express = require("express");
const { createBlogControllers, getAllBlog, getPublicBlogs, getPublicBlogDetails, getMineBlog } = require("../controllers/blogControllers");
const admin = require("../middleware/admin");
const blogCreateSchema = require("../schema/Blog/blogCreateSchema");
const fileUpload = require("../middleware/fileUpload");
const validateReq = require("../middleware/validateReq");


const router = express.Router();


//Get All Blogs - admin
router.get("/", auth , admin , getAllBlog);

//Get Public Blogs
router.get("/public", getPublicBlogs);

//Get Single blog - public 
router.get("/public/:id", getPublicBlogDetails);

//Get Mine Blogs - login user
router.get("/mine", auth , getMineBlog );

//Create a blog - login user
router.post(
    "/", 
    auth ,
    fileUpload.single("image"),
    blogCreateSchema,
    validateReq ,
    createBlogControllers);

//Edit a blog - login user

//Delete a blog - login user

//Toggle Public - login user

module.exports = router;

//Todo - Share a blog