//Creating Token and Saving it in Cookie
const sendToken = (user, statusCode, res) => {
    // console.log("hellojwt")
    const token = user.generateWebToken();
    // console.log("hellojwt1")
    // console.log(token)

    //options for a cookie
    const option = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };
    // console.log("hellojwt2")
    //stores in cookie
    res.status(statusCode).cookie('token',token,option).json({
        success:true,
        message:"Registration Sucessful",
        user,
        token
    });

}
module.exports=sendToken;