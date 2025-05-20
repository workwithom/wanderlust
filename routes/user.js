const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { savereturnTo } = require("../middleware");
const router = express.Router();
const userController = require("../controllers/users");


router.route("/signup")
    .get(userController.renderSignupForm) // Use the renderSignupForm method from userController
    .post(wrapAsync(userController.signup)); // Use the signup method from userController


router.route("/login")
    .get(userController.renderLoginForm) // Use the renderLoginForm method from userController
    .post(savereturnTo, passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login"
    }), userController.login); // Use the login method from userController

router.get("/logout",userController.logout); // Use the logout method from userController

module.exports = router;