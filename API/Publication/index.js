// initializing Express Router
const Router = require("express").Router();

// Database Models
const PublicationModel = require("../../database/publication");

/*
    Route : /publications
    Description : Get all publications
    Access : PUBLIC
    Parameters : NONE
    Method : GET
*/
Router.get("/", async (req,res) => { 
    try {
        const getAllPublications = await PublicationModel.find();
        return res.json({publications:getAllPublications});
    } catch(error) {
        return res.json({error : error.message});
    }
}); 

/*
    Route : /publications
    Description : Get specific publication
    Access : PUBLIC
    Parameters : id
    Method : GET
*/
Router.get("/:id", async (req,res) => {
    try {
        const getSpecificPublication = await PublicationModel.findOne({id : req.params.id});

        // const getSpecificPublication = database.publications.filter(
        //     (publication) => publication.id == req.params.id
        // );

        if(!getSpecificPublication) {
            return res.json({error : `No book found for the ID of ${req.params.id}`});
        }

        return res.json({publications:getSpecificPublication});
    } catch(error) {
        return res.json({error : error.message});
    }
});

/*
    Route : /publications/p
    Description : Get a list of publications based on book
    Access : PUBLIC
    Parameters : ISBN
    Method : GET
*/
Router.get("/p/:isbn", async (req,res) => {
   try {
    const getPublications = await PublicationModel.findOne({books : req.params.isbn});

    // const getPublications = database.publications.filter(
    //     (publication) => publication.books.includes(req.params.isbn)
    // );
    if(!getPublications) {
        return res.json({error : `No Publication found for the ISBN of book ${req.params.isbn}`});
    }
    return res.json({publications:getPublications});
   } catch(error) {
        return res.json({error : error.message});
    }
});




/*
    Route : /publication/new
    Description : Add new publication
    Access : PUBLIC
    Parameters : NONE
    Method : POST
*/
Router.post("/new",(req,res) => {
    try {
        const {newPublication} = req.body;
        const addNewPublication = PublicationModel.create(newPublication);
        // database.publications.push(newPublication);
        return res.json({publications : addNewPublication , message : "Publication was added!!"});
    }
    catch(error) {
        return res.json({error : error.message});
    }
});




/*
    Route : /publication/update
    Description : Update the name of publication
    Access : PUBLIC
    Parameters : ID
    Method : PUT
*/
Router.put("/update/:id", async (req,res) => {
    try {
        const updatedPublication = await PublicationModel.findOneAndUpdate(
            {
                id : req.params.id
            },
            {
                name : req.body.publicationName
            },
            {
                new : true
            }
        );
        // here we are using forEach as it directly modify the object instead of map as it create new array and replaces it with old one
        // database.publications.forEach((publication) => {
        //     if(publication.id == req.params.id) {
        //         publication.name = req.body.publicationName;
        //         return;
        //     }
        // });
        return res.json({publications : updatedPublication});
    }
    catch(error) {
        return res.json({error : error.message});
    }
});

/*
    Route : /publication/book/update    (NOT WORKING)
    Description : Update/add new book to an publication
    Access : PUBLIC
    Parameters : ISBN
    Method : PUT
*/
Router.put("/book/update/:isbn", async (req,res) => {
    try {   
     // Update the book database
     const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN : req.params.isbn
        },
        {
            $addToSet :
            {
                publication : req.body.newPublication
            }
        },
        {
            new : true
        }
    );
    //  database.books.forEach((book) => {
    //     if(book.ISBN === req.params.isbn) 
    //        book.publications=req.body.newPublication;
    //        return ;
    // });

    // Update the publication database
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            id : req.body.newPublication
        },
        {
            $addToSet: 
            {
                books : req.params.isbn
            }
        },
        {
            new : true
        }
    );
    // database.publications.forEach((publication) => {
    //     if(publication.id == req.body.newPublication)
    //         return publication.books.push(req.params.isbn);
    // });

    return res.json({publications : updatedPublication, books : updatedBook, message : "New publication is added"});
    }
    catch(error) {
        return res.json({error : error.message});
    }
});





/*
    Route : /publication/delete
    Description : delete a publication
    Access : PUBLIC
    Parameters : id
    Method : DELETE
*/
Router.delete("/publication/delete/:id", async (req,res) => {
   try {
        const updatedPublicationDatabase = await PublicationModel.findOneAndDelete(
            {
                id : req.params.id
            }
        );
        // const updatedPublicationDatabase = database.publications.filter((publication) => publication.id !== parseInt(req.params.id));
        // database.publications = updatedPublicationDatabase;
        return res.json({publications : updatedPublicationDatabase, message : "Successfully Deleted"});
   }
    catch(error) {
        return res.json({error : error.message});
    }
});

/*
    Route : /publication/delete/book
    Description : delete a book from publication
    Access : PUBLIC
    Parameters : ISBN, publication id
    Method : DELETE
*/
Router.delete("/publication/delete/book/:isbn/:pubId", async (req,res) => {
    try {
        // update the publication database
    const updatedPublicationDatabase = await PublicationModel.findOneAndDelete(
        {
            id : parseInt(req.params.pubId)
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
    );
    //  database.publications.forEach((publication) => {
    //     if(publication.id === parseInt(req.params.pubId)) {
    //         const newPublicationList = publication.books.filter((book) => book !== req.params.isbn);
    //         publication.books = newPublicationList;
    //         return;
    //     }
    // });
    
    // update the book database
    const updatedBookDatabase = await BookModel.findOneAndDelete(
        {
            ISBN : req.params.isbn
        },
        {
            $pull :
            {
                publication : parseInt(req.params.pubId)
            }
        },
        {
            new : true
        }
    );
    // database.books.forEach((book) => {
    //     if(book.ISBN === req.params.isbn) {
    //         book.publication = 0;       // no publication is available
    //         return;
    //     }
    // });


    return res.json({books:updatedBookDatabase, publications:updatedPublicationDatabase, message:"Successfully Deleted"});
    }
    catch(error) {
        return res.json({error : error.message});
    }
});

module.exports = Router;
