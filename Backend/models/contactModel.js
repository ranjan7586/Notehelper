const mongoose = require("mongoose");
const validator = require("validator");
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true,"Please Enter Your Name"],
  },
  email:{
    type: String,
    required: [true, "Please Enter Your Email"],
    validate: [validator.isEmail, "Please Enter Valid Email"]
  },
  phone:{
    type: String,
    required: [true, "Please Enter Your Phone No"],
    validate: [validator.isMobilePhone, "Please Enter Valid Phone No"],
    minlength: [10, "Phone No Should Contain 10 digits"]
  },
  message: {
    type: String,
    required: [true, "Please Enter Your Message"],
  },
});

// export default mongoose.model("domain", domainSchema);
module.exports=mongoose.model("Contact",contactSchema);