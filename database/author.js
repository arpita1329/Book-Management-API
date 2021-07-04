const mongoose = require("mongoose");

// creating author schema
const AuthorSchema = mongoose.Schema(
    {
        id : {
            type : Number,
            required : true,
        },
        name : {
            type : String,
            required : true,
            minLength : 4,
            maxLength : 20
        },
        books : [String],
    }
);

// create a Author model
const AuthorModel = mongoose.model("authors", AuthorSchema);

// exporting the model
module.exports = AuthorModel;