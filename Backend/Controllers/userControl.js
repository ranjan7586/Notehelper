const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModels");
const bcrypt = require("bcryptjs");
const sendToken = require("../utils/jwtToken");
const userModels = require("../models/userModels");
const { hashPassword } = require("../Helpers/Helper");

//register a user
exports.registerUser = catchAsyncError(async (req, res) => {
    try {
        const { name, email, password, cpassword } = req.body;
        if(!name){
            return res.send({message:"Name is required"})
        }
        if(!email){
            return res.send({message:"Email is required"})
        }
        if(!password){
            return res.send({message:"Password is required"})
        }
        if(!cpassword){
            return res.send({message:"Please Confirm Your Password"})
        }
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({
                success: false,
                message: "Email Already Exists.Please Login"
            })
        }
        else if (password != cpassword) {
            return res.status(421).json({
                success: false,
                message: "Password Should be Matched"
            })
        }
        else {
            const user = await User.create(req.body);
            await user.save();
            sendToken(user, 201, res);
        }
    } catch (err) {
        console.log(err);
    }
});

//signin a user
exports.signinUser = catchAsyncError(async (req, res,next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please Fill The Details Properly"
            })
        }
        const userLogin = await User.findOne({ email: email }).select("+password");
        if (userLogin) {
            const passwordMatch = await bcrypt.compare(password, userLogin.password);
            // console.log(token);
            if (!passwordMatch) {
                console.log("hello");
                return res.status(400).json({
                    success: false,
                    message: "Invalid Credientials"
                })
            }
            else {
                // console.log("hello");
                sendToken(userLogin,200,res);
            }
        }
        else {
            res.status(401).json({
                success: false,
                message: "You are not registered"
            })
        }

    } catch (err) {
        next(new ErrorHandler(err.message, 400));
    }
});

//test controller
exports.testController=(req,res)=>{
    res.send('Protected Route');
}

//forgot password
exports.forgotPasswordController=async (req,res,next)=>{
    try {
        const {email,answer,newPassword}=req.body;
        if(!email){
            res.status(400).send({message:"Email is required"})
        }
        if(!answer){
            res.status(400).send({message:"Answer is required"})
        }
        if(!newPassword){
            res.status(400).send({message:"New password is required"})
        }
        //check
        const user=await User.findOne({email,answer})
        //validation
        if(!user){
            return res.status(404).json({
                success:false,
                message:"Wrong Email or Password"
            })
        }
        console.log("hi")
        const hashed=await hashPassword(newPassword);
        console.log("hi1")
        await User.findByIdAndUpdate(user._id,{password:hashed})
        res.status(200).json({
            success:true,
            message:"Password Reset Successfullly"
        })
    } catch (error) {
        next()=new ErrorHandler(error.message,500)
    }

}
//update-profile
exports.updateProfileController=catchAsyncError(async function(req,res){
    const {name,email,password,cpassword,answer}=req.body;
    const user=await User.findById(req.user._id)
    if(password && password.length<8){
        return res.status(423).send({
            success: false,
            message: "Password Should be 8 Characters Long"
        })
    }
    if (password != cpassword) {
        return res.status(421).send({
            success: false,
            message: "Password Should be Matched"
        })
    }
    const newpassword=await bcrypt.hash(password,15);
    const newcpassword=await bcrypt.hash(cpassword,15);
    const updatedUser=await User.findByIdAndUpdate(req.user._id,{
        name:name || user.name,
        password:newpassword || user.password,
        cpassword:newcpassword || user.cpassword,
        answer:answer || user.answer,
    },{new:true})
    // sendToken(user, 201, res),
    res.status(201).send({
        success: true,
        message: "Your Profile Updated Successfully",
        updatedUser
    })
})

//get all user
exports.getAllUsers = catchAsyncError(async (req, res) => {

    const userCount = await User.countDocuments();
    const resultPerPage = 5;
    const users = await User.find({}).sort({ createdAt: -1 })
    res.status(200).send({
      success: true,
      message: "All Users",
      users,
      userCount
    });
  });

  //update role
  exports.updateRoleController=catchAsyncError(async function(req,res){
    const {role}=req.body
    const {id}=req.params
    const user=await User.findById(id)

    const updatedUser=await User.findByIdAndUpdate(id,{
        role:role || user.role,
 
    },{new:true})
    // sendToken(user, 201, res),
    res.status(201).send({
        success: true,
        status:201,
        message: "User Role Updated Successfully",
        updatedUser
    })
})