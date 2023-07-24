const express=require("express");
const { requireSignIn, isAdmin } = require("../middleware/authMiddleware");
const ExpressFormidable = require("express-formidable");
const { createContactController } = require("../Controllers/contactController");
const router=express.Router();

//post a note
router.route("/users/contact").post(requireSignIn,ExpressFormidable(),createContactController);
module.exports = router;