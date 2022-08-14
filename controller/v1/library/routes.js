const express = require('express');

const libraryRouter = express.Router();
const library = require('./library');

// Get forms
libraryRouter.get('/book/form', library.bookForm);

libraryRouter.get('/magazine/form', library.magazineForm);

libraryRouter.get('/search/form', library.searchForm);

// Get books and magazines
libraryRouter.get('/books', library.fetchAllBooks);

libraryRouter.get('/magazines', library.fetchAllMagazines);

libraryRouter.get('/books-and-magazines', library.booksAndMagazines);

// Create books and magazines
libraryRouter.post('/book', library.createBook);

libraryRouter.post('/magazine', library.createMagazine);

// Search books and magazines
libraryRouter.post('/search', library.search);

module.exports = { libraryRouter };
