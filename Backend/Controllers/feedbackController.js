const FeedbackModel = require("../models/FeedbackModel");

exports.createFeedback=async(req,res)=>{
    console.log("name")
    try {
        console.log("name")
        const {name,email,message}=req.fields;
        if (!name) {
            return res.status(401).send({ message: "Name is required" });
          }
        if (!email) {
            return res.status(401).send({ message: "Email is required" });
          }
        if (!message) {
            return res.status(401).send({ message: "Message is required" });
          }
          
          const feedback = await FeedbackModel.create({...req.fields});
          await feedback.save();
          res.status(201).send({
            success:true,
            message:"Feedback send successfully",
            feedback
          })        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in Giving Feedback",
            error
        })
        
    }
}