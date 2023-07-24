const mongoose = require("mongoose");
const validator = require("validator");

const userUploadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Note Name"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter Valid Email"]
    },
    slug: {
        type: String,
        lowercase: true,
    },
    domain: {
        type: String,
        required: [true, "Please Enter Note Domain Nmae"],
    },
    author:{
        type: String,
        required: [true, "Please Enter Note Name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please Enter Note Description"]
    },
    rating: {
        type: Number,
        default: 0
    },
    image: {
        data: Buffer,
        contentType: String
    },
    thenote: {
        data: Buffer,
        conrtentType: String
    },
}, { timestamps: true })
module.exports = mongoose.model("Userupload", userUploadSchema);