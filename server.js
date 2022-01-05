const express = require("express");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const blogRouter = require("./routes/blogRoutes");
require("dotenv").config();

//App initilize
const app = express();
const PORT = process.env.PORT || 3000;


//Middlewares
app.use(cors());

app.use(morgan("tiny"));

app.use(helmet());

app.use(express.json());


//To render image
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


//Testing route
app.get("/", (req, res)=>{
    res.send("Your server is online");
});


//Routes
app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);


mongoose.connect("mongodb://localhost:27017/management").then(()=>{
    console.log("Database Connect");

    app.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`);
    });
});

