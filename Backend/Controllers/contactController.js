const contactModel = require("../models/contactModel");

exports.createContactController=async(req,res)=>{
    try {
        const {name,email,phone,message}=req.fields;
        if (!name) {
            return res.status(401).send({ message: "Name is required" });
          }
        if (!email) {
            return res.status(401).send({ message: "Email is required" });
          }
        if (!phone) {
            return res.status(401).send({ message: "Phone is required" });
          }
        if (!message) {
            return res.status(401).send({ message: "Message is required" });
          }
          
          const contact = await contactModel.create({...req.fields});
          await contact.save();
          res.status(201).send({
            success:true,
            message:"Message send successfully",
            contact
          })        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in Contacting",
            error
        })
        
    }
}