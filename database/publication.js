const mongoose = require("mongoose");

// creating author schema
const PublicationSchema = mongoose.Schema(
    {
        id : Number,
        name : String,
        books : [String],
    }
);

// create a Publication model
const PublicationModel = mongoose.model("publications", PublicationSchema);

// exporting the model
module.exports = PublicationModel;