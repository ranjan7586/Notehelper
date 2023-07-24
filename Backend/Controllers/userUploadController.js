const userUploadNote=require("../models/userUploadModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const fs = require("fs");
const { default: slugify } = require("slugify");
//create Product -- Admin
exports.userCreateNotes = catchAsyncError(async (req, res, next) => {
    console.log("wekcone")
    const { name,email, slug,author, domain, description } = req.fields
    const { image, thenote } = req.files
    if ((image && thenote) && (image.size < 1000000 && thenote.size < 10000000)) {
      const note = await userUploadNote.create({ ...req.fields, slug: slugify(name) });
      if (image) {
        note.image.data = fs.readFileSync(image.path);
        note.image.contentType = image.type
      }
      // Store the note file (PDF/Word document) in the database
      if (thenote) {
        note.thenote.data = fs.readFileSync(thenote.path);
        note.thenote.contentType = thenote.type;
      }
      await note.save();
      res.status(201).send({
        success: true,
        message: "Note Ctreated Successfully",
        note
      })
    }
    else {
      res.status(501).send({
        status: 501,
        success: false,
        message: "Image & note is required and should be less than 1mb & note size should be less than 10 mb "
      })
    }
  
  });