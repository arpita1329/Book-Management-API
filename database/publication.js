const mongoose = require("mongoose");

// creating author schema
const PublicationSchema = mongoose.Schema(
    {
        id :{
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

// create a Publication model
const PublicationModel = mongoose.model("publications", PublicationSchema);

// exporting the model
module.exports = PublicationModel;