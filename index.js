// Framework
const express = require("express");

// Importing the database
const database = require("./database/index");

// Initialising
const ShapeAI = express();

// Configuration
ShapeAI.use(express.json());

/*
    Route : /
    Description : Get all books
    Access : PUBLIC
    Parameters : NONE
    Method : GET
*/
ShapeAI.get("/",(req,res) => {
    return res.json({book:database.books});
});

/*
    Route : /is
    Description : Get specific books based on ISBN
    Access : PUBLIC
    Parameters : isbn
    Method : GET
*/
ShapeAI.get("/is/:isbn", (req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    );
    if(getSpecificBook.length==0) {
        return res.json({error : `No book found for the ISBN of ${req.params.isbn}`});
    }
    return res.json({book:getSpecificBook});
});

/*
    Route : /c
    Description : Get specific books based on category
    Access : PUBLIC
    Parameters : category
    Method : GET
*/
ShapeAI.get("/c/:category", (req,res) => {
    const getSpecificBooks = database.books.filter(
        (book) => book.category.includes(req.params.category)
    );
    if(getSpecificBooks.length==0) {
        return res.json({error : `No book found for the category of ${req.params.category}`});
    }
    return res.json({book:getSpecificBooks});
});

/*
    Route : /a     (NOT WORKING)
    Description : Get specific books based on authors
    Access : PUBLIC
    Parameters : id
    Method : GET
*/
ShapeAI.get("/a/:id", (req,res) => {
    const getBooks = database.books.filter(
        (book) => book.authors.includes(req.params.id)
      
    );
    if(getBooks.length==0) {
        return res.json({error : `No book found for the author of ID ${req.params.id}`});
    }
    return res.json({book:getBooks});
});

/*
    Route : /authors
    Description : Get all authors
    Access : PUBLIC
    Parameters : NONE
    Method : GET
*/
ShapeAI.get("/authors",(req,res) => {
    return res.json({authors:database.authors});
}); 

/*
    Route : /authors/a    
    Description : Get specific authors
    Access : PUBLIC
    Parameters : id
    Method : GET
*/
ShapeAI.get("/authors/a/:id", (req,res) => {
    const getSpecificAuthor = database.authors.filter(
        (author) => author.id == req.params.id
    );
    if(getSpecificAuthor.length===0) {
        return res.json({error : `No Author found for the ID of ${req.params.id}`});
    }
    return res.json({authors:getSpecificAuthor});
});



/*
    Route : /authors
    Description : Get all authors based on book
    Access : PUBLIC
    Parameters : ISBN
    Method : GET
*/
ShapeAI.get("/authors/:isbn", (req,res) => {
    const getSpecificAuthors = database.authors.filter(
        (author) => author.books.includes(req.params.isbn)
    );
    if(getSpecificAuthors.length===0) {
        return res.json({error : `No Author found for the ISBN of book ${req.params.isbn}`});
    }
    return res.json({authors:getSpecificAuthors});
});

/*
    Route : /publications
    Description : Get all publications
    Access : PUBLIC
    Parameters : NONE
    Method : GET
*/
ShapeAI.get("/publications",(req,res) => {
    return res.json({publications:database.publications});
}); 

/*
    Route : /publications
    Description : Get specific publication
    Access : PUBLIC
    Parameters : id
    Method : GET
*/
ShapeAI.get("/publications/:id", (req,res) => {
    const getSpecificPublication = database.publications.filter(
        (publication) => publication.id == req.params.id
    );
    if(getSpecificPublication.length==0) {
        return res.json({error : `No book found for the ID of ${req.params.id}`});
    }
    return res.json({publications:getSpecificPublication});
});

/*
    Route : /publications/p
    Description : Get a list of publications based on book
    Access : PUBLIC
    Parameters : ISBN
    Method : GET
*/
ShapeAI.get("/publications/p/:isbn", (req,res) => {
    const getPublications = database.publications.filter(
        (publication) => publication.books.includes(req.params.isbn)
    );
    if(getPublications.length==0) {
        return res.json({error : `No Publication found for the ISBN of book ${req.params.isbn}`});
    }
    return res.json({publications:getPublications});
});


// Run the Server
ShapeAI.listen(3000);