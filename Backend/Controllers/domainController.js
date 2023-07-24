const catchAsyncError = require("../middleware/catchAsyncError");
const domainModel = require("../models/domainModel");
const slugify=require("slugify");
const nodeModels = require("../models/nodeModels");
const ErrorHandler = require("../utils/errorHandler");

exports.createDomainController=async(req,res)=>{
    try {
        const {name}=req.body;
        console.log(name)
        if (!name) {
            return res.status(401).send({ message: "Name is required" });
          }
          const existingDomain = await domainModel.findOne({ name });
          if (existingDomain) {
            return res.status(200).send({
              success: true,
              message: "Domain Already Exisits",
            });
          }
          const domain = await new domainModel({
            name,
            slug: slugify(name),
          }).save();
          res.status(201).send({
            success: true,
            message: "new domain created",
            domain,
          });
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in Domain",
            error
        })
        
    }
}

//update
exports.updateDomainController=async(req,res)=>{
    try {
        console.log("hi")
        const {name}=req.body
        const {id}=req.params
        console.log(id)
        const domain=await domainModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
        res.status(200).json({success:true,message:"Domain Updated Successfully",domain})
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in Update Domain",
            error
        })
        
    }

}

//get all domains
exports.getAllDomains = catchAsyncError(async (req, res) => {
    const domains=await domainModel.find({})
    const domainCount=await domainModel.countDocuments();
    res.status(200).send({
      success: true,
      message:"All Domain list",
      domains,
      domainCount
    });
  });

  //get a single domain
  exports.getSingleDomain = catchAsyncError(async (req, res, next) => {
    const domain = await domainModel.findById(req.params.id);
    if (!domain) {
      return next(new ErrorHandler("Domain not found", 404))
    }
    res.status(200).send({
      success: true,
      message: "Domain is found successfully",
      domain
    });
  });

  //delete a domain
  exports.deleteDomain = catchAsyncError(async (req, res, next) => {
    const domain = await domainModel.findById(req.params.id);
    console.log(domain)
    if (!domain) {
      return next(new ErrorHandler("Domain Not Found", 404))
    }
    await domainModel.deleteOne({ _id: req.params.id });
    console.log("domain")
    res.status(200).send({
      success: true,
      message: "Domain Deleted successfully",
    });
  });