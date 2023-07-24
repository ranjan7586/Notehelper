const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const catchAsyncError = require("../middleware/catchAsyncError");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxlength: [30, "Name Can't Exceed More Than 30 Characters"],
        minlength: [4, "Name Should Contain More Than 4 Characters"],
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter Valid Email"]
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minlength: [8, "Password Should Contain More Than 8 Characters"],
        select: false

    },
    cpassword: {
        type: String,
        required: [true, "Please Confirm Your Password"],
        minlength: [8, "Password Should Contain More Than 8 Characters"],
        select: false

    },
    answer:{
        type:String,
        required:true
    },
    // tokens:[{
    //     token:{
    //         type: String,
    //         required: true
    //     }

    // }],
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
});

//password hashing
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password=await bcrypt.hash(this.password,15);
    this.cpassword=await bcrypt.hash(this.cpassword,15);
})

//generating web token
userSchema.methods.generateWebToken=function(){
    let token=jwt.sign({_id:this._id},process.env.SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE
    });
    // console.log(-id)
    return token;
}

module.exports=mongoose.model("User",userSchema);