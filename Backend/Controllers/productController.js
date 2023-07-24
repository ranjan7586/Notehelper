const Product = require("../models/nodeModels");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeature = require("../utils/apiFeatures");
const fs = require("fs");
const { default: slugify } = require("slugify");
//create Product -- Admin
exports.createNotes = catchAsyncError(async (req, res, next) => {
  const { name, slug, domain,author, description } = req.fields
  const { image, thenote } = req.files
  if ((image && thenote) && (image.size < 1000000 && thenote.size < 10000000)) {
    const note = await Product.create({ ...req.fields, slug: slugify(name) });
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


//Get All product

exports.getAllProducts = catchAsyncError(async (req, res) => {

  const productCount = await Product.countDocuments();
  const resultPerPage = 5;

  // const apiFeatures = new ApiFeature(Product.find(), req.query).search().filter().pagination(resultPerPage);
  // const notes = await apiFeatures.query;
  const notes = await Product.find({}).populate('domain').select("-image -thenote").limit(10).sort({ createdAt: -1 })
  res.status(200).send({
    success: true,
    message: "All Products",
    notes,
    productCount
  });
});


//Get Note Details

exports.getNoteDetails = catchAsyncError(async (req, res, next) => {
  const note = await Product.findOne({ slug: req.params.slug }).populate('domain').select('-image -thenote');
  if (!note) {
    return next(new ErrorHandler("Note not found", 404))
  }
  res.status(200).json({
    success: true,
    message: "Note is found successfully",
    note
  });
});

//get image of note
exports.getNoteImage = catchAsyncError(async (req, res, next) => {
  const note = await Product.findById(req.params.pid).select("image")
  if (note.image.data) {
    res.set('Content-type', note.image.contentType)
    return res.status(200).send(note.image.data)
  }
})

//get note(pdf,word)

exports.getTheNote = catchAsyncError(async (req, res, next) => {
  const note = await Product.findById(req.params.pid).select("thenote")
  if (!note) {
    return res.status(404).send({
      success: false,
      message: 'Note not found',
    });
  }

  // Set appropriate headers for downloading
  res.set({
    'Content-Type': note.thenote.contentType,
    'Content-Disposition': `attachment; filename="${note.thenote.name}"`,
  });
  return res.status(200).send(note.thenote.data)

})

//update notes

exports.updateNotes = async (req, res, next) => {
  const { name, slug, domain,author, description } = req.fields
  const { image, thenote } = req.files
  if ((image && thenote) && (image.size < 1000000 && thenote.size < 10000000)) {
    res.status(500).false({
      success: true,
      message: "Image & note is required and should be less than 1mb & note size should be less than 10 mb "
    })
  }
  console.log(name)
  const note = await Product.findByIdAndUpdate(req.params.id, { ...req.fields, slug: slugify(name) }, { new: true, runValidators: true, useFindAndModify: false });
  if (!note) {
    return next(new ErrorHandler("Note not found", 404))
  }
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
  res.status(200).json({
    success: true,
    message: "Note Updated Successfully",
    note
  })
}

//delete note
// exports.deleteNotes=async(req,res,next)=>{
//     const note=await Product.findById(req.params.id);
//     if(!note){
//         return res.status(500).json({
//             success:false,
//             massage:"note not found"
//         })
//     }
//     await note.remove();
//     res.status(200).json({
//         success: true,
//         note
//     })
// }

// exports.deleteNotes = async (req, res, next) => {
//     try {
//       const note = await Product.findById(req.params.id);
//       if (!note) {
//         return res.status(500).json({
//           success: false,
//           message: "Note not found",
//         });
//       }
//       await note.remove();
//       res.status(200).json({
//         success: true,
//         note,
//       });
//     } catch (error) {
//       console.error('Error deleting note', error);
//       res.status(500).json({
//         success: false,
//         message: "An error occurred while deleting the note",
//       });
//     }
//   };

//delete notes
exports.deleteNotes = catchAsyncError(async (req, res, next) => {
  const note = await Product.findById(req.params.id);
  if (!note) {
    return next(new ErrorHandler("Note not found", 404))
  }
  await Product.deleteOne({ _id: req.params.id });
  res.status(200).json({
    success: true,
    message: "Note deleted successfully",
  });
});


// filters
exports.notesFilterDomain = catchAsyncError(async (req, res, next) => {
  const { checked } = req.body;
  let args = {}
  if (checked.length > 0) args.domain = checked
  const notes = await Product.find(args).populate('domain');
  res.status(200).send({
    success: true,
    notes
  })
})

//note count
exports.noteCount = catchAsyncError(async (req, res) => {
  const total = await Product.find({}).estimatedDocumentCount()
  res.status(200).send({
    success: true,
    total
  })
})

//note per page
exports.noteListController = catchAsyncError(async (req, res) => {
  const perPage = 9
  const page = req.params.page ? req.params.page : 1
  const notes = await Product.find({}).populate('domain').select('-image').skip((page - 1) * perPage).limit(perPage).sort({ createdAt:- 1})
  res.status(200).send({
    success: true,
    notes
  })
})

//search note
exports.searchNoteController=catchAsyncError(async(req,res)=>{
  const {keyword}=req.params
  const result=await Product.find({
    $or:[
      {name:{$regex : keyword,$options:"i"}},
      {description:{$regex : keyword,$options:"i"}}
    ]
  }).select('-image')
  res.json(result);
})

//related Product Controller
exports.relatedProductController=catchAsyncError(async(req,res)=>{
  const {pid,did}=req.params;
  const notes=await Product.find({domain:did,_id:{$ne:pid}}).populate('domain').select('-image -thenote').limit(3)
  res.status(200).send({
    success:true,
    notes
  })
})