const { container } = require('../externalService/dependencyInjection');

const libraryService = container.resolve('libraryService');

const fileService = container.resolve('fileService');

const bookService = container.resolve('bookService');

const magazineService = container.resolve('magazineService');

module.exports = { libraryService, fileService, bookService, magazineService };
