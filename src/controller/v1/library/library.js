const { errorResponse, successResponse } = require('../../../responses/response');
const { viewsFilePath, pagePath } = require('../../../constants');
const { bookService, magazineService, libraryService } = require('../../../service/service');

const bookForm = (req, res) => {
  try {
    const message = req.flash('message');
    res.render(viewsFilePath.createBook, { message });
  } catch (error) {
    errorResponse(error, req, res, pagePath.bookForm);
  }
};

const magazineForm = (req, res) => {
  try {
    const message = req.flash('message');
    res.render(viewsFilePath.createMagazine, { message });
  } catch (error) {
    errorResponse(error, req, res, pagePath.magazineForm);
  }
};

const searchForm = (req, res) => {
  try {
    const message = req.flash('message');
    res.render(viewsFilePath.search, { message });
  } catch (error) {
    errorResponse(error, req, res, pagePath.searchForm);
  }
};

const createBook = async (req, res) => {
  try {
    const bookDetails = req.body;
    delete bookDetails.submit;

    const message = await bookService.createBook(bookDetails);

    successResponse(message, req, res, pagePath.bookForm);
  } catch (error) {
    errorResponse(error, req, res, false, pagePath.bookForm);
  }
};

const createMagazine = async (req, res) => {
  try {
    const magazineDetails = req.body;
    delete magazineDetails.submit;

    const message = await magazineService.createMagazine(magazineDetails);

    successResponse(message, req, res, pagePath.magazineForm);
  } catch (error) {
    errorResponse(error, req, res, false, pagePath.magazineForm);
  }
};

const fetchAllBooks = async (req, res) => {
  try {
    const { message, content, table } = await libraryService.fetchAllBooks();

    res.render(viewsFilePath.books, { message, data: { content, table } });
  } catch (error) {
    errorResponse(error, req, res, false, pagePath.home);
  }
};

const fetchAllMagazines = async (req, res) => {
  try {
    const { message, content, table } = await libraryService.fetchAllMagazines();

    res.render(viewsFilePath.magazines, { message, data: { content, table } });
  } catch (error) {
    errorResponse(error, req, res, false, pagePath.home);
  }
};

const booksAndMagazines = async (req, res) => {
  try {
    const { message, content, table } = await libraryService.fetchAllBooksAndMagazines();

    res.render(viewsFilePath.booksAndMagazines, { message, data: { content, table } });
  } catch (error) {
    errorResponse(error, req, res, false, pagePath.home);
  }
};

const search = async (req, res) => {
  try {
    const filter = req.body.type === 'ISBN' ? { isbn: req.body.filter.trim() } : { authors: req.body.filter.trim() };

    const { message, content, table } = await libraryService.searchByFilter(filter);

    res.render(viewsFilePath.booksAndMagazines, { message, data: { content, table } });
  } catch (error) {
    errorResponse(error, req, res, false, pagePath.searchForm);
  }
};

module.exports = {
  bookForm,
  magazineForm,
  searchForm,
  createBook,
  createMagazine,
  fetchAllBooks,
  fetchAllMagazines,
  booksAndMagazines,
  search,
};
