const { body } = require("express-validator");


const signUpSchema = [
    body("name").exists({checkFalsy : true }).withMessage("Please Fill your Name"),

    body("email").isEmail().withMessage("Please Fill Valid Email"),

    body("password").isLength({ min : 6 }).withMessage("Please must be at least 6 characters"),

    body("comfirmPassword").custom((value, {req})=>{
        if (value !== req.body.password){
            throw new Error("Password should be match");
        }
        return true;
    }),

    body("age").isNumeric().withMessage("Please Fill Your Age"),

    body("address").exists({ checkFalsy : true }).withMessage("Please Fill Your Address")
];

module.exports = signUpSchema;