const { errorResponse, successResponse } = require('../../../responses/response');
const { viewsFilePath, pagePath } = require('../../../constants');
const { bookService, magazineService } = require('../../../service/service');

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
    errorResponse(error, req, res, error.status ? false : true, pagePath.bookForm);
  }
};

const createMagazine = async (req, res) => {
  try {
    console.log(`🚀 ~ file: library.js ~ line 30 ~ books ~ req.body`, req.body);
    const magazineDetails = req.body;
    delete magazineDetails.submit;
    
    const message = await magazineService.createMagazine(magazineDetails);

    successResponse(message, req, res, pagePath.magazineForm);
  } catch (error) {
    errorResponse(error, req, res, error.status ? false : true, pagePath.magazineForm);
  }
};

const booksAndMagazines = (req, res) => {
  try {
    res.render(viewsFilePath.booksAndMagazines);
  } catch (error) {
    errorResponse(error, req, res, error.status ? false : true, pagePath.bookForm);
  }
};

module.exports = { bookForm, magazineForm, searchForm, createBook, createMagazine, booksAndMagazines };
