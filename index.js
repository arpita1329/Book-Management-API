require("dotenv").config();

const mongoose = require("mongoose");

// Framework
const express = require("express");

// Importing the database
const database = require("./database/index");

// Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

// MicroServices Routes
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications = require("./API/Publication");

// Initialising
const ShapeAI = express();

// Configuration
ShapeAI.use(express.json());

// Establishe database connection
mongoose.connect(
    process.env.MONGO_URL, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }
) .then(() => console.log("Connection Established"));

// Initializing MicroServices
ShapeAI.use("/book",Books);
ShapeAI.use("/author",Authors);
ShapeAI.use("/publication",Publications);

// Run the Server
ShapeAI.listen(3000);