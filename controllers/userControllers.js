const bcrypt = require("bcrypt");
const config = require("../config");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const transporter = require("../utils/nodeMail");
const fs = require("fs");

const getAllUsers = async(req, res)=>{
    try {
        const users = await User.find();

        res.send(users);
    } catch (error) {
        res.status(500);
    }
};

const getSingleUser = async(req, res)=>{
    try {
        const user = await User.findById(req.params.id);

        res.send(user);
    } catch (error) {
        res.status(500);
    }
};

const getMyProfile = async(req, res)=>{
    res.send({
        _id : req.user.id,
        name : req.user.name,
        email : req.user.email,
        isAdmin : req.user.isAdmin,
        age : req.user.age,
        address : req.user.address,
        avatar : req.user.avatar,
    });
};

const userSignUp = async(req, res)=>{
    const { name, email, password, age, address } = req.body;

    try {
        const hashPwd = await bcrypt.hash(password, 8);


        const user = new User({ 
            name, 
            email, 
            password : hashPwd, 
            age, 
            address, 
            avatar : req.file.path,
        });

        const token = await generateToken(user);

        await user.save();

        //Send Mail
        const mailOptions = {
            from : config.MAIL_USER,
            to : user.email,
            subject : "Thanks for creating account",
            text: `Hay ${user.name} . Thank you so much. Enjoy our application. `
        };

        transporter.sendMail(mailOptions, (err, info)=>{
            if(err){
                console.log(err);
                return;
            }
            console.log(`Email send successfully to ${user.email}`);
        });

        res.send({
            _id : user.id,
            name : user.name,
            email : user.email,
            isAdmin : user.isAdmin,
            age : user.age,
            address : user.address,
            avatar : user.avatar,
            token,
        });

    } catch (error) {
        res.status(500).send({ msg: error.msg });
    }
};

const userSignIn = async(req, res)=>{
    const {email , password} = req.body;

    try {
        const user = await User.findOne({ email });

        if(user){
            const samePw = await bcrypt.compare(String(password), user.password);

            if(samePw){
                const token = await generateToken(user);

                res.send({
                    _id : user.id,
                    name : user.name,
                    email : user.email,
                    isAdmin : user.isAdmin,
                    age : user.age,
                    address : user.address,
                    avatar : user.avatar,
                    token,
                });
            }else{
                res.status(401).send("Wrong Email and Password");
            };
            
        }else{
            res.status(401).send("Wrong Email and Password");
        };
    } catch (error) {
        res.status(401).send("Wrong Email and Password")
    }
};

const userSignOut = async(req, res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((data)=>{
            return data.token !== req.token;
        });

        await req.user.save();

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
};

const updateUser = async(req, res)=>{
    try {
        const user = await User.findById(req.user._id);

        req.body.avatar = req.file ? req.file.path : user.avatar;

        if(req.file){
            fs.unlinkSync(user.avatar);
        };

        const updateData = {
            ...req.body,  // name , email , age , address , avatar
            password: user.password,
            isAdmin: user.isAdmin,
            tokens: user.tokens,
        };

        const updateuser = await User.findByIdAndUpdate(req.user._id, updateData ,{
            new: true,
        });

        res.send({
            _id : updateuser.id,
            name : updateuser.name,
            email : updateuser.email,
            isAdmin : updateuser.isAdmin,
            age : updateuser.age,
            address : updateuser.address,
            avatar : updateuser.avatar,
        });

    } catch (error) {
        res.sendStatus(500);
    }
};

const changePassword = async(req, res)=>{
    try {
        const user = await User.findById(req.user._id);

        const samePw = await bcrypt.compare(String(req.body.prevPw), user.password);

        if(!samePw){
            res.status(400).send("Your Previous Pwd is wrong");

            return;
        };

        const hashPw = await bcrypt.hash(req.body.newPw, 8);

        const updateData = {
            name: user.name,
            email: user.email,
            age: user.age,
            address: user.address,
            isAdmin: user.isAdmin,
            avatar: user.avatar,
            tokens: user.tokens,
            password: hashPw,
        };

        const updateuser = await User.findByIdAndUpdate(req.user._id, updateData,{new: true});

        res.send({
            _id : updateuser.id,
            name : updateuser.name,
            email : updateuser.email,
            isAdmin : updateuser.isAdmin,
            age : updateuser.age,
            address : updateuser.address,
            avatar : updateuser.avatar,
        });
    } catch (error) {
        res.sendStatus(500);
    }
};

const deleteUser = async(req, res)=>{
    try {
        const user = await User.findById(req.user._id);

        fs.unlinkSync(user.avatar);

        const deletedUser = await user.remove();

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
};

module.exports = { 
    getAllUsers, 
    getSingleUser , 
    getMyProfile , 
    userSignUp , 
    userSignIn , 
    userSignOut ,
    updateUser , 
    deleteUser ,
    changePassword
};