const Blog = require("../models/blogModel");


const getAllBlog = async (req, res) => {
    try {
        const blogs = await Blog.find();

        res.send(blogs);
    } catch (error) {
        res.sendStatus(500);
    }
};

const getPublicBlogs = async(req, res)=>{
    try {
        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const total = await Blog.countDocuments({public : true});

        const pages = Math.ceil(total / limit);

        if(page > pages){
            res.status(404).send("This is no page with this page number");
        };

        const blogs = await Blog.find({ public : true }).skip(skip).limit(limit);

        res.send({blogs , page , pages , totalBlogs : total});
    } catch (error) {
        res.sendStatus(500);
    }
};

const getPublicBlogDetails = async(req, res)=>{
    try {
        const {id} = req.params;

        const {populate} = req.query;

        if(populate){
            const blog = await Blog.find({public : true, _id : id}).populate("user");

            res.send(blog);
        }else{
            const blog = await Blog.find({public : true, _id : id});

            res.send(blog);
        };


    } catch (error) {
        res.sendStatus(500);
    }
}

const getMineBlog = async(req, res)=>{
    try {
        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        const total = await Blog.countDocuments({ user: req.user._id });

        const pages = Math.ceil(total / limit);

        if(page > pages){
            res.status(404).send("This is no page with this page number");
        };

        const blogs = await Blog.find({ user: req.user._id }).skip(skip).limit(limit);

        res.send({blogs, page, pages});

    } catch (error) {
        res.sendStatus(500);
    }
}

const createBlogControllers = async (req, res)=>{
    const {title, body , public , user} = req.body;

    try {
        const blog = new Blog({
            title,
            body,
            public,
            blogImage : req.file.path ,
            user,
        });

        await blog.save();

        res.status(201).send(blog);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

module.exports = { createBlogControllers , getAllBlog , getPublicBlogs , getPublicBlogDetails , getMineBlog };