const express=require("express");
const { requireSignIn, isAdmin } = require("../middleware/authMiddleware");
const ExpressFormidable = require("express-formidable");
const { createFeedback } = require("../Controllers/feedbackController");
const router=express.Router();

//post a note
console.log("hi")
router.route("/users/feedback").post(requireSignIn,ExpressFormidable(),createFeedback);
module.exports = router;