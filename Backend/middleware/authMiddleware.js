const jwt=require("jsonwebtoken");
const userModels = require("../models/userModels");
exports.requireSignIn=async(req,res,next)=>{
    try {
        const decode=jwt.verify(
            req.headers.authorization,
            process.env.SECRET_KEY
        );
        req.user=decode;
        next();
        
    } catch (error) {
        console.log(error);
        
    }
}

//admin access
exports.isAdmin=async (req,res,next)=>{
    try {
        const user= await userModels.findById(req.user._id);
        if(user.role!=="admin"){
            return res.status(401).json({
                success:false,
                mesage:"Unauthorized Access"
            })
        }
        else{
            next();
        }
    } catch (error) {
        console.log(error);
        
    }
}