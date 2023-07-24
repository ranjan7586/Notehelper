const mongoose = require("mongoose");
const domainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
});

// export default mongoose.model("domain", domainSchema);
module.exports=mongoose.model("Domain",domainSchema);