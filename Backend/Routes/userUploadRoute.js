const express=require("express");
const { requireSignIn, isAdmin } = require("../middleware/authMiddleware");
const ExpressFormidable = require("express-formidable");
const { userCreateNotes } = require("../Controllers/userUploadController");
const router=express.Router();

//post a note
router.route("/notes/users/create-note").post(requireSignIn,ExpressFormidable(),userCreateNotes);
module.exports = router;