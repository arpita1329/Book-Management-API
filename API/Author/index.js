// initializing Express Router
const Router = require("express").Router();

// Database Models
const AuthorModel = require("../../database/author");

/*
    Route : /authors
    Description : Get all authors
    Access : PUBLIC
    Parameters : NONE
    Method : GET
*/
Router.get("/", async (req,res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json({authors:getAllAuthors});
}); 

/*
    Route : /authors/a    
    Description : Get specific authors
    Access : PUBLIC
    Parameters : id
    Method : GET
*/
Router.get("/a/:id", async (req,res) => {
    try {
        const getSpecificAuthor = await AuthorModel.findOne({id : req.params.id});

        // const getSpecificAuthor = database.authors.filter(
        //     (author) => author.id == req.params.id
        // );
        if(!getSpecificAuthor) {
            return res.json({error : `No Author found for the ID of ${req.params.id}`});
        }
        return res.json({authors:getSpecificAuthor});
    }
    catch(error) {
        return res.json({error : error.message});
    }
});



/*
    Route : /authors
    Description : Get all authors based on book
    Access : PUBLIC
    Parameters : ISBN
    Method : GET
*/
Router.get("/:isbn", async (req,res) => {
    try {
        const getSpecificAuthors = await AuthorModel.findOne({books : req.params.isbn});

        // const getSpecificAuthors = database.authors.filter(
        //     (author) => author.books.includes(req.params.isbn)
        // );

        if(!getSpecificAuthors) {
            return res.json({error : `No Author found for the ISBN of book ${req.params.isbn}`});
        }
        return res.json({authors:getSpecificAuthors});
    }
    catch(error) {
        return res.json({error : error.message});
    }
});

/*
    Route : /author/new
    Description : Add new author
    Access : PUBLIC
    Parameters : NONE
    Method : POST
*/
Router.post("/new",(req,res) => {
    try {
        const {newAuthor} = req.body;
        const addNewAuthor = AuthorModel.create(newAuthor);
        // database.authors.push(newAuthor);
        return res.json({authors : addNewAuthor , message : "Author was added!!"});
    }
    catch(error) {
        return res.json({error : error.message});
    }
});

/*
    Route : /author/update
    Description : Update the name of author
    Access : PUBLIC
    Parameters : ID
    Method : PUT
*/
Router.put("/update/:id", async (req,res) => {
    try {
        const updatedAuthor = await AuthorModel.findOneAndUpdate(
            {
                id : req.params.id
            },
            {
                name : req.body.authorName
            },
            {
                new : true
            }
        );
        // here we are using forEach as it directly modify the object instead of map as it create new array and replaces it with old one
        // database.authors.forEach((author) => {
        //     if(author.id == req.params.id) {
        //         author.name = req.body.authorName;
        //         return;
        //     }
        // });
        return res.json({authors : updatedAuthor});
    } catch(error) {
        return res.json({error : error.message});
    }
});

/*
    Route : /author/delete
    Description : delete a author
    Access : PUBLIC
    Parameters : id
    Method : DELETE
*/
Router.delete("/delete/:id", async (req,res) => {
    try {
        const updatedAuthorDatabase = await AuthorModel.findOneAndDelete(
            {
                id : req.params.id
            },
        );
        // const updatedAuthorDatabase = database.authors.filter((author) => author.id !== parseInt(req.params.id));
        // database.authors = updatedAuthorDatabase;
        return res.json({authors : updatedAuthorDatabase, message : "Successfully Deleted"});
    }
    catch(error) {
        return res.json({error : error.message});
    }
});

module.exports = Router;