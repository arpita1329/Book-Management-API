// Data for Books
let books = [
    {
        ISBN : "12345ONE",
        title : "Getting Started with MERN",
        authors : [1,2],
        language : "en",
        pubDate : "2021-07-07",
        numOfPage : 250,
        category : [ "Programming", "Tech", "WebDev"],
        publication : 1,
    },
    {
        ISBN : "1234",
        title : "Getting Started with C++",
        authors : [1,2],
        language : "en",
        pubDate : "2021-07-07",
        numOfPage : 256,
        category : ["fiction", "Programming", "Tech", "WebDev"],
        publication : 2,
    }
];

// Data for Authors
let authors = [
    {
        id : 1,
        name : "Arpita",
        books : ["12345ONE"],
    },
    {
        id : 2,
        name : "Mayra",
        books : ["1234"],
    }
];

// Data for Publications
let publications = [
    {
        id : 1,
        name : "Chakra",
        books : ["12345ONE"],
    },
    {
        id : 2,
        name : "Chakra",
        books : ["1234"],
    }
];

// Export the database
module.exports = {books, authors, publications};