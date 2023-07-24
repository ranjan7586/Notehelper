const express=require("express");
const app=express();
const path=require("path")
const errMiddleware=require("./middleware/error");
// const cors=require("cors");
const cors = require('cors');
app.use(express.json());
//route import
const noteRoute=require("./Routes/productRoute");
const userRoute=require("./Routes/userRoute");
const domainRoute=require("./Routes/domainRoute");
const userUploadRoute=require("./Routes/userUploadRoute");
const allowCrossDomain = require("./middleware/corsError");
const feedbackRoute=require("./Routes/feedbackRoute")
const contactRoute=require("./Routes/contactRoute")
app.use("/api/v1",noteRoute);

app.use("/api/v1",userRoute);
app.use("/api/v1",domainRoute);
app.use("/api/v1",userUploadRoute);
app.use("/api/v1",feedbackRoute);
app.use("/api/v1",contactRoute);
app.use(allowCrossDomain);
// app.use(cors({
//     origin: "http://localhost:3300"
// }));
app.use(errMiddleware);

app.use(express.static(path.join(__dirname,'../frontend/build')));

app.get('*',function(req,res){
    res.sendFile(path.join(__dirname,'../frontend/build/index.html'));
})

// if(process.env.NODE_ENV=="production"){
//     app.use(express.static("frotend/build"));
//     app.get('*',function(req,res){
//             res.sendFile(path.resolve(__dirname,'frontend','build','index.html'));
//         })
// }

module.exports=app;