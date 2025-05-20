const User = require("../models/user"); // Import the User model
const passport = require("passport"); // Import passport for authentication
const { savereturnTo } = require("../middleware");
module.exports.renderSignupForm =  (req, res) => {
    res.render("users/signup.ejs") // Access error message from flash   
}
module.exports.renderLoginForm =(req, res) => {
    res.render("users/login.ejs") // Access error message from flash   
}

module.exports.signup =  async (req, res) => {
    try {
        let { username, email, password } = req.body; // Destructure the request body
        const newUser = new User({ username, email }); // Create a new user object
        const registeredUser = await User.register(newUser, password); // Register the user with the provided password
        console.log(registeredUser); // Log the registered user
        req.login(registeredUser, (err) => { // Log in the user
            if (err) {
                console.error(err); // Log any error that occurs during login
                return res.redirect("/listings"); // Redirect to listings if there's an error
            }
            req.flash("success", "Welcome to the site!"); // Set a success message in flash
            res.redirect("/listings"); // Redirect to the listings route
        
        });
       
    }
    catch (error) {
        console.error(error); // Log the error
        if (error.name === "UserExistsError") {
            req.flash("error", "Username is already taken.");
        } else {
            req.flash("error", "Something went wrong. Please try again.");
        }
         res.redirect("/signup"); // Redirect to the signup route
    }
}

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.returnTo || "/listings";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout((err) => { // Log out the user
        if (err) {
            console.error(err); // Log any error that occurs during logout
            return res.redirect("/listings"); // Redirect to listings if there's an error
        }
        req.flash("success", "Goodbye! You logged out."); // Set a success message in flash
        res.redirect("/listings"); // Redirect to the listings route
    });
}