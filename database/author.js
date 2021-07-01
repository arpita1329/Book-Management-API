const mongoose = require("mongoose");

// creating author schema
const AuthorSchema = mongoose.Schema(
    {
        id : Number,
        name : String,
        books : [String],
    }
);

// create a Author model
const AuthorModel = mongoose.model("authors", AuthorSchema);

// exporting the model
module.exports = AuthorModel;