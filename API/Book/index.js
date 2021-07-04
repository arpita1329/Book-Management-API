// initializing Express Router
const Router = require("express").Router();

// Database Models
const BookModel = require("../../database/book");

/*
    Route : /
    Description : Get all books
    Access : PUBLIC
    Parameters : NONE
    Method : GET
*/
Router.get("/", async (req,res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

/*
    Route : /is
    Description : Get specific books based on ISBN
    Access : PUBLIC
    Parameters : isbn
    Method : GET
*/
Router.get("/is/:isbn", async (req,res) => {
    try {
        const getSpecificBook = await BookModel.findOne({ISBN : req.params.isbn});

    // const getSpecificBook = database.books.filter(
    //     (book) => book.ISBN === req.params.isbn
    // );
    
    if(!getSpecificBook) {
        return res.json({error : `No book found for the ISBN of ${req.params.isbn}`});
    }
    return res.json({book:getSpecificBook});
    } catch(error) {
        res.json({error : error.message});
    }
});

/*
    Route : /c
    Description : Get specific books based on category
    Access : PUBLIC
    Parameters : category
    Method : GET
*/
Router.get("/c/:category", async (req,res) => {
    try {
        const getSpecificBooks = await BookModel.findOne({category : req.params.category});

    // const getSpecificBooks = database.books.filter(
    //     (book) => book.category.includes(req.params.category)
    // );

    if(!getSpecificBooks) {
        return res.json({error : `No book found for the category of ${req.params.category}`});
    }
    return res.json({books:getSpecificBooks});
    } catch(error) {
        res.json({error : error.message});
    }
});

/*
    Route : /a     
    Description : Get specific books based on authors
    Access : PUBLIC
    Parameters : id
    Method : GET
*/
Router.get("/a/:id", async (req,res) => {
    try {
        const getBooks = await BookModel.findOne({authors : req.params.id});

        // const getBooks = database.books.filter(
        //     (book) => book.authors.includes(req.params.id)
          
        // );
    
        if(!getBooks) {
            return res.json({error : `No book found for the author of ID ${req.params.id}`});
        }
        return res.json({books:getBooks});
    } catch(error) {
        res.json({error : error.message});
    }
});

/*
    Route : /book/new
    Description : Add new book
    Access : PUBLIC
    Parameters : NONE
    Method : POST
*/
Router.post("/new", async (req,res) => {
    try {
        const {newBook} = req.body;
        const addNewBook = await BookModel.create(newBook);
        return res.json({books : addNewBook , message : "Book was added!!"});
    } 
    catch(error){
        return res.json({error : error.message});
    }
    // database.books.push(newBook);
    
});

/*
    Route : /book/update
    Description : Update the title of book
    Access : PUBLIC
    Parameters : ISBN
    Method : PUT
*/
Router.put("/update/:isbn", async (req,res) => {
    try {
        const updatedBook = await BookModel.findOneAndUpdate(
            {
                ISBN : req.params.isbn           // find
            },
            {
                title : req.body.bookTitle       // updating
            },
            {
                new : true                       // to assign updated data
            }
        )
        // here we are using forEach as it directly modify the object instead of map as it create new array and replaces it with old one
        // database.books.forEach((book) => {
        //     if(book.ISBN === req.params.isbn) {
        //         book.title = req.body.bookTitle;
        //         return;
        //     }
        // });
        return res.json({books : updatedBook});
    } catch {
       return res.json({error : error.message});
    }
});

/*
    Route : /book/author/update
    Description : Update/add new author
    Access : PUBLIC
    Parameters : ISBN
    Method : PUT
*/
Router.put("/author/update/:isbn", async (req,res) => {
    try {
        // Update the book database
        const updatedBooks = await BookModel.findOneAndUpdate (
            {
                ISBN : req.params.isbn
            },
            {
                $addToSet : 
                {
                    authors : req.body.newAuthor
                }
            },
            {
                new : true
            }
        );
        // database.books.forEach((book) => {
        //     if(book.ISBN === req.params.isbn) 
        //         return book.authors.push(req.body.newAuthor);
        // });

        // Update the author database
        const updatedAuthor = await AuthorModel.findOneAndUpdate (
            {
                id : req.body.newAuthor
            },
            {
                $addToSet :
                {
                    books : req.params.isbn
                }
            },
            {
                new : true
            }
        );
        // database.authors.forEach((author) => {
        //     if(author.id == req.body.newAuthor)
        //         return database.author.books.push(req.params.isbn);
        // });

        return res.json({books : updatedBooks, authors : updatedAuthor, message : "New Author is added"});
    }
    catch {
        return res.json({error : error.message});
     }
});

/*
    Route : /book/delete
    Description : delete a book
    Access : PUBLIC
    Parameters : ISBN
    Method : DELETE
*/
Router.delete("/delete/:isbn", async (req,res) => {
    try {
        const updatedBookDatabase = await BookModel.findOneAndDelete(
            {
                ISBN : req.params.isbn
            },
        );
        // const updatedBookDatabase = database.books.filter((book) => book.ISBN !== req.params.isbn);
        // database.books = updatedBookDatabase;
        return res.json({books : updatedBookDatabase, message : "Book is deleted!!"});
    } catch {
        return res.json({error : error.message});
    }
});

/*
    Route : /book/author/delete
    Description : delete author from book
    Access : PUBLIC
    Parameters : ISBN, author id
    Method : DELETE
*/
Router.delete("/author/delete/:isbn/:authorId", async (req,res) => {
    try {
        // update the book database
        const updatedBook = await BookModel.findOneAndUpdate(
            {
                ISBN : req.params.isbn
            },
            {
                $pull : 
                {
                    authors : parseInt(req.params.authorId)
                }
            },
            {
                new : true
            }
        );
        // database.books.forEach((book) => {
        //     if(book.ISBN === req.params.isbn) {
        //         const newAuthorList = book.authors.filter((author) => author !== parseInt(req.params.authorId));
        //         book.authors = newAuthorList;
        //         return;
        //     }
        // });

        // update the author database
        const updatedAuthor = await AuthorModel.findOneAndUpdate(
            {
                id : parseInt(req.params.authorId)
            },
            {
                $pull : 
                {
                    books : req.params.isbn
                }
            },
            {
                new : true
            }
        )
        // database.authors.forEach((author) => {
        //     if(author.id === parseInt(req.params.authorId)) {
        //         const newBookList = author.books.filter((book) => book !== req.params.isbn);
        //         author.books = newBookList;
        //         return;
        //     }
        // });

        return res.json({books:updatedBook, authors:updatedAuthor, message:"Successfully Deleted"});
    }
    catch {
        return res.json({error : error.message});
    }
});
    

module.exports = Router;