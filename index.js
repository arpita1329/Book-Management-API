require("dotenv").config();

const mongoose = require("mongoose");

// Framework
const express = require("express");

// Importing the database
const database = require("./database/index");

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

/*
    Route : /book/new
    Description : Add new book
    Access : PUBLIC
    Parameters : NONE
    Method : POST
*/
ShapeAI.post("/book/new",(req,res) => {
    const {newBook} = req.body;
    database.books.push(newBook);
    return res.json({books : database.books , message : "Book was added!!"});
});

/*
    Route : /author/new
    Description : Add new author
    Access : PUBLIC
    Parameters : NONE
    Method : POST
*/
ShapeAI.post("/author/new",(req,res) => {
    const {newAuthor} = req.body;
    database.authors.push(newAuthor);
    return res.json({authors : database.authors , message : "Author was added!!"});
});

/*
    Route : /publication/new
    Description : Add new publication
    Access : PUBLIC
    Parameters : NONE
    Method : POST
*/
ShapeAI.post("/publication/new",(req,res) => {
    const {newPublication} = req.body;
    database.publications.push(newPublication);
    return res.json({publications : database.publications , message : "Publication was added!!"});
});

/*
    Route : /book/update
    Description : Update the title of book
    Access : PUBLIC
    Parameters : ISBN
    Method : PUT
*/
ShapeAI.put("/book/update/:isbn",(req,res) => {
    // here we are using forEach as it directly modify the object instead of map as it create new array and replaces it with old one
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            book.title = req.body.bookTitle;
            return;
        }
    });
    return res.json({books : database.books});
});

/*
    Route : /book/author/update
    Description : Update/add new author
    Access : PUBLIC
    Parameters : ISBN
    Method : PUT
*/
ShapeAI.put("/book/author/update/:isbn", (req,res) => {
    // Update the book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) 
            return book.authors.push(req.body.newAuthor);
    });

    // Update the author database
    database.authors.forEach((author) => {
        if(author.id == req.body.newAuthor)
            return database.author.books.push(req.params.isbn);
    });

    return res.json({books : database.books, authors : database.authors, message : "New Author is added"});
});

/*
    Route : /author/update
    Description : Update the name of author
    Access : PUBLIC
    Parameters : ID
    Method : PUT
*/
ShapeAI.put("/author/update/:id",(req,res) => {
    // here we are using forEach as it directly modify the object instead of map as it create new array and replaces it with old one
    database.authors.forEach((author) => {
        if(author.id == req.params.id) {
            author.name = req.body.authorName;
            return;
        }
    });
    return res.json({authors : database.authors});
});

/*
    Route : /publication/update
    Description : Update the name of author
    Access : PUBLIC
    Parameters : ID
    Method : PUT
*/
ShapeAI.put("/publication/update/:id",(req,res) => {
    // here we are using forEach as it directly modify the object instead of map as it create new array and replaces it with old one
    database.publications.forEach((publication) => {
        if(publication.id == req.params.id) {
            publication.name = req.body.publicationName;
            return;
        }
    });
    return res.json({publications : database.publications});
});

/*
    Route : /publication/book/update    (NOT WORKING)
    Description : Update/add new book to an publication
    Access : PUBLIC
    Parameters : ISBN
    Method : PUT
*/
ShapeAI.put("/publication/book/update/:isbn", (req,res) => {

    // Update the publication database
    database.publications.forEach((publication) => {
        if(publication.id == req.body.newPublication)
            return publication.books.push(req.params.isbn);
    });

     // Update the book database
     database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) 
           book.publications=req.body.newPublication;
           return ;
    });
    return res.json({publications : database.publications, books : database.books, message : "New publication is added"});
});

/*
    Route : /book/delete
    Description : delete a book
    Access : PUBLIC
    Parameters : ISBN
    Method : DELETE
*/
ShapeAI.delete("/book/delete/:isbn", (req,res) => {
    const updatedBookDatabase = database.books.filter((book) => book.ISBN !== req.params.isbn);
    database.books = updatedBookDatabase;
    return res.json({books : database.books});
});

/*
    Route : /book/author/delete
    Description : delete author from book
    Access : PUBLIC
    Parameters : ISBN, author id
    Method : DELETE
*/
ShapeAI.delete("/book/author/delete/:isbn/:authorId", (req,res) => {
    // update the book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            const newAuthorList = book.authors.filter((author) => author !== parseInt(req.params.authorId));
            book.authors = newAuthorList;
            return;
        }
    });

    // update the author database
    database.authors.forEach((author) => {
        if(author.id === parseInt(req.params.authorId)) {
            const newBookList = author.books.filter((book) => book !== req.params.isbn);
            author.books = newBookList;
            return;
        }
    });

    return res.json({books:database.books, authors:database.authors, message:"Successfully Deleted"});
});

/*
    Route : /author/delete
    Description : delete a author
    Access : PUBLIC
    Parameters : id
    Method : DELETE
*/
ShapeAI.delete("/author/delete/:id", (req,res) => {
    const updatedAuthorDatabase = database.authors.filter((author) => author.id !== parseInt(req.params.id));
    database.authors = updatedAuthorDatabase;
    return res.json({authors : database.authors});
});

/*
    Route : /publication/delete
    Description : delete a publication
    Access : PUBLIC
    Parameters : id
    Method : DELETE
*/
ShapeAI.delete("/publication/delete/:id", (req,res) => {
    const updatedPublicationDatabase = database.publications.filter((publication) => publication.id !== parseInt(req.params.id));
    database.publications = updatedPublicationDatabase;
    return res.json({publications : database.publications});
});

/*
    Route : /publication/delete/book
    Description : delete a book from publication
    Access : PUBLIC
    Parameters : ISBN, publication id
    Method : DELETE
*/
ShapeAI.delete("/publication/delete/book/:isbn/:pubId", (req,res) => {
     // update the publication database
     database.publications.forEach((publication) => {
        if(publication.id === parseInt(req.params.pubId)) {
            const newPublicationList = publication.books.filter((book) => book !== req.params.isbn);
            publication.books = newPublicationList;
            return;
        }
    });
    
    // update the book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            book.publication = 0;       // no publication is available
            return;
        }
    });


    return res.json({books:database.books, publications:database.publications, message:"Successfully Deleted"});
});



// Run the Server
ShapeAI.listen(3000);