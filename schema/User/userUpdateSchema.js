const { body } = require("express-validator");


const userUpdateSchema = [
    body("name").exists({checkFalsy : true }).withMessage("Please Fill your Name"),

    body("email").isEmail().withMessage("Please Fill Valid Email"),

    body("age").isNumeric().withMessage("Please Fill Your Age"),

    body("address").exists({ checkFalsy : true }).withMessage("Please Fill Your Address")
];

module.exports = userUpdateSchema;