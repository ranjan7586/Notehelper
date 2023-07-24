const mongoose = require("mongoose");
const validator = require("validator");
const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true,"Please Enter Your Name"],
  },
  email:{
    type: String,
    required: [true, "Please Enter Your Email"],
    validate: [validator.isEmail, "Please Enter Valid Email"]
  },
  message: {
    type: String,
    required: [true, "Please Enter Your Email"],
  },
});

// export default mongoose.model("domain", domainSchema);
module.exports=mongoose.model("Feedback",feedbackSchema);