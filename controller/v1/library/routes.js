const express = require('express');

const libraryRouter = express.Router();
const library = require('./library');

// Get forms
libraryRouter.get('/book/form', library.bookForm);

libraryRouter.get('/magazine/form', library.magazineForm);

libraryRouter.get('/search', library.searchForm);

// Get books and magazines
// libraryRouter.get('/book', library.books);

// libraryRouter.get('/magazine', library.magazines);

// libraryRouter.get('/book-and-magazine', library.booksAndMagazines);

// Create books and magazines
libraryRouter.post('/book', library.createBook);

libraryRouter.post('/magazine', library.createMagazine);

// Search books and magazines
// libraryRouter.post('/search', library.search);


module.exports = { libraryRouter };
