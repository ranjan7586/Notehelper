const express = require("express");
const { registerUser, signinUser, testController, forgotPasswordController, updateProfileController, getAllUsers, updateRoleController } = require("../Controllers/userControl");
const { requireSignIn, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/signin").post(signinUser);
//forgot password
router.route("/forgotpassword").post(forgotPasswordController);

//test route
router.route("/test").get(requireSignIn,isAdmin, testController);

//protected route
router.route("/user-auth").get(requireSignIn, (req,res)=>{
    res.status(200).send({ok:true});
})
//admin route
router.route("/admin-auth").get(requireSignIn,isAdmin, (req,res)=>{
    res.status(200).send({ok:true,message:"lol"});
})
//update profile
router.route("/profile").put(requireSignIn,updateProfileController);
//update profile
router.route("/admin/user-profile-role/:id").put(requireSignIn,isAdmin,updateRoleController);

//get all users
router.route("/admin/get-users").get(requireSignIn, isAdmin, getAllUsers);
module.exports = router;